"use client";
import { useState } from "react";
import { scanNfc } from "@/lib/nfc"; // Using the utility we created earlier
import { toast, Toaster } from "sonner";
import { UserPlus, ShieldCheck, Database } from "lucide-react";

export default function AdminPortal() {
  const [form, setForm] = useState({ name: "", wallet: "", nfcHash: "" });
  const [loading, setLoading] = useState(false);

  const handleScan = async () => {
    try {
      const hash = await scanNfc();
      setForm({ ...form, nfcHash: hash });
      toast.success("NFC Card Linked Successfully");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const registerOnChain = async () => {
    if (!form.nfcHash || !form.wallet) return toast.error("Missing Data");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          citizen_addr: form.wallet,
          citizen_id: form.name,
          nfc_hash: form.nfcHash,
        }),
      });
      if (res.ok) toast.success("Citizen Registered on Stellar");
    } catch (err) {
      toast.error("Backend Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black p-8 font-mono">
      <Toaster />
      <div className="max-w-2xl mx-auto border-4 border-black p-10 space-y-10">
        <header className="border-b-4 border-black pb-4">
          <h1 className="text-5xl font-black uppercase tracking-tighter">Admin : Registrar</h1>
        </header>

        <div className="grid gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase">Full Name / ID</label>
            <input
              className="w-full border-2 border-black p-3 outline-none focus:bg-zinc-100"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase">Stellar Wallet Address</label>
            <input
              className="w-full border-2 border-black p-3 outline-none focus:bg-zinc-100"
              placeholder="G..."
              onChange={(e) => setForm({ ...form, wallet: e.target.value })}
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleScan}
              className="flex-1 border-2 border-black p-4 font-bold hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <Database size={18} /> {form.nfcHash ? "Card Ready" : "Scan NFC Card"}
            </button>

            <button
              onClick={registerOnChain}
              disabled={loading}
              className="flex-1 bg-black text-white p-4 font-bold uppercase hover:bg-zinc-800 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <ShieldCheck size={18} /> {loading ? "Syncing..." : "Finalize Binding"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
