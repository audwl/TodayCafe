"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

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
          </nav>
        </div>
      ) : null}
    </header>
  );
}
