"use client";

import { useState } from "react";
import { downloadPDF } from "@/lib/pdf";

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await downloadPDF(
        "contract",
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
        `contract-${Date.now()}.pdf`
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
      <section className="bg-white rounded-lg border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">ข้อมูลสัญญา</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              ชื่อสัญญา <span className="text-red-500">*</span>
            </label>
            <input
              required
              value={form.title}
              onChange={(e) => setField("title", e.target.value)}
              placeholder="เช่น สัญญาจ้างพัฒนาซอฟต์แวร์"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              วันที่ทำสัญญา <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              required
              value={form.contractDate}
              onChange={(e) => setField("contractDate", e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-500"
            />
          </div>
        </div>
      </section>

      {/* Parties */}
      <div className="grid grid-cols-2 gap-4">
        {/* Party 1 */}
        <section className="bg-white rounded-lg border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">คู่สัญญาที่ 1</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                ชื่อ <span className="text-red-500">*</span>
              </label>
              <input
                required
                value={form.party1Name}
                onChange={(e) => setField("party1Name", e.target.value)}
                placeholder="ชื่อบุคคล/นิติบุคคล"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                บทบาท <span className="text-red-500">*</span>
              </label>
              <input
                required
                value={form.party1Role}
                onChange={(e) => setField("party1Role", e.target.value)}
                placeholder="เช่น ผู้ว่าจ้าง"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">ที่อยู่</label>
              <textarea
                value={form.party1Address}
                onChange={(e) => setField("party1Address", e.target.value)}
                rows={2}
                placeholder="ที่อยู่..."
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-500 resize-none"
              />
            </div>
          </div>
        </section>

        {/* Party 2 */}
        <section className="bg-white rounded-lg border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">คู่สัญญาที่ 2</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                ชื่อ <span className="text-red-500">*</span>
              </label>
              <input
                required
                value={form.party2Name}
                onChange={(e) => setField("party2Name", e.target.value)}
                placeholder="ชื่อบุคคล/นิติบุคคล"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                บทบาท <span className="text-red-500">*</span>
              </label>
              <input
                required
                value={form.party2Role}
                onChange={(e) => setField("party2Role", e.target.value)}
                placeholder="เช่น ผู้รับจ้าง"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">ที่อยู่</label>
              <textarea
                value={form.party2Address}
                onChange={(e) => setField("party2Address", e.target.value)}
                rows={2}
                placeholder="ที่อยู่..."
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-500 resize-none"
              />
            </div>
          </div>
        </section>
      </div>

      {/* Preamble */}
      <section className="bg-white rounded-lg border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">คำนำ / บทนำสัญญา</h2>
        <textarea
          value={form.preamble}
          onChange={(e) => setField("preamble", e.target.value)}
          rows={3}
          placeholder="ข้อความเปิดก่อนเข้าสู่ข้อสัญญา (ไม่บังคับ)..."
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-500 resize-none"
        />
      </section>

      {/* Clauses */}
      <section className="bg-white rounded-lg border border-gray-200 p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-semibold text-gray-900">ข้อสัญญา</h2>
          <button
            type="button"
            onClick={addClause}
            className="text-xs border border-slate-300 text-slate-700 rounded-md px-3 py-1 hover:bg-slate-50 transition-colors"
          >
            + เพิ่มข้อสัญญา
          </button>
        </div>
        <div className="space-y-4">
          {form.clauses.map((clause, i) => (
            <div key={i} className="rounded-md border border-gray-200 p-4 relative">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-medium text-gray-500">ข้อที่ {i + 1}</span>
                {form.clauses.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeClause(i)}
                    className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                  >
                    ลบข้อนี้
                  </button>
                )}
              </div>
              <div className="space-y-2">
                <input
                  required
                  value={clause.title}
                  onChange={(e) => setClause(i, "title", e.target.value)}
                  placeholder="ชื่อข้อสัญญา เช่น ขอบเขตงาน"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-500"
                />
                <textarea
                  required
                  value={clause.content}
                  onChange={(e) => setClause(i, "content", e.target.value)}
                  rows={3}
                  placeholder="รายละเอียดของข้อสัญญา..."
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-500 resize-none"
                />
              </div>
            </div>
          ))}
        </div>
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