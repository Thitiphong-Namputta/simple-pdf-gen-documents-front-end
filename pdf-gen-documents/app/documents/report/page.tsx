"use client";

import { useState } from "react";
import { downloadPDF } from "@/lib/pdf";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface StatCard {
  label: string;
  value: string;
  unit: string;
}

interface FormData {
  title: string;
  period: string;
  summary: StatCard[];
  tableTitle: string;
  tableHeaders: string;
  tableRows: string;
  notes: string;
}

const defaultForm: FormData = {
  title: "",
  period: "",
  summary: [{ label: "", value: "", unit: "" }],
  tableTitle: "",
  tableHeaders: "",
  tableRows: "",
  notes: "",
};

export default function ReportPage() {
  const [form, setForm] = useState<FormData>(defaultForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function setField<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function setStat(index: number, field: keyof StatCard, value: string) {
    setForm((f) => {
      const summary = [...f.summary];
      summary[index] = { ...summary[index], [field]: value };
      return { ...f, summary };
    });
  }

  function addStat() {
    setForm((f) => ({ ...f, summary: [...f.summary, { label: "", value: "", unit: "" }] }));
  }

  function removeStat(index: number) {
    setForm((f) => ({ ...f, summary: f.summary.filter((_, i) => i !== index) }));
  }

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const filename = `report-${Date.now()}.pdf`;
    try {
      const tableHeaders = form.tableHeaders
        ? form.tableHeaders.split(",").map((h) => h.trim()).filter(Boolean)
        : [];
      const tableData = form.tableRows
        ? form.tableRows.split("\n").filter((r) => r.trim()).map((r) => r.split(",").map((c) => c.trim()))
        : [];

      await downloadPDF(
        "report",
        {
          title: form.title,
          generatedAt: new Date().toLocaleString("th-TH"),
          period: form.period || undefined,
          summary: form.summary.filter((s) => s.label || s.value),
          tableTitle: form.tableTitle || undefined,
          tableHeaders: tableHeaders.length ? tableHeaders : undefined,
          tableData: tableData.length ? tableData : undefined,
          notes: form.notes || undefined,
        },
        filename,
        form.title
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-5">
      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">ข้อมูลรายงาน</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          <div className="col-span-2 space-y-1.5">
            <Label htmlFor="title">
              ชื่อรายงาน <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              required
              value={form.title}
              onChange={(e) => setField("title", e.target.value)}
              placeholder="เช่น รายงานยอดขายประจำเดือน"
            />
          </div>
          <div className="col-span-2 space-y-1.5">
            <Label htmlFor="period">ช่วงเวลา</Label>
            <Input
              id="period"
              value={form.period}
              onChange={(e) => setField("period", e.target.value)}
              placeholder="เช่น มกราคม - มีนาคม 2567"
            />
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm">สรุปสถิติ</CardTitle>
          <Button type="button" variant="outline" size="sm" onClick={addStat}>
            + เพิ่มสถิติ
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-12 gap-2 text-xs font-medium text-muted-foreground px-1">
            <div className="col-span-5">หัวข้อ</div>
            <div className="col-span-4">ค่า</div>
            <div className="col-span-2">หน่วย</div>
            <div className="col-span-1" />
          </div>
          {form.summary.map((stat, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-5">
                <Input
                  value={stat.label}
                  onChange={(e) => setStat(i, "label", e.target.value)}
                  placeholder="เช่น ยอดขายรวม"
                />
              </div>
              <div className="col-span-4">
                <Input
                  value={stat.value}
                  onChange={(e) => setStat(i, "value", e.target.value)}
                  placeholder="เช่น 1,250,000"
                />
              </div>
              <div className="col-span-2">
                <Input
                  value={stat.unit}
                  onChange={(e) => setStat(i, "unit", e.target.value)}
                  placeholder="บาท"
                />
              </div>
              <div className="col-span-1 flex justify-center">
                {form.summary.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeStat(i)}
                    className="text-muted-foreground hover:text-destructive transition-colors text-base leading-none"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">ตารางข้อมูล</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="tableTitle">ชื่อตาราง</Label>
            <Input
              id="tableTitle"
              value={form.tableTitle}
              onChange={(e) => setField("tableTitle", e.target.value)}
              placeholder="เช่น ตารางยอดขายแยกตามสาขา"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tableHeaders">
              หัวคอลัมน์{" "}
              <span className="text-muted-foreground font-normal text-xs">
                (คั่นด้วยเครื่องหมายจุลภาค)
              </span>
            </Label>
            <Input
              id="tableHeaders"
              value={form.tableHeaders}
              onChange={(e) => setField("tableHeaders", e.target.value)}
              placeholder="เช่น สาขา,ยอดขาย,เปอร์เซ็นต์"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tableRows">
              ข้อมูลแถว{" "}
              <span className="text-muted-foreground font-normal text-xs">
                (แต่ละแถวคั่นด้วย Enter, แต่ละคอลัมน์คั่นด้วยจุลภาค)
              </span>
            </Label>
            <Textarea
              id="tableRows"
              value={form.tableRows}
              onChange={(e) => setField("tableRows", e.target.value)}
              rows={4}
              placeholder={"สาขากรุงเทพ,500000,40%\nสาขาเชียงใหม่,300000,24%"}
              className="resize-none font-mono text-xs"
            />
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">หมายเหตุ</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={form.notes}
            onChange={(e) => setField("notes", e.target.value)}
            rows={3}
            placeholder="หมายเหตุหรือข้อสังเกตเพิ่มเติม..."
            className="resize-none"
          />
        </CardContent>
      </Card>

      {error && (
        <div className="rounded-md bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? "กำลังสร้าง PDF..." : "สร้าง PDF"}
        </Button>
      </div>
    </form>
  );
}