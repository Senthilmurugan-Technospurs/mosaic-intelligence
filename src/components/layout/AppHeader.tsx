'use client';

import Link from 'next/link';

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-[#dbe7ee] bg-white/95 px-6 py-3 shadow-sm backdrop-blur-xl">
      <Link href="/recommendations/all" className="flex items-center gap-2.5 no-underline">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#22c7ee] to-[#0ea5c6] text-white shadow-lg shadow-cyan-500/25 text-sm">
          ⚡
        </div>
        <span className="text-base font-bold text-[#102131]">
          MOSAIC <span className="font-normal text-[#5f7387]">· AI Tools</span>
        </span>
      </Link>
    </header>
  );
}
