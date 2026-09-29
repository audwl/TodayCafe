# 오늘카페

동네 카페의 지금 분위기(혼잡도, 소음, 카공)를 이웃이 나눠 보는 MVP입니다.
로그인·DB 없이 네이버에서 확인한 실제 카페 18곳과 네이버 실제 카페 검색을 제공합니다.

- 망원·연남·성수·을지로·서촌·문래의 실제 카페 기본 목록
- 기본 혼잡도·소음·카공 정보는 UI 체험용 예시로 명시하고, 사용자 제보 시 실제 제보로 전환
- 각 카페의 네이버 지도와 블로그 후기 검색 링크 제공
- 혼잡도·소음·카공·콘센트·가격 필터 정보
- NAVER API HUB를 이용한 실제 카페 검색 및 내 목록 저장

## 왜 로그인을 강제하지 않나요

카페에 가기 전에 자리를 확인하는 서비스는 **빠르게 보고, 빠르게 알려주는 것**이 핵심입니다.
GitHub 로그인을 이용자 계정으로 쓰면 주민에게 부담이 되고, 상태 공유가 줄어듭니다.

- 서비스 이용: 로그인 없이 검색·필터·상태 공유·카페 제보
- GitHub: 코드 저장소와 Cloudflare 배포 연결용
- 나중에: 가짜 제보가 문제되면 카카오/구글 로그인을 **선택**으로 추가

## 로컬 실행

```bash
npm install
npm run dev
```

## GitHub + Cloudflare Workers

이 프로젝트는 Next.js static export 결과물인 `out/`을 Cloudflare Workers Static Assets로 배포합니다.

1. GitHub에 저장소를 만들고 이 폴더를 푸시합니다.
2. [Cloudflare Dashboard](https://dash.cloudflare.com) → Workers & Pages에서 저장소를 연결합니다.
3. 아래 빌드 설정을 사용합니다.
   - Build command: `npm run build`
   - Deploy command: `npx wrangler deploy`

### 네이버 실제 카페 검색

NAVER Cloud Platform의 NAVER API HUB에서 검색 API 이용을 신청하고 Application을 만든 뒤 Cloudflare Worker의 Secrets에 다음 값을 등록합니다.

- `NAVER_CLIENT_ID`
- `NAVER_CLIENT_SECRET`

시크릿은 GitHub이나 클라이언트 코드에 저장하지 않습니다.

로컬에서 한 번 올려 보려면:

```bash
npx wrangler login
npm run cf:deploy
```
