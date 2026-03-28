export type ExportFormat = "pdf" | "docx" | "xlsx";

const FILE_EXTENSIONS: Record<ExportFormat, string> = {
  pdf: "pdf",
  docx: "docx",
  xlsx: "xlsx",
};

/**
 * Generate a document in the specified format and trigger a browser download.
 */
export async function downloadExport(
  type: string,
  format: ExportFormat,
  data: object,
  filename: string,
  summary: string
): Promise<void> {
  const ext = FILE_EXTENSIONS[format];
  const filenameWithExt = filename.endsWith(`.${ext}`)
    ? filename
    : `${filename}.${ext}`;

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/export/generate`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, format, data, summary }),
    }
  );

  if (!response.ok) {
    const err = await response.json().catch(() => null);
    throw new Error(err?.message ?? `เกิดข้อผิดพลาด (${response.status})`);
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filenameWithExt;
  document.body.appendChild(a);
  a.click();
  URL.revokeObjectURL(url);
  document.body.removeChild(a);
}
