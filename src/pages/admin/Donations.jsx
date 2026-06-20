import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { AdminPageHeader, Table, Empty } from "@/components/admin/Table";
import { Trash2, Heart, IndianRupee } from "lucide-react";
import { toast } from "sonner";

export default function AdminDonations() {
  const [rows, setRows] = useState([]);
  const load = async () => { const r = await api.get("/admin/donations"); setRows(r.data || []); };
  useEffect(() => { load(); }, []);
  const del = async (id) => { if (!window.confirm("Delete?")) return; await api.delete(`/admin/donations/${id}`); toast.success("Deleted"); load(); };
  const total = rows.reduce((s, r) => s + Number(r.amount || 0), 0);
  const paid = rows.filter((r) => r.status === "paid").reduce((s, r) => s + Number(r.amount || 0), 0);

  return (
    <div>
      <AdminPageHeader title="Donations" />
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <Card label="Total donations" value={rows.length} Icon={Heart} />
        <Card label="Total intent (₹)" value={total.toLocaleString()} Icon={IndianRupee} />
        <Card label="Paid (₹)" value={paid.toLocaleString()} Icon={IndianRupee} />
      </div>
      <Table testid="donations-table" headers={["Donor", "Mobile", "Amount", "Mode", "Status", "Date", "Actions"]}>
        {rows.length === 0 && <Empty cols={7} />}
        {rows.map((r) => (
          <tr key={r.id} data-testid={`donation-row-${r.id}`}>
            <td className="px-4 py-3 font-medium">{r.name}<div className="text-xs text-muted-foreground">{r.email}</div></td>
            <td className="px-4 py-3">{r.mobile}</td>
            <td className="px-4 py-3 font-bold">₹{Number(r.amount).toLocaleString()}</td>
            <td className="px-4 py-3 text-xs uppercase tracking-wider">{r.mode}</td>
            <td className="px-4 py-3">
              <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${r.status === "paid" ? "bg-emerald-500/10 text-emerald-700" : "bg-amber-500/10 text-amber-700"}`}>{r.status}</span>
            </td>
            <td className="px-4 py-3 text-xs">{new Date(r.created_at).toLocaleDateString()}</td>
            <td className="px-4 py-3"><button onClick={() => del(r.id)} className="text-destructive p-1.5"><Trash2 className="h-4 w-4" /></button></td>
          </tr>
        ))}
      </Table>
    </div>
  );
}

const Card = ({ label, value, Icon }) => (
  <div className="rounded-xl border border-border bg-card p-5">
    <div className="flex items-center justify-between">
      <div className="h-10 w-10 rounded-md bg-ntk-red text-white flex items-center justify-center"><Icon className="h-5 w-5" /></div>
    </div>
    <div className="mt-3 text-3xl font-display font-black">{value}</div>
    <div className="text-xs text-muted-foreground">{label}</div>
  </div>
);
