"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DocumentRecord {
  id: string;
  type: string;
  filename: string;
  summary: string;
  createdAt: string;
}

const TYPE_LABELS: Record<string, string> = {
  invoice: "ใบแจ้งหนี้",
  report: "รายงาน",
  certificate: "ใบรับรอง",
  contract: "สัญญา",
};

const TYPE_VARIANTS: Record<
  string,
  "default" | "secondary" | "outline" | "destructive"
> = {
  invoice: "default",
  report: "secondary",
  certificate: "outline",
  contract: "destructive",
};

const API = process.env.NEXT_PUBLIC_API_URL;

export default function HistoryPage() {
  const [records, setRecords] = useState<DocumentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchRecords() {
    try {
      const res = await fetch(`${API}/api/v1/documents`);
      if (!res.ok) throw new Error(`เกิดข้อผิดพลาด (${res.status})`);
      const data = await res.json();
      setRecords(data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "โหลดข้อมูลไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRecords();
  }, []);

  async function deleteRecord(id: string) {
    await fetch(`${API}/api/v1/documents/${id}`, { method: "DELETE" });
    setRecords((prev) => prev.filter((r) => r.id !== id));
  }

  async function clearAll() {
    await fetch(`${API}/api/v1/documents`, { method: "DELETE" });
    setRecords([]);
  }

  return (
    <div className="max-w-4xl space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">ประวัติการสร้างเอกสาร</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {loading
              ? "กำลังโหลด..."
              : records.length > 0
              ? `${records.length} รายการ`
              : "ยังไม่มีประวัติการสร้างเอกสาร"}
          </p>
        </div>
        {records.length > 0 && (
          <Button variant="outline" size="sm" onClick={clearAll}>
            ล้างประวัติทั้งหมด
          </Button>
        )}
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ประเภท</TableHead>
                <TableHead>รายละเอียด</TableHead>
                <TableHead>ชื่อไฟล์</TableHead>
                <TableHead>วันที่สร้าง</TableHead>
                <TableHead className="w-16" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                    กำลังโหลดข้อมูล...
                  </TableCell>
                </TableRow>
              ) : records.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                    ยังไม่มีประวัติการสร้างเอกสาร
                    <br />
                    <span className="text-xs">
                      สร้างเอกสารจากเมนูด้านซ้ายเพื่อดูประวัติที่นี่
                    </span>
                  </TableCell>
                </TableRow>
              ) : (
                records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <Badge variant={TYPE_VARIANTS[record.type] ?? "outline"}>
                        {TYPE_LABELS[record.type] ?? record.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium max-w-xs truncate">
                      {record.summary}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {record.filename}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                      {new Date(record.createdAt).toLocaleString("th-TH", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteRecord(record.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        ลบ
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
