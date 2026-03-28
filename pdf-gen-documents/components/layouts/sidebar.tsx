"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AwardIcon,
  BarChart3Icon,
  FileTextIcon,
  HistoryIcon,
  HomeIcon,
  ReceiptIcon,
  ScrollTextIcon,
  UploadIcon,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const documentNav = [
  { label: "Dashboard", href: "/documents", icon: HomeIcon, exact: true },
  { label: "ใบแจ้งหนี้", href: "/documents/invoice", icon: ReceiptIcon },
  { label: "รายงาน", href: "/documents/report", icon: BarChart3Icon },
  { label: "ใบรับรอง", href: "/documents/certificate", icon: AwardIcon },
  { label: "สัญญา", href: "/documents/contract", icon: ScrollTextIcon },
];

const dataNav = [
  { label: "ประวัติเอกสาร", href: "/documents/history", icon: HistoryIcon },
  { label: "นำเข้าข้อมูล", href: "/documents/import", icon: UploadIcon },
];

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2.5 px-2 py-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <FileTextIcon className="h-4 w-4" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-sm font-semibold">PDF Generator</span>
            <span className="text-xs text-muted-foreground">ระบบสร้างเอกสาร</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>เอกสาร</SidebarGroupLabel>
          <SidebarMenu>
            {documentNav.map(({ label, href, icon: Icon, exact }) => {
              const isActive = exact ? pathname === href : pathname.startsWith(href);
              return (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton render={<Link href={href} />} isActive={isActive}>
                    <Icon />
                    <span>{label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>ข้อมูล</SidebarGroupLabel>
          <SidebarMenu>
            {dataNav.map(({ label, href, icon: Icon }) => {
              const isActive = pathname.startsWith(href);
              return (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton render={<Link href={href} />} isActive={isActive}>
                    <Icon />
                    <span>{label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <p className="px-2 py-1 text-xs text-muted-foreground">v1.0.0</p>
      </SidebarFooter>
    </Sidebar>
  );
}