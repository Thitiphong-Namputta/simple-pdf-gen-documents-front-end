"use client";

import { useState } from "react";
import { downloadExport, type ExportFormat } from "@/lib/export";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Clause {
  title: string;
  content: string;
}

interface FormData {
  title: string;
  contractDate: string;
  party1Name: string;
  party1Role: string;
  party1Address: string;
  party2Name: string;
  party2Role: string;
  party2Address: string;
  preamble: string;
  clauses: Clause[];
}

const defaultForm: FormData = {
  title: "",
  contractDate: "",
  party1Name: "",
  party1Role: "",
  party1Address: "",
  party2Name: "",
  party2Role: "",
  party2Address: "",
  preamble: "",
  clauses: [{ title: "", content: "" }],
};

export default function ContractPage() {
  const [form, setForm] = useState<FormData>(defaultForm);
  const [format, setFormat] = useState<ExportFormat>("pdf");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function setField<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function setClause(index: number, field: keyof Clause, value: string) {
    setForm((f) => {
      const clauses = [...f.clauses];
      clauses[index] = { ...clauses[index], [field]: value };
      return { ...f, clauses };
    });
  }

  function addClause() {
    setForm((f) => ({ ...f, clauses: [...f.clauses, { title: "", content: "" }] }));
  }

  function removeClause(index: number) {
    setForm((f) => ({ ...f, clauses: f.clauses.filter((_, i) => i !== index) }));
  }

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const filename = `contract-${Date.now()}`;
    try {
      await downloadExport(
        "contract",
        format,
        {
          title: form.title,
          contractDate: form.contractDate,
          party1Name: form.party1Name,
          party1Role: form.party1Role,
          party1Address: form.party1Address || undefined,
          party2Name: form.party2Name,
          party2Role: form.party2Role,
          party2Address: form.party2Address || undefined,
          preamble: form.preamble || undefined,
          clauses: form.clauses.filter((c) => c.title || c.content),
        },
        filename,
        `${form.title} (${form.party1Name} & ${form.party2Name})`
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-5">
      {/* Contract Header */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">ข้อมูลสัญญา</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          <div className="col-span-2 space-y-1.5">
            <Label htmlFor="title">
              ชื่อสัญญา <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              required
              value={form.title}
              onChange={(e) => setField("title", e.target.value)}
              placeholder="เช่น สัญญาจ้างพัฒนาซอฟต์แวร์"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="contractDate">
              วันที่ทำสัญญา <span className="text-destructive">*</span>
            </Label>
            <Input
              id="contractDate"
              type="date"
              required
              value={form.contractDate}
              onChange={(e) => setField("contractDate", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Parties */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">คู่สัญญาที่ 1</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="party1Name">
                ชื่อ <span className="text-destructive">*</span>
              </Label>
              <Input
                id="party1Name"
                required
                value={form.party1Name}
                onChange={(e) => setField("party1Name", e.target.value)}
                placeholder="ชื่อบุคคล/นิติบุคคล"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="party1Role">
                บทบาท <span className="text-destructive">*</span>
              </Label>
              <Input
                id="party1Role"
                required
                value={form.party1Role}
                onChange={(e) => setField("party1Role", e.target.value)}
                placeholder="เช่น ผู้ว่าจ้าง"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="party1Address">ที่อยู่</Label>
              <Textarea
                id="party1Address"
                value={form.party1Address}
                onChange={(e) => setField("party1Address", e.target.value)}
                rows={2}
                className="resize-none"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">คู่สัญญาที่ 2</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="party2Name">
                ชื่อ <span className="text-destructive">*</span>
              </Label>
              <Input
                id="party2Name"
                required
                value={form.party2Name}
                onChange={(e) => setField("party2Name", e.target.value)}
                placeholder="ชื่อบุคคล/นิติบุคคล"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="party2Role">
                บทบาท <span className="text-destructive">*</span>
              </Label>
              <Input
                id="party2Role"
                required
                value={form.party2Role}
                onChange={(e) => setField("party2Role", e.target.value)}
                placeholder="เช่น ผู้รับจ้าง"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="party2Address">ที่อยู่</Label>
              <Textarea
                id="party2Address"
                value={form.party2Address}
                onChange={(e) => setField("party2Address", e.target.value)}
                rows={2}
                className="resize-none"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preamble */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">คำนำ / บทนำสัญญา</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={form.preamble}
            onChange={(e) => setField("preamble", e.target.value)}
            rows={3}
            placeholder="ข้อความเปิดก่อนเข้าสู่ข้อสัญญา (ไม่บังคับ)..."
            className="resize-none"
          />
        </CardContent>
      </Card>

      {/* Clauses */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm">ข้อสัญญา</CardTitle>
          <Button type="button" variant="outline" size="sm" onClick={addClause}>
            + เพิ่มข้อสัญญา
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {form.clauses.map((clause, i) => (
            <div key={i} className="rounded-md border p-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-muted-foreground">ข้อที่ {i + 1}</span>
                {form.clauses.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeClause(i)}
                    className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                  >
                    ลบข้อนี้
                  </button>
                )}
              </div>
              <Input
                required
                value={clause.title}
                onChange={(e) => setClause(i, "title", e.target.value)}
                placeholder="ชื่อข้อสัญญา เช่น ขอบเขตงาน"
              />
              <Textarea
                required
                value={clause.content}
                onChange={(e) => setClause(i, "content", e.target.value)}
                rows={3}
                placeholder="รายละเอียดของข้อสัญญา..."
                className="resize-none"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {error && (
        <div className="rounded-md bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="flex items-center justify-end gap-3">
        <Select value={format} onValueChange={(v) => setFormat(v as ExportFormat)}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pdf">PDF</SelectItem>
            <SelectItem value="docx">Word (.docx)</SelectItem>
            <SelectItem value="xlsx">Excel (.xlsx)</SelectItem>
          </SelectContent>
        </Select>
        <Button type="submit" disabled={loading}>
          {loading ? "กำลังสร้าง..." : "สร้างเอกสาร"}
        </Button>
      </div>
    </form>
  );
}