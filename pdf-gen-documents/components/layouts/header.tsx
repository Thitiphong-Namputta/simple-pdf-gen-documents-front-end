"use client";

import { usePathname } from "next/navigation";

const pageTitles: Record<string, string> = {
  "/documents": "Dashboard",
  "/documents/invoice": "สร้างใบแจ้งหนี้",
  "/documents/report": "สร้างรายงาน",
  "/documents/certificate": "สร้างใบรับรอง",
  "/documents/contract": "สร้างสัญญา",
};

export default function Header() {
  const pathname = usePathname();
  const title = pageTitles[pathname] ?? "PDF Generator";

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center px-6 shrink-0">
      <h1 className="text-base font-semibold text-gray-900">{title}</h1>
    </header>
  );
}
