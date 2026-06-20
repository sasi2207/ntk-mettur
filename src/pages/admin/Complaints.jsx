import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { AdminPageHeader, Table, Empty } from "@/components/admin/Table";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

const STATUSES = ["Pending", "Processing", "Resolved"];

export default function AdminComplaints() {
  const [rows, setRows] = useState([]);
  const [replyingId, setReplyingId] = useState(null);
  const [replyText, setReplyText] = useState("");

  const load = async () => { const r = await api.get("/admin/complaints"); setRows(r.data || []); };
  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status, reply = null) => {
    try {
      await api.put(`/admin/complaints/${id}/status`, { status, reply });
      toast.success("Updated");
      setReplyingId(null); setReplyText("");
      load();
    } catch { toast.error("Failed"); }
  };
  const del = async (id) => { if (!window.confirm("Delete?")) return; await api.delete(`/admin/complaints/${id}`); toast.success("Deleted"); load(); };

  return (
    <div>
      <AdminPageHeader title="Complaints" />
      <Table testid="complaints-table" headers={["Complainant", "Village", "Category", "Description", "Status", "Actions"]}>
        {rows.length === 0 && <Empty cols={6} />}
        {rows.map((r) => (
          <React.Fragment key={r.id}>
            <tr>
              <td className="px-4 py-3"><div className="font-medium">{r.name}</div><div className="text-xs text-muted-foreground">{r.mobile}</div></td>
              <td className="px-4 py-3">{r.village || "—"}</td>
              <td className="px-4 py-3 text-xs uppercase tracking-wider">{r.category || "general"}</td>
              <td className="px-4 py-3 max-w-xs"><div className="line-clamp-2 text-sm">{r.description}</div></td>
              <td className="px-4 py-3">
                <select value={r.status} onChange={(e) => updateStatus(r.id, e.target.value, r.reply || null)} className="rounded-md border border-border px-2 py-1 text-xs">
                  {STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </td>
              <td className="px-4 py-3 flex gap-1">
                <button onClick={() => { setReplyingId(r.id); setReplyText(r.reply || ""); }} className="text-xs px-2 py-1 rounded bg-secondary hover:bg-ntk-red hover:text-white">Reply</button>
                <button onClick={() => del(r.id)} className="p-1.5 hover:bg-destructive/10 text-destructive rounded"><Trash2 className="h-4 w-4" /></button>
              </td>
            </tr>
            {replyingId === r.id && (
              <tr><td colSpan={6} className="px-4 py-4 bg-secondary/40">
                <div className="grid gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider">Public reply</label>
                  <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} rows={3} className="rounded-md border border-input bg-background px-3 py-2 text-sm" />
                  <div className="flex gap-2">
                    <Button type="button" onClick={() => updateStatus(r.id, r.status, replyText)} className="bg-ntk-red text-white">Save Reply</Button>
                    <Button type="button" variant="outline" onClick={() => { setReplyingId(null); setReplyText(""); }}>Cancel</Button>
                  </div>
                  {r.reply && <div className="text-xs text-muted-foreground">Current: {r.reply}</div>}
                </div>
              </td></tr>
            )}
          </React.Fragment>
        ))}
      </Table>
    </div>
  );
}
