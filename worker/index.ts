interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  NAVER_CLIENT_ID?: string;
  NAVER_CLIENT_SECRET?: string;
  DB?: D1Database;
}

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  run(): Promise<unknown>;
  all<T>(): Promise<{ results?: T[] }>;
}

interface D1Database {
  prepare(query: string): D1PreparedStatement;
}

type CrowdStatus = "여유" | "보통" | "혼잡";

interface CrowdReportRow {
  cafe_id: string;
  status: CrowdStatus;
  reported_at: number;
}

interface NaverLocalItem {
  title: string;
  link: string;
  category: string;
  address: string;
  roadAddress: string;
  mapx: string;
  mapy: string;
}

interface NaverLocalResponse {
  items?: NaverLocalItem[];
}

function stripTags(value: string): string {
  return value.replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").trim();
}

async function searchNaverLocal(
  query: string,
  env: Env
): Promise<NaverLocalItem[]> {
  const endpoint = new URL("https://naverapihub.apigw.ntruss.com/search/v1/local");
  endpoint.searchParams.set("query", query);
  endpoint.searchParams.set("display", "5");
  endpoint.searchParams.set("sort", "comment");
  endpoint.searchParams.set("format", "json");

  const response = await fetch(endpoint, {
    headers: {
      "X-NCP-APIGW-API-KEY-ID": env.NAVER_CLIENT_ID!,
      "X-NCP-APIGW-API-KEY": env.NAVER_CLIENT_SECRET!,
    },
  });

  if (!response.ok) return [];

  const data = (await response.json()) as NaverLocalResponse;
  return data.items ?? [];
}

function mixUniqueResults(resultGroups: NaverLocalItem[][]): NaverLocalItem[] {
  const mixed: NaverLocalItem[] = [];
  const seen = new Set<string>();
  const maxGroupSize = Math.max(0, ...resultGroups.map((group) => group.length));

  for (let index = 0; index < maxGroupSize; index += 1) {
    for (const group of resultGroups) {
      const item = group[index];
      if (!item) continue;

      const key = `${item.mapx}:${item.mapy}:${stripTags(item.title)}`;
      if (seen.has(key)) continue;

      seen.add(key);
      mixed.push(item);
      if (mixed.length === 12) return mixed;
    }
  }

  return mixed;
}

function summarizeReports(cafeIds: string[], rows: CrowdReportRow[]) {
  const now = Math.floor(Date.now() / 1000);
  const statuses: CrowdStatus[] = ["혼잡", "보통", "여유"];

  return Object.fromEntries(
    cafeIds.map((cafeId) => {
      const cafeRows = rows.filter((row) => row.cafe_id === cafeId);
      const counts: Record<CrowdStatus, number> = { 여유: 0, 보통: 0, 혼잡: 0 };
      const scores: Record<CrowdStatus, number> = { 여유: 0, 보통: 0, 혼잡: 0 };

      for (const row of cafeRows) {
        counts[row.status] += 1;
        const ageMinutes = (now - row.reported_at) / 60;
        scores[row.status] += ageMinutes <= 15 ? 3 : ageMinutes <= 30 ? 2 : 1;
      }

      const total = cafeRows.length;
      const status = total >= 3
        ? statuses.reduce((best, candidate) =>
            scores[candidate] > scores[best] ? candidate : best
          )
        : null;

      return [
        cafeId,
        {
          cafeId,
          status,
          confidence: total >= 6 ? "높음" : total >= 3 ? "보통" : "대기",
          total,
          counts,
          updatedAt: total ? Math.max(...cafeRows.map((row) => row.reported_at)) : null,
        },
      ];
    })
  );
}

async function loadReportSummaries(db: D1Database, cafeIds: string[]) {
  const since = Math.floor(Date.now() / 1000) - 60 * 60;
  const placeholders = cafeIds.map(() => "?").join(", ");
  const result = await db
    .prepare(
      `SELECT cafe_id, status, reported_at
       FROM cafe_reports
       WHERE cafe_id IN (${placeholders}) AND reported_at >= ?`
    )
    .bind(...cafeIds, since)
    .all<CrowdReportRow>();

  return summarizeReports(cafeIds, result.results ?? []);
}

