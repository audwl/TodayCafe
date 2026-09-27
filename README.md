# 오늘카페

동네 카페의 지금 분위기(혼잡도, 소음, 카공)를 이웃이 나눠 보는 MVP입니다.
로그인·DB 없이 샘플 데이터와 UI만 동작합니다.

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

## GitHub + Cloudflare Pages

이 프로젝트는 Next.js static export(`out/`)라서 Cloudflare Pages와 잘 맞습니다.

1. GitHub에 저장소를 만들고 이 폴더를 푸시합니다.
2. [Cloudflare Dashboard](https://dash.cloudflare.com) → Workers & Pages → Import repository
3. Framework preset: **Next.js (Static HTML Export)**
   - Build command: `npm run build`
   - Build output directory: `out`
   - Production branch: `main`

또는 GitHub Actions를 쓰려면 저장소 Secrets에 다음을 넣습니다.

- `CLOUDFLARE_API_TOKEN` (Account - Cloudflare Pages - Edit)
- `CLOUDFLARE_ACCOUNT_ID`

로컬에서 한 번 올려 보려면:

```bash
npx wrangler login
npm run cf:deploy
```
