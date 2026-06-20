import React, { useRef, useState } from "react";
import { api } from "@/lib/api";
import { UploadCloud, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

/**
 * FileUploader — uploads to /api/upload, returns the URL via onChange.
 * Props:
 *   value: current URL string
 *   onChange(url)
 *   folder: folder name for storage
 *   accept: input accept attribute (default image/*)
 *   testid: optional data-testid
 */
export default function FileUploader({ value, onChange, folder = "misc", accept = "image/*", testid }) {
  const ref = useRef(null);
  const [busy, setBusy] = useState(false);

  const handleFile = async (file) => {
    if (!file) return;
    if (file.size > 25 * 1024 * 1024) { toast.error("File too large (max 25MB)"); return; }
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", folder);
    setBusy(true);
    try {
      const r = await api.post("/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
      const url = r.data.url.startsWith("http") ? r.data.url : `${process.env.REACT_APP_BACKEND_URL}${r.data.url}`;
      onChange(url);
      toast.success("Uploaded");
    } catch (e) {
      toast.error("Upload failed");
    } finally {
      setBusy(false);
      if (ref.current) ref.current.value = "";
    }
  };

  return (
    <div className="grid gap-2" data-testid={testid}>
      <div className="flex items-start gap-3">
        {value ? (
          <div className="relative">
            <img src={value} alt="" className="h-20 w-20 rounded-md object-cover border border-border" />
            <button type="button" onClick={() => onChange("")} className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-white flex items-center justify-center" aria-label="Remove"><X className="h-3 w-3" /></button>
          </div>
        ) : (
          <div className="h-20 w-20 rounded-md border border-dashed border-border flex items-center justify-center text-muted-foreground">
            <UploadCloud className="h-6 w-6" />
          </div>
        )}
        <div className="flex-1">
          <button type="button" onClick={() => ref.current?.click()} disabled={busy}
            className="inline-flex items-center gap-2 rounded-md border border-border bg-secondary px-3 py-2 text-sm font-medium hover:border-ntk-red hover:text-ntk-red transition disabled:opacity-50">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
            {busy ? "Uploading…" : (value ? "Replace file" : "Upload file")}
          </button>
          <input ref={ref} type="file" accept={accept} className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
          {value && <div className="mt-2 text-[10px] text-muted-foreground truncate max-w-xs">{value}</div>}
        </div>
      </div>
      <input type="text" value={value || ""} onChange={(e) => onChange(e.target.value)}
        placeholder="…or paste a URL"
        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs" />
    </div>
  );
}
