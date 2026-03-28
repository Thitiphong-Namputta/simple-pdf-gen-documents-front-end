"use client";

import { useState } from "react";
import { downloadPDF } from "@/lib/pdf";

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const signatories = form.signatories.filter((s) => s.name || s.title);
      await downloadPDF(
        "certificate",
        {
          organizationName: form.organizationName || undefined,
          certificateNo: form.certificateNo || undefined,
          recipientName: form.recipientName,
          courseName: form.courseName,
          description: form.description || undefined,
          date: form.date,
          signatories: signatories.length ? signatories : undefined,
        },
        `certificate-${Date.now()}.pdf`
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
      <section className="bg-white rounded-lg border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">ข้อมูลองค์กร</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-700 mb-1">ชื่อองค์กร/สถาบัน</label>
            <input
              value={form.organizationName}
              onChange={(e) => setField("organizationName", e.target.value)}
              placeholder="เช่น มหาวิทยาลัยตัวอย่าง"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">เลขที่ใบรับรอง</label>
            <input
              value={form.certificateNo}
              onChange={(e) => setField("certificateNo", e.target.value)}
              placeholder="เช่น CERT-2024-001"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              วันที่ออกใบรับรอง <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              required
              value={form.date}
              onChange={(e) => setField("date", e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-500"
            />
          </div>
        </div>
      </section>

      {/* Recipient Info */}
      <section className="bg-white rounded-lg border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">ข้อมูลผู้รับใบรับรอง</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              ชื่อผู้รับ <span className="text-red-500">*</span>
            </label>
            <input
              required
              value={form.recipientName}
              onChange={(e) => setField("recipientName", e.target.value)}
              placeholder="ชื่อ-นามสกุล ผู้รับใบรับรอง"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              ชื่อหลักสูตร/ความสำเร็จ <span className="text-red-500">*</span>
            </label>
            <input
              required
              value={form.courseName}
              onChange={(e) => setField("courseName", e.target.value)}
              placeholder="เช่น หลักสูตรการพัฒนาซอฟต์แวร์"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">คำอธิบายเพิ่มเติม</label>
            <textarea
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
              rows={2}
              placeholder="เช่น ได้ผ่านการอบรมและทดสอบจนสำเร็จ..."
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-500 resize-none"
            />
          </div>
        </div>
      </section>

      {/* Signatories */}
      <section className="bg-white rounded-lg border border-gray-200 p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-semibold text-gray-900">ผู้ลงนาม</h2>
          <button
            type="button"
            onClick={addSignatory}
            className="text-xs border border-slate-300 text-slate-700 rounded-md px-3 py-1 hover:bg-slate-50 transition-colors"
          >
            + เพิ่มผู้ลงนาม
          </button>
        </div>
        <div className="space-y-2">
          <div className="grid grid-cols-11 gap-2 text-xs font-medium text-gray-500 px-1">
            <div className="col-span-5">ชื่อ</div>
            <div className="col-span-5">ตำแหน่ง</div>
            <div className="col-span-1" />
          </div>
          {form.signatories.map((sig, i) => (
            <div key={i} className="grid grid-cols-11 gap-2 items-center">
              <div className="col-span-5">
                <input
                  value={sig.name}
                  onChange={(e) => setSignatory(i, "name", e.target.value)}
                  placeholder="ชื่อ-นามสกุล"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-500"
                />
              </div>
              <div className="col-span-5">
                <input
                  value={sig.title}
                  onChange={(e) => setSignatory(i, "title", e.target.value)}
                  placeholder="เช่น ผู้อำนวยการ"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-500"
                />
              </div>
              <div className="col-span-1 flex justify-center">
                {form.signatories.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSignatory(i)}
                    className="text-gray-400 hover:text-red-500 transition-colors text-base leading-none"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-gray-400">
          หากไม่ระบุผู้ลงนาม ระบบจะใช้ผู้ลงนามค่าเริ่มต้น
        </p>
      </section>

      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-slate-900 text-white px-6 py-2 text-sm font-medium hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "กำลังสร้าง PDF..." : "สร้าง PDF"}
        </button>
      </div>
    </form>
  );
}
