import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { AdminPageHeader, Table, Empty, TextField, Select } from "@/components/admin/Table";
import { Trash2, Plus, X } from "lucide-react";
import { toast } from "sonner";
import FileUploader from "@/components/FileUploader";

const empty = { title: "", title_ta: "", media_type: "image", url: "", thumbnail_url: "", album: "general" };

export default function AdminGallery() {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target?.value ?? e });

  const load = async () => { const r = await api.get("/gallery"); setRows(r.data || []); };
  useEffect(() => { load(); }, []);

  const submit = async (ev) => {
    ev.preventDefault();
    try { await api.post("/admin/gallery", form); toast.success("Saved"); setOpen(false); setForm(empty); load(); }
    catch { toast.error("Failed"); }
  };
  const del = async (id) => { if (!window.confirm("Delete?")) return; await api.delete(`/admin/gallery/${id}`); toast.success("Deleted"); load(); };

  return (
    <div>
      <AdminPageHeader title="Gallery" action={
        <Button onClick={() => { setForm(empty); setOpen(true); }} className="bg-ntk-red text-white" data-testid="add-gallery-btn"><Plus className="h-4 w-4 mr-2" />Add Media</Button>
      } />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4" data-testid="gallery-grid">
        {rows.length === 0 && <div className="col-span-4 text-sm text-muted-foreground">No media yet.</div>}
        {rows.map((r) => (
          <div key={r.id} className="rounded-lg overflow-hidden border border-border bg-card group">
            <div className="aspect-square relative overflow-hidden">
              {r.media_type === "image" ? (
                <img src={r.thumbnail_url || r.url} alt={r.title} className="h-full w-full object-cover" />
              ) : (
                <video src={r.url} className="h-full w-full object-cover" />
              )}
              <button onClick={() => del(r.id)} className="absolute top-2 right-2 bg-destructive text-white p-1.5 rounded opacity-0 group-hover:opacity-100 transition"><Trash2 className="h-4 w-4" /></button>
            </div>
            <div className="p-2.5">
              <div className="text-sm font-medium truncate">{r.title}</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{r.media_type} · {r.album}</div>
            </div>
          </div>
        ))}
      </div>
      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 grid place-items-center p-4">
          <form onSubmit={submit} className="w-full max-w-xl rounded-xl bg-card border border-border p-6 grid gap-4" data-testid="gallery-form">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-display font-bold">Add Media</h2>
              <button type="button" onClick={() => setOpen(false)}><X className="h-5 w-5" /></button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <TextField label="Title (EN)" value={form.title} onChange={set("title")} required />
              <TextField label="தலைப்பு (TA)" value={form.title_ta} onChange={set("title_ta")} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Select label="Type" value={form.media_type} onChange={set("media_type")} options={[{ value: "image", label: "Image" }, { value: "video", label: "Video" }]} />
              <TextField label="Album" value={form.album} onChange={set("album")} />
            </div>
            <div className="grid gap-1.5">
              <span className="text-xs uppercase tracking-wider font-semibold">Media File</span>
              <FileUploader value={form.url} onChange={(url) => setForm({ ...form, url })} folder="gallery"
                accept={form.media_type === "video" ? "video/*" : "image/*"} testid="gallery-media" />
            </div>
            <TextField label="Thumbnail URL (optional, for videos)" value={form.thumbnail_url} onChange={set("thumbnail_url")} />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-ntk-red text-white">Save</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
