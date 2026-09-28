"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2" onClick={closeMenu}>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-800 text-sm text-white">
            ☕
          </span>
          <span className="text-lg font-bold tracking-tight text-stone-800">
            오늘카페
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-stone-600 sm:flex">
          <Link href="/#cafe-list" className="transition-colors hover:text-amber-900">
            카페 찾기
          </Link>
          <Link href="/suggest/" className="transition-colors hover:text-amber-900">
            카페 제보하기
          </Link>
          <button
            type="button"
            onClick={() => setLoginOpen(true)}
            className="rounded-full border border-stone-300 px-4 py-1.5 transition-colors hover:border-amber-800 hover:text-amber-900"
          >
            로그인
          </button>
        </nav>

        <button
          type="button"
          className="rounded-full border border-stone-300 px-3 py-1.5 text-sm text-stone-600 sm:hidden"
          aria-label="메뉴"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          메뉴
        </button>
      </div>

      {menuOpen ? (
        <div className="border-t border-stone-100 bg-white px-4 py-3 sm:hidden">
          <nav className="flex flex-col gap-1 text-sm font-medium text-stone-600">
            <Link
              href="/#cafe-list"
              className="rounded-lg px-3 py-2 hover:bg-stone-50"
              onClick={closeMenu}
            >
              카페 찾기
            </Link>
            <Link
              href="/suggest/"
              className="rounded-lg px-3 py-2 hover:bg-stone-50"
              onClick={closeMenu}
            >
              카페 제보하기
            </Link>
            <button
              type="button"
              className="rounded-lg px-3 py-2 text-left hover:bg-stone-50"
              onClick={() => {
                closeMenu();
                setLoginOpen(true);
              }}
            >
              로그인
            </button>
          </nav>
        </div>
      ) : null}

      {loginOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-stone-900/40 p-4 sm:items-center"
          onClick={() => setLoginOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="login-modal-title"
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h2 id="login-modal-title" className="text-lg font-bold text-stone-800">
                  공개 베타는 로그인 없이 둘러볼 수 있어요
                </h2>
                <p className="mt-1 text-sm text-stone-500">
                  현재는 샘플 데이터로 검색과 상태 공유 흐름을 체험하는 단계입니다.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setLoginOpen(false)}
                className="rounded-lg p-1 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-600"
                aria-label="닫기"
              >
                ✕
              </button>
            </div>

            <ul className="space-y-3 rounded-xl bg-stone-50 p-4 text-sm text-stone-600">
              <li>상태 공유와 카페 제보 화면을 계정 없이 체험할 수 있어요.</li>
              <li>
                GitHub는 서비스 로그인이 아니라, 코드를 올리고 Cloudflare에 배포할 때 씁니다.
              </li>
              <li>
                실제 제보 저장 기능과 간편 로그인은 다음 단계에서 연결할 예정이에요.
              </li>
            </ul>

            <button
              type="button"
              onClick={() => setLoginOpen(false)}
              className="mt-5 w-full rounded-xl bg-amber-800 py-3 text-sm font-semibold text-white transition-colors hover:bg-amber-900"
            >
              로그인 없이 계속하기
            </button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
