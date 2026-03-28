"use client";

import { useState } from "react";
import { downloadPDF } from "@/lib/pdf";

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const tableHeaders = form.tableHeaders
        ? form.tableHeaders.split(",").map((h) => h.trim()).filter(Boolean)
        : [];
      const tableData = form.tableRows
        ? form.tableRows
            .split("\n")
            .filter((r) => r.trim())
            .map((r) => r.split(",").map((c) => c.trim()))
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
        `report-${Date.now()}.pdf`
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
      <section className="bg-white rounded-lg border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">ข้อมูลรายงาน</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              ชื่อรายงาน <span className="text-red-500">*</span>
            </label>
            <input
              required
              value={form.title}
              onChange={(e) => setField("title", e.target.value)}
              placeholder="เช่น รายงานยอดขายประจำเดือน"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-500"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-700 mb-1">ช่วงเวลา</label>
            <input
              value={form.period}
              onChange={(e) => setField("period", e.target.value)}
              placeholder="เช่น มกราคม - มีนาคม 2567"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-500"
            />
          </div>
        </div>
      </section>

      {/* Summary Stats */}
      <section className="bg-white rounded-lg border border-gray-200 p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-semibold text-gray-900">สรุปสถิติ</h2>
          <button
            type="button"
            onClick={addStat}
            className="text-xs border border-slate-300 text-slate-700 rounded-md px-3 py-1 hover:bg-slate-50 transition-colors"
          >
            + เพิ่มสถิติ
          </button>
        </div>
        <div className="space-y-2">
          <div className="grid grid-cols-12 gap-2 text-xs font-medium text-gray-500 px-1">
            <div className="col-span-5">หัวข้อ</div>
            <div className="col-span-4">ค่า</div>
            <div className="col-span-2">หน่วย</div>
            <div className="col-span-1" />
          </div>
          {form.summary.map((stat, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-5">
                <input
                  value={stat.label}
                  onChange={(e) => setStat(i, "label", e.target.value)}
                  placeholder="เช่น ยอดขายรวม"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-500"
                />
              </div>
              <div className="col-span-4">
                <input
                  value={stat.value}
                  onChange={(e) => setStat(i, "value", e.target.value)}
                  placeholder="เช่น 1,250,000"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-500"
                />
              </div>
              <div className="col-span-2">
                <input
                  value={stat.unit}
                  onChange={(e) => setStat(i, "unit", e.target.value)}
                  placeholder="บาท"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-500"
                />
              </div>
              <div className="col-span-1 flex justify-center">
                {form.summary.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeStat(i)}
                    className="text-gray-400 hover:text-red-500 transition-colors text-base leading-none"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Table */}
      <section className="bg-white rounded-lg border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">ตารางข้อมูล</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">ชื่อตาราง</label>
            <input
              value={form.tableTitle}
              onChange={(e) => setField("tableTitle", e.target.value)}
              placeholder="เช่น ตารางยอดขายแยกตามสาขา"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              หัวคอลัมน์{" "}
              <span className="text-gray-400 font-normal">(คั่นด้วยเครื่องหมายจุลภาค)</span>
            </label>
            <input
              value={form.tableHeaders}
              onChange={(e) => setField("tableHeaders", e.target.value)}
              placeholder="เช่น สาขา,ยอดขาย,เปอร์เซ็นต์"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              ข้อมูลแถว{" "}
              <span className="text-gray-400 font-normal">
                (แต่ละแถวคั่นด้วย Enter, แต่ละคอลัมน์คั่นด้วยจุลภาค)
              </span>
            </label>
            <textarea
              value={form.tableRows}
              onChange={(e) => setField("tableRows", e.target.value)}
              rows={4}
              placeholder={"สาขากรุงเทพ,500000,40%\nสาขาเชียงใหม่,300000,24%"}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-500 resize-none font-mono"
            />
          </div>
        </div>
      </section>

      {/* Notes */}
      <section className="bg-white rounded-lg border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">หมายเหตุ</h2>
        <textarea
          value={form.notes}
          onChange={(e) => setField("notes", e.target.value)}
          rows={3}
          placeholder="หมายเหตุหรือข้อสังเกตเพิ่มเติม..."
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-500 resize-none"
        />
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
