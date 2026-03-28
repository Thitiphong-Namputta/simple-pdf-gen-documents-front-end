import Link from "next/link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AwardIcon,
  BarChart3Icon,
  ReceiptIcon,
  ScrollTextIcon,
} from "lucide-react";

const cards = [
  {
    label: "ใบแจ้งหนี้",
    description: "สร้างใบแจ้งหนี้พร้อมรายการสินค้า ราคา และภาษี",
    href: "/documents/invoice",
    icon: ReceiptIcon,
  },
  {
    label: "รายงาน",
    description: "สร้างรายงานพร้อมสถิติ ตารางข้อมูล และหมายเหตุ",
    href: "/documents/report",
    icon: BarChart3Icon,
  },
  {
    label: "ใบรับรอง",
    description: "สร้างใบรับรองและประกาศนียบัตรสำหรับผู้รับรางวัล",
    href: "/documents/certificate",
    icon: AwardIcon,
  },
  {
    label: "สัญญา",
    description: "สร้างสัญญาและข้อตกลงทางกฎหมายพร้อมลายเซ็น",
    href: "/documents/contract",
    icon: ScrollTextIcon,
  },
];

export default function DocumentsPage() {
  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="text-lg font-semibold">เลือกประเภทเอกสาร</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          กรอกข้อมูลและสร้างไฟล์ PDF สำหรับเอกสารที่ต้องการ
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cards.map(({ label, description, href, icon: Icon }) => (
          <Link key={href} href={href} className="group">
            <Card className="h-full transition-colors group-hover:border-primary/50 group-hover:shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-sm">{label}</CardTitle>
                    <CardDescription className="text-xs mt-0.5">
                      {description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}