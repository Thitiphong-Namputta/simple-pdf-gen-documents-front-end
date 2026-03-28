"use client";

import { useState } from "react";
import { downloadPDF } from "@/lib/pdf";

interface Item {
  name: string;
  qty: number;
  price: number;
}

interface FormData {
  companyName: string;
  companyAddress: string;
  companyTel: string;
  companyEmail: string;
  invoiceNo: string;
  invoiceDate: string;
  clientName: string;
  clientAddress: string;
  dueDate: string;
  items: Item[];
  tax: number;
  note: string;
}

const defaultForm: FormData = {
  companyName: "",
  companyAddress: "",
  companyTel: "",
  companyEmail: "",
  invoiceNo: "",
  invoiceDate: "",
  clientName: "",
  clientAddress: "",
  dueDate: "",
  items: [{ name: "", qty: 1, price: 0 }],
  tax: 7,
  note: "",
};

export default function InvoicePage() {
  const [form, setForm] = useState<FormData>(defaultForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = form.items.reduce((s, i) => s + i.qty * i.price, 0);
  const taxAmount = subtotal * (form.tax / 100);
  const total = subtotal + taxAmount;

  function setField<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function setItem(index: number, field: keyof Item, value: string | number) {
    setForm((f) => {
      const items = [...f.items];
      items[index] = { ...items[index], [field]: value };
      return { ...f, items };
    });
  }

  function addItem() {
    setForm((f) => ({ ...f, items: [...f.items, { name: "", qty: 1, price: 0 }] }));
  }

  function removeItem(index: number) {
    setForm((f) => ({ ...f, items: f.items.filter((_, i) => i !== index) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await downloadPDF(
        "invoice",
        { ...form, subtotal, taxAmount, total },
        `invoice-${form.invoiceNo || Date.now()}.pdf`
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-5">
      {/* Company Info */}
      <section className="bg-white rounded-lg border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">ข้อมูลบริษัท</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              ชื่อบริษัท <span className="text-red-500">*</span>
            </label>
            <input
              required
              value={form.companyName}
              onChange={(e) => setField("companyName", e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-500"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-700 mb-1">ที่อยู่</label>
            <input
              value={form.companyAddress}
              onChange={(e) => setField("companyAddress", e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">โทรศัพท์</label>
            <input
              value={form.companyTel}
              onChange={(e) => setField("companyTel", e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">อีเมล</label>
            <input
              type="email"
              value={form.companyEmail}
              onChange={(e) => setField("companyEmail", e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-500"
            />
          </div>
        </div>
      </section>

      {/* Invoice Details */}
      <section className="bg-white rounded-lg border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">รายละเอียดใบแจ้งหนี้</h2>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              เลขที่ใบแจ้งหนี้ <span className="text-red-500">*</span>
            </label>
            <input
              required
              value={form.invoiceNo}
              onChange={(e) => setField("invoiceNo", e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">วันที่ออกใบแจ้งหนี้</label>
            <input
              type="date"
              value={form.invoiceDate}
              onChange={(e) => setField("invoiceDate", e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              ชื่อลูกค้า <span className="text-red-500">*</span>
            </label>
            <input
              required
              value={form.clientName}
              onChange={(e) => setField("clientName", e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">วันครบกำหนด</label>
            <input
              type="date"
              value={form.dueDate}
              onChange={(e) => setField("dueDate", e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-500"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-700 mb-1">ที่อยู่ลูกค้า</label>
            <input
              value={form.clientAddress}
              onChange={(e) => setField("clientAddress", e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-500"
            />
          </div>
        </div>
      </section>

      {/* Items */}
      <section className="bg-white rounded-lg border border-gray-200 p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-semibold text-gray-900">รายการสินค้า/บริการ</h2>
          <button
            type="button"
            onClick={addItem}
            className="text-xs border border-slate-300 text-slate-700 rounded-md px-3 py-1 hover:bg-slate-50 transition-colors"
          >
            + เพิ่มรายการ
          </button>
        </div>

        <div className="space-y-2">
          <div className="grid grid-cols-12 gap-2 text-xs font-medium text-gray-500 px-1">
            <div className="col-span-6">ชื่อสินค้า/บริการ</div>
            <div className="col-span-2">จำนวน</div>
            <div className="col-span-3">ราคา/หน่วย (฿)</div>
            <div className="col-span-1" />
          </div>
          {form.items.map((item, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-6">
                <input
                  required
                  value={item.name}
                  onChange={(e) => setItem(i, "name", e.target.value)}
                  placeholder="ชื่อสินค้า/บริการ"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-500"
                />
              </div>
              <div className="col-span-2">
                <input
                  type="number"
                  min="1"
                  required
                  value={item.qty}
                  onChange={(e) => setItem(i, "qty", Number(e.target.value))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-500"
                />
              </div>
              <div className="col-span-3">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={item.price}
                  onChange={(e) => setItem(i, "price", Number(e.target.value))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-500"
                />
              </div>
              <div className="col-span-1 flex justify-center">
                {form.items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(i)}
                    className="text-gray-400 hover:text-red-500 transition-colors text-base leading-none"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="mt-5 pt-4 border-t border-gray-100 space-y-2 max-w-xs ml-auto">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">ยอดรวม</span>
            <span className="font-medium">
              ฿{subtotal.toLocaleString("th-TH", { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-600">ภาษี</span>
              <input
                type="number"
                min="0"
                max="100"
                value={form.tax}
                onChange={(e) => setField("tax", Number(e.target.value))}
                className="w-14 rounded-md border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-slate-500 text-center"
              />
              <span className="text-gray-600">%</span>
            </div>
            <span className="font-medium">
              ฿{taxAmount.toLocaleString("th-TH", { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-gray-100">
            <span className="text-sm font-semibold text-gray-900">ยอดรวมสุทธิ</span>
            <span className="text-base font-bold text-slate-900">
              ฿{total.toLocaleString("th-TH", { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </section>

      {/* Note */}
      <section className="bg-white rounded-lg border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">หมายเหตุ</h2>
        <textarea
          value={form.note}
          onChange={(e) => setField("note", e.target.value)}
          rows={3}
          placeholder="หมายเหตุเพิ่มเติม..."
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
