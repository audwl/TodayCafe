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

function stripTags(value: string): string {
  return value.replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").trim();
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

    const endpoint = new URL("https://naverapihub.apigw.ntruss.com/search/v1/local");
    endpoint.searchParams.set("query", `${query} 카페`);
    endpoint.searchParams.set("display", "5");
    endpoint.searchParams.set("sort", "comment");
    endpoint.searchParams.set("format", "json");

    const response = await fetch(endpoint, {
      headers: {
        "X-NCP-APIGW-API-KEY-ID": env.NAVER_CLIENT_ID,
        "X-NCP-APIGW-API-KEY": env.NAVER_CLIENT_SECRET,
      },
    });

    if (!response.ok) {
      return Response.json({ error: "네이버 검색 결과를 불러오지 못했습니다." }, { status: 502 });
    }

    const data = (await response.json()) as { items?: NaverLocalItem[] };
    const items = (data.items ?? []).map((item) => ({
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
