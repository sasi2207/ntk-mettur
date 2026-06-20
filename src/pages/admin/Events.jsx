import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { AdminPageHeader, Table, Empty, TextField, TextArea, Select } from "@/components/admin/Table";
import { Trash2, Plus, X, Pencil } from "lucide-react";
import { toast } from "sonner";
import FileUploader from "@/components/FileUploader";

const empty = { title: "", title_ta: "", description: "", description_ta: "", date: "", location: "", image_url: "", status: "upcoming" };

export default function AdminEvents() {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target?.value ?? e });

  const load = async () => { const r = await api.get("/admin/events"); setRows(r.data || []); };
  useEffect(() => { load(); }, []);

  const submit = async (ev) => {
    ev.preventDefault();
    try {
      const payload = { ...form, date: form.date ? new Date(form.date).toISOString() : new Date().toISOString() };
      if (editId) await api.put(`/admin/events/${editId}`, payload);
      else await api.post("/admin/events", payload);
      toast.success("Saved"); setOpen(false); setEditId(null); setForm(empty); load();
    } catch { toast.error("Failed"); }
  };

  const edit = (r) => {
    setEditId(r.id);
    const dateLocal = r.date ? new Date(r.date).toISOString().slice(0, 16) : "";
    setForm({ ...empty, ...r, date: dateLocal });
    setOpen(true);
  };
  const del = async (id) => { if (!window.confirm("Delete?")) return; await api.delete(`/admin/events/${id}`); toast.success("Deleted"); load(); };

  return (
    <div>
      <AdminPageHeader title="Events" action={
        <Button onClick={() => { setEditId(null); setForm(empty); setOpen(true); }} className="bg-ntk-red text-white" data-testid="add-event-btn"><Plus className="h-4 w-4 mr-2" />Add Event</Button>
      } />
      <Table testid="events-table" headers={["Title", "Date", "Location", "Status", "Actions"]}>
        {rows.length === 0 && <Empty cols={5} />}
        {rows.map((r) => (
          <tr key={r.id}>
            <td className="px-4 py-3"><div className="font-medium">{r.title}</div><div className="text-xs text-muted-foreground">{r.title_ta}</div></td>
            <td className="px-4 py-3 text-xs">{new Date(r.date).toLocaleString()}</td>
            <td className="px-4 py-3">{r.location || "—"}</td>
            <td className="px-4 py-3"><span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${r.status === "upcoming" ? "bg-ntk-yellow/30 text-foreground" : "bg-secondary"}`}>{r.status}</span></td>
            <td className="px-4 py-3 flex gap-1">
              <button onClick={() => edit(r)} className="p-1.5 hover:bg-secondary rounded"><Pencil className="h-4 w-4" /></button>
              <button onClick={() => del(r.id)} className="p-1.5 hover:bg-destructive/10 text-destructive rounded"><Trash2 className="h-4 w-4" /></button>
            </td>
          </tr>
        ))}
      </Table>
      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 grid place-items-center p-4 overflow-auto">
          <form onSubmit={submit} className="w-full max-w-2xl rounded-xl bg-card border border-border p-6 grid gap-4 my-8" data-testid="event-form">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-display font-bold">{editId ? "Edit Event" : "Add Event"}</h2>
              <button type="button" onClick={() => setOpen(false)}><X className="h-5 w-5" /></button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <TextField label="Title (EN)" value={form.title} onChange={set("title")} required />
              <TextField label="தலைப்பு (TA)" value={form.title_ta} onChange={set("title_ta")} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <TextArea label="Description (EN)" value={form.description} onChange={set("description")} />
              <TextArea label="விளக்கம் (TA)" value={form.description_ta} onChange={set("description_ta")} />
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <TextField label="Date & Time" type="datetime-local" value={form.date} onChange={set("date")} required />
              <TextField label="Location" value={form.location} onChange={set("location")} />
              <Select label="Status" value={form.status} onChange={set("status")} options={[{ value: "upcoming", label: "Upcoming" }, { value: "completed", label: "Completed" }]} />
            </div>
            <div className="grid gap-1.5">
              <span className="text-xs uppercase tracking-wider font-semibold">Banner Image</span>
              <FileUploader value={form.image_url} onChange={(url) => setForm({ ...form, image_url: url })} folder="events" testid="event-image" />
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