async function handleReports(request: Request, env: Env): Promise<Response> {
  if (!env.DB) {
    return Response.json(
      { error: "혼잡도 집계를 준비하고 있습니다." },
      { status: 503 }
    );
  }

  try {
    if (request.method === "GET") {
      const url = new URL(request.url);
      const cafeIds = (url.searchParams.get("cafeIds") ?? "")
        .split(",")
        .map((id) => id.trim())
        .filter((id) => /^[a-zA-Z0-9_-]{3,120}$/.test(id))
        .slice(0, 50);

      if (!cafeIds.length) {
        return Response.json({ error: "카페 ID가 필요합니다." }, { status: 400 });
      }

      return Response.json(
        { summaries: await loadReportSummaries(env.DB, cafeIds) },
        { headers: { "Cache-Control": "no-store" } }
      );
    }

    if (request.method === "POST") {
      const body = (await request.json()) as {
        cafeId?: string;
        reporterId?: string;
        status?: CrowdStatus;
      };
      const cafeId = body.cafeId?.trim() ?? "";
      const reporterId = body.reporterId?.trim() ?? "";
      const validStatuses: CrowdStatus[] = ["여유", "보통", "혼잡"];

      if (
        !/^[a-zA-Z0-9_-]{3,120}$/.test(cafeId) ||
        !/^[a-zA-Z0-9_-]{10,80}$/.test(reporterId) ||
        !body.status ||
        !validStatuses.includes(body.status)
      ) {
        return Response.json({ error: "올바르지 않은 제보입니다." }, { status: 400 });
      }

      const reportedAt = Math.floor(Date.now() / 1000);
      await env.DB.prepare(
        `INSERT INTO cafe_reports (cafe_id, reporter_id, status, reported_at)
         VALUES (?, ?, ?, ?)
         ON CONFLICT(cafe_id, reporter_id)
         DO UPDATE SET status = excluded.status, reported_at = excluded.reported_at`
      )
        .bind(cafeId, reporterId, body.status, reportedAt)
        .run();

      const summaries = await loadReportSummaries(env.DB, [cafeId]);
      return Response.json(
        { summary: summaries[cafeId] },
        { headers: { "Cache-Control": "no-store" } }
      );
    }

    return Response.json({ error: "지원하지 않는 요청입니다." }, { status: 405 });
  } catch {
    return Response.json(
      { error: "혼잡도 저장소를 초기화한 뒤 다시 시도해 주세요." },
      { status: 503 }
    );
  }
}

async function handleNaverSearch(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const query = url.searchParams.get("query")?.trim();
  if (!query || query.length < 2) {
    return Response.json({ error: "검색어를 두 글자 이상 입력해 주세요." }, { status: 400 });
  }

  if (!env.NAVER_CLIENT_ID || !env.NAVER_CLIENT_SECRET) {
    return Response.json(
      { error: "네이버 검색 API 연결을 준비하고 있습니다." },
      { status: 503 }
    );
  }

  const resultGroups = await Promise.all([
    searchNaverLocal(`${query} 카페`, env),
    searchNaverLocal(`${query} 로스터리`, env),
    searchNaverLocal(`${query} 베이커리`, env),
  ]);
  const results = mixUniqueResults(resultGroups);

  if (results.length === 0) {
    return Response.json({ error: "네이버 검색 결과를 불러오지 못했습니다." }, { status: 502 });
  }

  const items = results.map((item) => ({
    ...item,
    title: stripTags(item.title),
    category: stripTags(item.category),
  }));

  return Response.json(
    { items },
    { headers: { "Cache-Control": "public, max-age=300" } }
  );
}

const worker = {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/search") return handleNaverSearch(request, env);
    if (url.pathname === "/api/reports") return handleReports(request, env);
    return env.ASSETS.fetch(request);
  },
};

export default worker;
