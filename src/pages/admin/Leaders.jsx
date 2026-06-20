import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { AdminPageHeader, Table, Empty, TextField, Select } from "@/components/admin/Table";
import { Trash2, Plus, X, Pencil } from "lucide-react";
import { toast } from "sonner";
import FileUploader from "@/components/FileUploader";

const empty = { name: "", name_ta: "", designation: "", designation_ta: "", wing: "constituency", phone: "", email: "", photo_url: "", order: 0 };
const wingOptions = [
  { value: "national", label: "National" },
  { value: "district", label: "District" },
  { value: "constituency", label: "Constituency" },
  { value: "youth", label: "Youth Wing" },
  { value: "women", label: "Women Wing" },
  { value: "it", label: "IT Wing" },
];

export default function AdminLeaders() {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target?.value ?? e });

  const load = async () => { const r = await api.get("/leaders"); setRows(r.data || []); };
  useEffect(() => { load(); }, []);

  const submit = async (ev) => {
    ev.preventDefault();
    try {
      const payload = { ...form, order: Number(form.order) || 0 };
      if (editId) await api.put(`/admin/leaders/${editId}`, payload);
      else await api.post("/admin/leaders", payload);
      toast.success("Saved"); setOpen(false); setEditId(null); setForm(empty); load();
    } catch (e) { toast.error("Failed"); }
  };

  const edit = (r) => { setEditId(r.id); setForm({ ...empty, ...r }); setOpen(true); };
  const del = async (id) => { if (!window.confirm("Delete?")) return; await api.delete(`/admin/leaders/${id}`); toast.success("Deleted"); load(); };

  return (
    <div>
      <AdminPageHeader title="Leaders" action={
        <Button onClick={() => { setEditId(null); setForm(empty); setOpen(true); }} className="bg-ntk-red text-white" data-testid="add-leader-btn"><Plus className="h-4 w-4 mr-2" />Add Leader</Button>
      } />
      <Table testid="leaders-table" headers={["Name", "Designation", "Wing", "Order", "Actions"]}>
        {rows.length === 0 && <Empty cols={5} />}
        {rows.map((r) => (
          <tr key={r.id}>
            <td className="px-4 py-3"><div className="flex items-center gap-3">{r.photo_url && <img src={r.photo_url} alt="" className="h-9 w-9 rounded-full object-cover" />}<div><div className="font-medium">{r.name}</div><div className="text-xs text-muted-foreground">{r.name_ta}</div></div></div></td>
            <td className="px-4 py-3">{r.designation}<div className="text-xs text-muted-foreground">{r.designation_ta}</div></td>
            <td className="px-4 py-3 text-xs uppercase tracking-wider">{r.wing}</td>
            <td className="px-4 py-3">{r.order}</td>
            <td className="px-4 py-3 flex gap-1">
              <button onClick={() => edit(r)} className="p-1.5 hover:bg-secondary rounded"><Pencil className="h-4 w-4" /></button>
              <button onClick={() => del(r.id)} className="p-1.5 hover:bg-destructive/10 text-destructive rounded"><Trash2 className="h-4 w-4" /></button>
            </td>
          </tr>
        ))}
      </Table>
      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 grid place-items-center p-4">
          <form onSubmit={submit} className="w-full max-w-2xl rounded-xl bg-card border border-border p-6 grid gap-4" data-testid="leader-form">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-display font-bold">{editId ? "Edit Leader" : "Add Leader"}</h2>
              <button type="button" onClick={() => setOpen(false)}><X className="h-5 w-5" /></button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <TextField label="Name (EN)" value={form.name} onChange={set("name")} required />
              <TextField label="பெயர் (TA)" value={form.name_ta} onChange={set("name_ta")} />
              <TextField label="Designation (EN)" value={form.designation} onChange={set("designation")} required />
              <TextField label="பதவி (TA)" value={form.designation_ta} onChange={set("designation_ta")} />
              <Select label="Wing" value={form.wing} onChange={set("wing")} options={wingOptions} />
              <TextField label="Order" type="number" value={form.order} onChange={set("order")} />
              <TextField label="Phone" value={form.phone} onChange={set("phone")} />
              <TextField label="Email" value={form.email} onChange={set("email")} />
            </div>
            <div className="grid gap-1.5">
              <span className="text-xs uppercase tracking-wider font-semibold">Photo</span>
              <FileUploader value={form.photo_url} onChange={(url) => setForm({ ...form, photo_url: url })} folder="leaders" testid="leader-photo" />
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
