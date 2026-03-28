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

interface Signatory {
  name: string;
  title: string;
}

interface FormData {
  organizationName: string;
  certificateNo: string;
  recipientName: string;
  courseName: string;
  description: string;
  date: string;
  signatories: Signatory[];
}

const defaultForm: FormData = {
  organizationName: "",
  certificateNo: "",
  recipientName: "",
  courseName: "",
  description: "",
  date: "",
  signatories: [{ name: "", title: "" }],
};

export default function CertificatePage() {
  const [form, setForm] = useState<FormData>(defaultForm);
  const [format, setFormat] = useState<ExportFormat>("pdf");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function setField<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function setSignatory(index: number, field: keyof Signatory, value: string) {
    setForm((f) => {
      const signatories = [...f.signatories];
      signatories[index] = { ...signatories[index], [field]: value };
      return { ...f, signatories };
    });
  }

  function addSignatory() {
    setForm((f) => ({ ...f, signatories: [...f.signatories, { name: "", title: "" }] }));
  }

  function removeSignatory(index: number) {
    setForm((f) => ({ ...f, signatories: f.signatories.filter((_, i) => i !== index) }));
  }

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const filename = `certificate-${Date.now()}`;
    try {
      const signatories = form.signatories.filter((s) => s.name || s.title);
      await downloadExport(
        "certificate",
        format,
        {
          organizationName: form.organizationName || undefined,
          certificateNo: form.certificateNo || undefined,
          recipientName: form.recipientName,
          courseName: form.courseName,
          description: form.description || undefined,
          date: form.date,
          signatories: signatories.length ? signatories : undefined,
        },
        filename,
        `${form.recipientName} · ${form.courseName}`
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
      {/* Organization Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">ข้อมูลองค์กร</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          <div className="col-span-2 space-y-1.5">
            <Label htmlFor="organizationName">ชื่อองค์กร/สถาบัน</Label>
            <Input
              id="organizationName"
              value={form.organizationName}
              onChange={(e) => setField("organizationName", e.target.value)}
              placeholder="เช่น มหาวิทยาลัยตัวอย่าง"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="certificateNo">เลขที่ใบรับรอง</Label>
            <Input
              id="certificateNo"
              value={form.certificateNo}
              onChange={(e) => setField("certificateNo", e.target.value)}
              placeholder="เช่น CERT-2024-001"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="date">
              วันที่ออกใบรับรอง <span className="text-destructive">*</span>
            </Label>
            <Input
              id="date"
              type="date"
              required
              value={form.date}
              onChange={(e) => setField("date", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Recipient Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">ข้อมูลผู้รับใบรับรอง</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="recipientName">
              ชื่อผู้รับ <span className="text-destructive">*</span>
            </Label>
            <Input
              id="recipientName"
              required
              value={form.recipientName}
              onChange={(e) => setField("recipientName", e.target.value)}
              placeholder="ชื่อ-นามสกุล ผู้รับใบรับรอง"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="courseName">
              ชื่อหลักสูตร/ความสำเร็จ <span className="text-destructive">*</span>
            </Label>
            <Input
              id="courseName"
              required
              value={form.courseName}
              onChange={(e) => setField("courseName", e.target.value)}
              placeholder="เช่น หลักสูตรการพัฒนาซอฟต์แวร์"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="description">คำอธิบายเพิ่มเติม</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
              rows={2}
              placeholder="เช่น ได้ผ่านการอบรมและทดสอบจนสำเร็จ..."
              className="resize-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* Signatories */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm">ผู้ลงนาม</CardTitle>
          <Button type="button" variant="outline" size="sm" onClick={addSignatory}>
            + เพิ่มผู้ลงนาม
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-11 gap-2 text-xs font-medium text-muted-foreground px-1">
            <div className="col-span-5">ชื่อ</div>
            <div className="col-span-5">ตำแหน่ง</div>
            <div className="col-span-1" />
          </div>
          {form.signatories.map((sig, i) => (
            <div key={i} className="grid grid-cols-11 gap-2 items-center">
              <div className="col-span-5">
                <Input
                  value={sig.name}
                  onChange={(e) => setSignatory(i, "name", e.target.value)}
                  placeholder="ชื่อ-นามสกุล"
                />
              </div>
              <div className="col-span-5">
                <Input
                  value={sig.title}
                  onChange={(e) => setSignatory(i, "title", e.target.value)}
                  placeholder="เช่น ผู้อำนวยการ"
                />
              </div>
              <div className="col-span-1 flex justify-center">
                {form.signatories.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSignatory(i)}
                    className="text-muted-foreground hover:text-destructive transition-colors text-base leading-none"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          ))}
          <p className="text-xs text-muted-foreground pt-1">
            หากไม่ระบุผู้ลงนาม ระบบจะใช้ผู้ลงนามค่าเริ่มต้น
          </p>
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