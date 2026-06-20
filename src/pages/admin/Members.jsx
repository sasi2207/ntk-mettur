import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { AdminPageHeader, Table, Empty } from "@/components/admin/Table";
import { Trash2, Download } from "lucide-react";
import { toast } from "sonner";

export default function AdminMembers() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try { const r = await api.get("/admin/members"); setRows(r.data || []); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const del = async (id) => {
    if (!window.confirm("Delete this member?")) return;
    try { await api.delete(`/admin/members/${id}`); toast.success("Deleted"); load(); }
    catch { toast.error("Delete failed"); }
  };

  const exportCsv = () => {
    const headers = ["name","mobile","email","gender","village","ward_number","occupation","created_at"];
    const lines = [headers.join(",")].concat(rows.map(r =>
      headers.map(h => `"${(r[h] ?? "").toString().replace(/"/g, '""')}"`).join(",")));
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `ntk-members-${Date.now()}.csv`;
    a.click();
  };

  return (
    <div>
      <AdminPageHeader title="Members" action={
        <Button onClick={exportCsv} className="bg-ntk-red text-white" data-testid="export-members"><Download className="h-4 w-4 mr-2" />Export CSV</Button>
      } />
      <Table testid="members-table" headers={["Name", "Mobile", "Village", "Ward", "Date", "Actions"]}>
        {loading && <Empty cols={6} text="Loading..." />}
        {!loading && rows.length === 0 && <Empty cols={6} />}
        {rows.map((r) => (
          <tr key={r.id} data-testid={`member-row-${r.id}`}>
            <td className="px-4 py-3 font-medium">{r.name}<div className="text-xs text-muted-foreground">{r.email}</div></td>
            <td className="px-4 py-3">{r.mobile}</td>
            <td className="px-4 py-3">{r.village || "—"}</td>
            <td className="px-4 py-3">{r.ward_number || "—"}</td>
            <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</td>
            <td className="px-4 py-3">
              <button onClick={() => del(r.id)} className="text-destructive hover:bg-destructive/10 rounded p-1.5"><Trash2 className="h-4 w-4" /></button>
            </td>
          </tr>
        ))}
      </Table>
    </div>
  );
}
