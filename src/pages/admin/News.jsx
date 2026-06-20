import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { AdminPageHeader, Table, Empty, TextField, TextArea, Select } from "@/components/admin/Table";
import { Trash2, Plus, X, Pencil } from "lucide-react";
import { toast } from "sonner";
import FileUploader from "@/components/FileUploader";

const empty = { title: "", title_ta: "", summary: "", summary_ta: "", content: "", content_ta: "", category: "general", image_url: "", published: true, date: "" };

export default function AdminNews() {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target?.value ?? e });

  const load = async () => { const r = await api.get("/admin/news"); setRows(r.data || []); };
  useEffect(() => { load(); }, []);

  const submit = async (ev) => {
    ev.preventDefault();
    try {
      const payload = { ...form, published: form.published === true || form.published === "true", date: form.date || new Date().toISOString() };
      if (editId) await api.put(`/admin/news/${editId}`, payload);
      else await api.post("/admin/news", payload);
      toast.success("Saved"); setOpen(false); setEditId(null); setForm(empty); load();
    } catch { toast.error("Failed"); }
  };

  const edit = (r) => { setEditId(r.id); setForm({ ...empty, ...r, date: r.date?.split("T")[0] || "" }); setOpen(true); };
  const del = async (id) => { if (!window.confirm("Delete?")) return; await api.delete(`/admin/news/${id}`); toast.success("Deleted"); load(); };
  const togglePublish = async (r) => { await api.put(`/admin/news/${r.id}`, { ...r, published: !r.published }); load(); };

  return (
    <div>
      <AdminPageHeader title="News" action={
        <Button onClick={() => { setEditId(null); setForm(empty); setOpen(true); }} className="bg-ntk-red text-white" data-testid="add-news-btn"><Plus className="h-4 w-4 mr-2" />Add News</Button>
      } />
      <Table testid="news-table" headers={["Title", "Category", "Date", "Status", "Actions"]}>
        {rows.length === 0 && <Empty cols={5} />}
        {rows.map((r) => (
          <tr key={r.id}>
            <td className="px-4 py-3"><div className="font-medium">{r.title}</div><div className="text-xs text-muted-foreground">{r.title_ta}</div></td>
            <td className="px-4 py-3 text-xs uppercase tracking-wider">{r.category}</td>
            <td className="px-4 py-3 text-xs">{new Date(r.date).toLocaleDateString()}</td>
            <td className="px-4 py-3">
              <button onClick={() => togglePublish(r)} className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${r.published ? "bg-green-500/10 text-green-700" : "bg-secondary text-muted-foreground"}`}>{r.published ? "Published" : "Draft"}</button>
            </td>
            <td className="px-4 py-3 flex gap-1">
              <button onClick={() => edit(r)} className="p-1.5 hover:bg-secondary rounded"><Pencil className="h-4 w-4" /></button>
              <button onClick={() => del(r.id)} className="p-1.5 hover:bg-destructive/10 text-destructive rounded"><Trash2 className="h-4 w-4" /></button>
            </td>
          </tr>
        ))}
      </Table>
      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 grid place-items-center p-4 overflow-auto">
          <form onSubmit={submit} className="w-full max-w-3xl rounded-xl bg-card border border-border p-6 grid gap-4 my-8" data-testid="news-form">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-display font-bold">{editId ? "Edit News" : "Add News"}</h2>
              <button type="button" onClick={() => setOpen(false)}><X className="h-5 w-5" /></button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <TextField label="Title (EN)" value={form.title} onChange={set("title")} required />
              <TextField label="தலைப்பு (TA)" value={form.title_ta} onChange={set("title_ta")} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <TextArea label="Summary (EN)" value={form.summary} onChange={set("summary")} />
              <TextArea label="சுருக்கம் (TA)" value={form.summary_ta} onChange={set("summary_ta")} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <TextArea label="Content (EN)" value={form.content} onChange={set("content")} rows={5} />
              <TextArea label="உள்ளடக்கம் (TA)" value={form.content_ta} onChange={set("content_ta")} rows={5} />
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <Select label="Category" value={form.category} onChange={set("category")} options={[
                { value: "general", label: "General" }, { value: "party", label: "Party" },
                { value: "welfare", label: "Welfare" }, { value: "culture", label: "Culture" },
              ]} />
              <TextField label="Date" type="date" value={form.date} onChange={set("date")} />
              <Select label="Status" value={String(form.published)} onChange={(e) => setForm({ ...form, published: e.target.value === "true" })}
                options={[{ value: "true", label: "Published" }, { value: "false", label: "Draft" }]} />
            </div>
            <div className="grid gap-1.5">
              <span className="text-xs uppercase tracking-wider font-semibold">Cover Image</span>
              <FileUploader value={form.image_url} onChange={(url) => setForm({ ...form, image_url: url })} folder="news" testid="news-image" />
            </div>
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
