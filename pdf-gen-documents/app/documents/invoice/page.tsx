"use client";

import { useState } from "react";
import { downloadPDF } from "@/lib/pdf";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const filename = `invoice-${form.invoiceNo || Date.now()}.pdf`;
    try {
      await downloadPDF(
        "invoice",
        { ...form, subtotal, taxAmount, total },
        filename,
        `${form.invoiceNo ? `#${form.invoiceNo} · ` : ""}${form.clientName}`
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
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">ข้อมูลบริษัท</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          <div className="col-span-2 space-y-1.5">
            <Label htmlFor="companyName">
              ชื่อบริษัท <span className="text-destructive">*</span>
            </Label>
            <Input
              id="companyName"
              required
              value={form.companyName}
              onChange={(e) => setField("companyName", e.target.value)}
            />
          </div>
          <div className="col-span-2 space-y-1.5">
            <Label htmlFor="companyAddress">ที่อยู่</Label>
            <Input
              id="companyAddress"
              value={form.companyAddress}
              onChange={(e) => setField("companyAddress", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="companyTel">โทรศัพท์</Label>
            <Input
              id="companyTel"
              value={form.companyTel}
              onChange={(e) => setField("companyTel", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="companyEmail">อีเมล</Label>
            <Input
              id="companyEmail"
              type="email"
              value={form.companyEmail}
              onChange={(e) => setField("companyEmail", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Invoice Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">รายละเอียดใบแจ้งหนี้</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="invoiceNo">
              เลขที่ใบแจ้งหนี้ <span className="text-destructive">*</span>
            </Label>
            <Input
              id="invoiceNo"
              required
              value={form.invoiceNo}
              onChange={(e) => setField("invoiceNo", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="invoiceDate">วันที่ออกใบแจ้งหนี้</Label>
            <Input
              id="invoiceDate"
              type="date"
              value={form.invoiceDate}
              onChange={(e) => setField("invoiceDate", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="clientName">
              ชื่อลูกค้า <span className="text-destructive">*</span>
            </Label>
            <Input
              id="clientName"
              required
              value={form.clientName}
              onChange={(e) => setField("clientName", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="dueDate">วันครบกำหนด</Label>
            <Input
              id="dueDate"
              type="date"
              value={form.dueDate}
              onChange={(e) => setField("dueDate", e.target.value)}
            />
          </div>
          <div className="col-span-2 space-y-1.5">
            <Label htmlFor="clientAddress">ที่อยู่ลูกค้า</Label>
            <Input
              id="clientAddress"
              value={form.clientAddress}
              onChange={(e) => setField("clientAddress", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Items */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm">รายการสินค้า/บริการ</CardTitle>
          <Button type="button" variant="outline" size="sm" onClick={addItem}>
            + เพิ่มรายการ
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-12 gap-2 text-xs font-medium text-muted-foreground px-1">
            <div className="col-span-6">ชื่อสินค้า/บริการ</div>
            <div className="col-span-2">จำนวน</div>
            <div className="col-span-3">ราคา/หน่วย (฿)</div>
            <div className="col-span-1" />
          </div>
          {form.items.map((item, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-6">
                <Input
                  required
                  value={item.name}
                  onChange={(e) => setItem(i, "name", e.target.value)}
                  placeholder="ชื่อสินค้า/บริการ"
                />
              </div>
              <div className="col-span-2">
                <Input
                  type="number"
                  min="1"
                  required
                  value={item.qty}
                  onChange={(e) => setItem(i, "qty", Number(e.target.value))}
                />
              </div>
              <div className="col-span-3">
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={item.price}
                  onChange={(e) => setItem(i, "price", Number(e.target.value))}
                />
              </div>
              <div className="col-span-1 flex justify-center">
                {form.items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(i)}
                    className="text-muted-foreground hover:text-destructive transition-colors text-base leading-none"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Totals */}
          <div className="mt-4 pt-4 border-t space-y-2 max-w-xs ml-auto text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">ยอดรวม</span>
              <span className="font-medium">
                ฿{subtotal.toLocaleString("th-TH", { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-muted-foreground">
                <span>ภาษี</span>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={form.tax}
                  onChange={(e) => setField("tax", Number(e.target.value))}
                  className="w-14 h-7 text-center text-xs"
                />
                <span>%</span>
              </div>
              <span className="font-medium">
                ฿{taxAmount.toLocaleString("th-TH", { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t font-semibold">
              <span>ยอดรวมสุทธิ</span>
              <span className="text-base">
                ฿{total.toLocaleString("th-TH", { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Note */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">หมายเหตุ</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={form.note}
            onChange={(e) => setField("note", e.target.value)}
            rows={3}
            placeholder="หมายเหตุเพิ่มเติม..."
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