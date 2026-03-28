"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const API = process.env.NEXT_PUBLIC_API_URL;

const DOC_TYPES = [
  { value: "invoice", label: "ใบแจ้งหนี้" },
  { value: "report", label: "รายงาน" },
  { value: "certificate", label: "ใบรับรอง" },
  { value: "contract", label: "สัญญา" },
];

const TEMPLATE_HEADERS: Record<string, string[]> = {
  invoice: ["companyName", "invoiceNo", "clientName", "companyAddress", "companyTel", "companyEmail", "invoiceDate", "dueDate", "clientAddress", "note", "tax"],
  report: ["title", "period", "notes"],
  certificate: ["recipientName", "courseName", "date", "organizationName", "certificateNo", "description"],
  contract: ["title", "contractDate", "party1Name", "party1Role", "party2Name", "party2Role", "party1Address", "party2Address", "preamble"],
};

interface ImportError {
  row: number;
  field: string;
  message: string;
}

interface ImportResult {
  success: boolean;
  count?: number;
  errors?: ImportError[];
}

export default function ImportPage() {
  const [docType, setDocType] = useState("invoice");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function downloadTemplate() {
    const headers = TEMPLATE_HEADERS[docType] ?? [];
    const csv = headers.join(",") + "\n";
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `template-${docType}.csv`;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  async function handleUpload(e: { preventDefault(): void }) {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API}/api/v1/import/${docType}`, {
        method: "POST",
        body: formData,
      });

      const json = await res.json();

      if (res.status === 422) {
        setResult({ success: false, errors: json.errors });
      } else if (!res.ok) {
        setResult({ success: false, errors: [{ row: 0, field: "-", message: json.message ?? "เกิดข้อผิดพลาด" }] });
      } else {
        setResult({ success: true, count: json.count });
        setFile(null);
        if (fileRef.current) fileRef.current.value = "";
      }
    } catch {
      setResult({ success: false, errors: [{ row: 0, field: "-", message: "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้" }] });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl space-y-5">
      <div>
        <h2 className="text-lg font-semibold">นำเข้าข้อมูลจาก Excel</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          อัปโหลดไฟล์ .xlsx ที่มีโครงสร้างตรงกับ template เพื่อนำเข้าข้อมูลเป็นชุด
        </p>
      </div>

      <form onSubmit={handleUpload} className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">ตั้งค่าการนำเข้า</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label>ประเภทเอกสาร</Label>
              <Select value={docType} onValueChange={setDocType}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DOC_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="file">ไฟล์ Excel (.xlsx)</Label>
                <button
                  type="button"
                  onClick={downloadTemplate}
                  className="text-xs text-muted-foreground underline hover:text-foreground transition-colors"
                >
                  ดาวน์โหลด template
                </button>
              </div>
              <input
                ref={fileRef}
                id="file"
                type="file"
                accept=".xlsx,.xls"
                required
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
              <p className="text-xs text-muted-foreground">
                ต้องมี header row ตรงกับ template และข้อมูลเริ่มตั้งแต่แถวที่ 2
              </p>
            </div>
          </CardContent>
        </Card>

        {result?.success && (
          <div className="rounded-md bg-green-50 border border-green-200 p-4 text-sm text-green-800">
            นำเข้าข้อมูลสำเร็จ <span className="font-semibold">{result.count} รายการ</span>
          </div>
        )}

        {result && !result.success && result.errors && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-destructive">
                พบข้อผิดพลาด {result.errors.length} รายการ
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">แถวที่</TableHead>
                    <TableHead>Field</TableHead>
                    <TableHead>ข้อผิดพลาด</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {result.errors.map((err, i) => (
                    <TableRow key={i}>
                      <TableCell className="text-muted-foreground">{err.row}</TableCell>
                      <TableCell className="font-mono text-xs">{err.field || "-"}</TableCell>
                      <TableCell className="text-destructive text-sm">{err.message}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-end">
          <Button type="submit" disabled={loading || !file}>
            {loading ? "กำลังนำเข้า..." : "นำเข้าข้อมูล"}
          </Button>
        </div>
      </form>
    </div>
  );
}
