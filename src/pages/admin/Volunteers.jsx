import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { AdminPageHeader, Table, Empty } from "@/components/admin/Table";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminVolunteers() {
  const [rows, setRows] = useState([]);
  const load = async () => { const r = await api.get("/admin/volunteers"); setRows(r.data || []); };
  useEffect(() => { load(); }, []);
  const del = async (id) => { if (!window.confirm("Delete?")) return; await api.delete(`/admin/volunteers/${id}`); toast.success("Deleted"); load(); };

  return (
    <div>
      <AdminPageHeader title="Volunteers" />
      <Table testid="volunteers-table" headers={["Name", "Mobile", "Skills", "Interest", "Time", "Actions"]}>
        {rows.length === 0 && <Empty cols={6} />}
        {rows.map((r) => (
          <tr key={r.id}>
            <td className="px-4 py-3 font-medium">{r.name}</td>
            <td className="px-4 py-3">{r.mobile}</td>
            <td className="px-4 py-3">{r.skills || "—"}</td>
            <td className="px-4 py-3">{r.area_of_interest || "—"}</td>
            <td className="px-4 py-3 text-xs">{r.available_time || "—"}</td>
            <td className="px-4 py-3"><button onClick={() => del(r.id)} className="text-destructive p-1.5"><Trash2 className="h-4 w-4" /></button></td>
          </tr>
        ))}
      </Table>
    </div>
  );
}
