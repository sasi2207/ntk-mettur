import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { AdminPageHeader, Table, Empty } from "@/components/admin/Table";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminContacts() {
  const [rows, setRows] = useState([]);
  const [openId, setOpenId] = useState(null);
  const load = async () => { const r = await api.get("/admin/contacts"); setRows(r.data || []); };
  useEffect(() => { load(); }, []);
  const del = async (id) => { if (!window.confirm("Delete?")) return; await api.delete(`/admin/contacts/${id}`); toast.success("Deleted"); load(); };
  return (
    <div>
      <AdminPageHeader title="Contact Messages" />
      <Table testid="contacts-table" headers={["From", "Subject", "Date", "Actions"]}>
        {rows.length === 0 && <Empty cols={4} />}
        {rows.map((r) => (
          <React.Fragment key={r.id}>
            <tr className="cursor-pointer" onClick={() => setOpenId(openId === r.id ? null : r.id)}>
              <td className="px-4 py-3"><div className="font-medium">{r.name}</div><div className="text-xs text-muted-foreground">{r.email}</div></td>
              <td className="px-4 py-3">{r.subject || "—"}</td>
              <td className="px-4 py-3 text-xs">{new Date(r.created_at).toLocaleString()}</td>
              <td className="px-4 py-3"><button onClick={(e) => { e.stopPropagation(); del(r.id); }} className="p-1.5 hover:bg-destructive/10 text-destructive rounded"><Trash2 className="h-4 w-4" /></button></td>
            </tr>
            {openId === r.id && (
              <tr><td colSpan={4} className="px-4 py-4 bg-secondary/40 text-sm whitespace-pre-wrap">{r.message}{r.phone && <div className="mt-2 text-xs text-muted-foreground">Phone: {r.phone}</div>}</td></tr>
            )}
          </React.Fragment>
        ))}
      </Table>
    </div>
  );
}
