import React, { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "@/lib/api";
import { QRCodeCanvas } from "qrcode.react";
import { Button } from "@/components/ui/button";
import html2canvas from "html2canvas";
import { Download, ArrowLeft, BadgeCheck } from "lucide-react";
import SEO from "@/components/SEO";

export default function MemberCard() {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [err, setErr] = useState("");
  const cardRef = useRef(null);

  useEffect(() => {
    api.get(`/members/${id}`)
      .then((r) => setMember(r.data))
      .catch(() => setErr("Member not found"));
  }, [id]);

  const download = async () => {
    if (!cardRef.current) return;
    const canvas = await html2canvas(cardRef.current, { scale: 2, backgroundColor: null, useCORS: true });
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `ntk-mettur-id-${id.slice(0, 8)}.png`;
    link.click();
  };

  if (err) {
    return <div className="max-w-md mx-auto py-20 text-center text-sm text-muted-foreground" data-testid="card-error">{err}<br/><Link to="/" className="text-ntk-red mt-3 inline-block">Go home</Link></div>;
  }
  if (!member) return <div className="max-w-md mx-auto py-20 text-center text-sm text-muted-foreground">Loading…</div>;

  const profileUrl = `${window.location.origin}/id/${member.id}`;
  const joinYear = new Date(member.created_at).getFullYear();
  const idShort = member.id.slice(0, 8).toUpperCase();

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12" data-testid="member-card-page">
      <SEO title={`Member · ${member.name}`} path={`/id/${id}`} />
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-ntk-red mb-6"><ArrowLeft className="h-4 w-4" />Home</Link>

      <div ref={cardRef} className="relative mx-auto w-full max-w-md aspect-[1.586] rounded-2xl overflow-hidden shadow-2xl bg-ntk-black text-white" data-testid="member-card">
        <div className="absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_20%_20%,#D71920_0%,transparent_60%)]" />
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-ntk-red via-ntk-yellow to-ntk-red" />
        <div className="relative h-full p-6 flex flex-col justify-between">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-md bg-ntk-red flex items-center justify-center font-display font-black text-xl">ந</div>
              <div>
                <div className="font-display font-bold text-sm leading-tight">NAAM TAMILAR KATCHI</div>
                <div className="text-[10px] text-white/70 leading-tight">Mettur Assembly Constituency</div>
              </div>
            </div>
            <div className="rounded bg-ntk-yellow text-ntk-black text-[10px] font-bold px-2 py-1 uppercase tracking-widest flex items-center gap-1"><BadgeCheck className="h-3 w-3" />Member</div>
          </div>

          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-ntk-yellow">Member</div>
              <div className="font-display font-black text-2xl mt-1 leading-tight">{member.name}</div>
              <div className="text-xs text-white/70 mt-1">{member.mobile}</div>
              {member.village && <div className="text-xs text-white/70">{member.village}{member.ward_number ? ` · Ward ${member.ward_number}` : ""}</div>}
              <div className="mt-3 text-[10px] text-white/60">
                <div>ID · <span className="font-mono">{idShort}</span></div>
                <div>Since · {joinYear}</div>
              </div>
            </div>
            <div className="bg-white p-2 rounded-md">
              <QRCodeCanvas value={profileUrl} size={88} fgColor="#0A0A0A" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Button onClick={download} className="bg-ntk-red text-white" data-testid="card-download"><Download className="h-4 w-4 mr-2" />Download PNG</Button>
        <Link to="/membership"><Button variant="outline">Join another member</Button></Link>
      </div>
    </div>
  );
}
