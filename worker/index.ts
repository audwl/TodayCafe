interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  NAVER_CLIENT_ID?: string;
  NAVER_CLIENT_SECRET?: string;
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

const worker = {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname !== "/api/search") {
      return env.ASSETS.fetch(request);
    }

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
  },
};

export default worker;
