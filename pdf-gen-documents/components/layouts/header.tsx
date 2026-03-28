"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

const pageMeta: Record<string, { label: string; parent?: string }> = {
  "/documents": { label: "Dashboard" },
  "/documents/invoice": { label: "ใบแจ้งหนี้", parent: "Dashboard" },
  "/documents/report": { label: "รายงาน", parent: "Dashboard" },
  "/documents/certificate": { label: "ใบรับรอง", parent: "Dashboard" },
  "/documents/contract": { label: "สัญญา", parent: "Dashboard" },
  "/documents/history": { label: "ประวัติเอกสาร", parent: "Dashboard" },
};

export default function Header() {
  const pathname = usePathname();
  const meta = pageMeta[pathname];

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          {meta?.parent && (
            <>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/documents">{meta.parent}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
            </>
          )}
          <BreadcrumbItem>
            <BreadcrumbPage>{meta?.label ?? "PDF Generator"}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
}