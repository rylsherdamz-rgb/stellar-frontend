"use client";

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { AyudaBridge } from '@/lib/api';
import { toast, Toaster } from 'sonner';
import {
<<<<<<< HEAD
  Loader2,
=======
  Fingerprint,
  Loader2,
  Lock,
>>>>>>> 8763df4 (pushed the code)
  CheckCircle2,
  ShieldCheck,
  Cpu
} from 'lucide-react';

export default function AyudaAdminPortal() {
  const [adminWallet, setAdminWallet] = useState<string>("");
  const [nfc, setNfc] = useState({ hash: null, is_fresh: false });
  const [form, setForm] = useState({ name: "", beneficiaryAddr: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const interval = setInterval(async () => {
      const data = await AyudaBridge.getLatestScan();
      if (data.is_fresh && !nfc.is_fresh) {
        toast.success("NFC Handshake Captured", {
          style: { background: '#000', color: '#fff', borderRadius: '0px', border: '1px solid #474747' }
        });
      }
      setNfc(data);
    }, 2000);
    return () => clearInterval(interval);
  }, [nfc.is_fresh]);

  const handleConnect = async () => {
    try {
      const addr = await AyudaBridge.connectWallet();
      if (addr) setAdminWallet(addr);
    } catch {
      toast.error("Freighter Link Failed");
    }
  };

  const handleCommit = async () => {
<<<<<<< HEAD
    if (!form.name) {
      toast.error("Name is required");
      return;
    }
=======
>>>>>>> 8763df4 (pushed the code)
    if (!form.beneficiaryAddr.startsWith("G") || form.beneficiaryAddr.length !== 56) {
      toast.error("Invalid Beneficiary Address");
      return;
    }
<<<<<<< HEAD

    setLoading(true);
    try {
      // 1. This now triggers the Freighter Pop-up for the Admin
      const signedXdr = await AyudaBridge.register(form.name, form.beneficiaryAddr);

      if (signedXdr) {
        toast.success("Successfully added");
        setForm({ name: "", beneficiaryAddr: "" });
        // Reset NFC state after successful registration
        setNfc({ hash: null, is_fresh: false });
      }
    } catch (err: unknown) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Protocol Error: Transaction Rejected");
=======
    setLoading(true);
    try {
      const res = await AyudaBridge.register(form.name, form.beneficiaryAddr, 0);
      if (res.status === "success") {
        toast.success("Ledger Updated Successfully");
        setForm({ name: "", beneficiaryAddr: "" });
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("Protocol Error: Check Node Connection");
>>>>>>> 8763df4 (pushed the code)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9] text-[#1a1c1c] font-['Inter'] selection:bg-black selection:text-white">
      <Toaster position="bottom-right" />
      <Head>
        <title>AYUDA | The Digital Ledger of Truth</title>
      </Head>

      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-[#f3f3f4]">
        <div className="max-w-6xl mx-auto px-8 py-5 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <h1 className="font-black text-xl tracking-tighter uppercase text-black">AYUDA PROTOCOL</h1>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-[#f3f3f4] rounded-sm">
              <span className={`w-1.5 h-1.5 rounded-full ${adminWallet ? 'bg-black' : 'bg-zinc-300'}`}></span>
              <span className="font-['Space_Grotesk'] text-[9px] font-bold tracking-widest uppercase">
<<<<<<< HEAD
                {adminWallet ? 'Authority Linked' : 'Authority Required'}
=======
                {adminWallet ? 'Node Connected' : 'Authority Required'}
>>>>>>> 8763df4 (pushed the code)
              </span>
            </div>
          </div>
          <button
            onClick={handleConnect}
            className="bg-black text-white px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest hover:opacity-80 transition-all rounded-[0.125rem]"
          >
            {adminWallet ? `ID: ${adminWallet.slice(0, 6)}...` : "Connect Admin"}
          </button>
        </div>
      </nav>

      <main className="pt-32 pb-24 px-8 max-w-4xl mx-auto">
        <header className="mb-16">
          <p className="font-['Space_Grotesk'] text-xs tracking-[0.4em] uppercase text-[#777777] mb-2">Internal Ledger Console</p>
          <h2 className="text-6xl font-black tracking-tighter uppercase leading-[0.9]">
            Register <br /> <span className="text-zinc-300">Citizen.</span>
          </h2>
        </header>

        <div className="bg-white border border-[#eeeeee] overflow-hidden shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <section className="p-10 space-y-12 border-b md:border-b-0 md:border-r border-[#f3f3f4]">
              <div className="relative">
                <label className="font-['Space_Grotesk'] text-[10px] font-bold tracking-widest uppercase text-[#777777] absolute -top-4 left-0">Legal Identity</label>
                <input
                  type="text"
                  value={form.name}
<<<<<<< HEAD
                  disabled={loading}
                  className="w-full bg-transparent border-0 border-b border-[#eeeeee] py-4 focus:ring-0 focus:border-black transition-colors placeholder:text-zinc-200 text-lg font-bold disabled:opacity-50"
=======
                  className="w-full bg-transparent border-0 border-b border-[#eeeeee] py-4 focus:ring-0 focus:border-black transition-colors placeholder:text-zinc-200 text-lg font-bold"
>>>>>>> 8763df4 (pushed the code)
                  placeholder="Full Name"
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="relative">
                <label className="font-['Space_Grotesk'] text-[10px] font-bold tracking-widest uppercase text-[#777777] absolute -top-4 left-0">Stellar Asset Address</label>
                <input
                  type="text"
                  value={form.beneficiaryAddr}
<<<<<<< HEAD
                  disabled={loading}
                  className="w-full bg-transparent border-0 border-b border-[#eeeeee] py-4 focus:ring-0 focus:border-black transition-colors font-['Space_Grotesk'] text-sm tracking-tight disabled:opacity-50"
=======
                  className="w-full bg-transparent border-0 border-b border-[#eeeeee] py-4 focus:ring-0 focus:border-black transition-colors font-['Space_Grotesk'] text-sm tracking-tight"
>>>>>>> 8763df4 (pushed the code)
                  placeholder="G..."
                  onChange={(e) => setForm({ ...form, beneficiaryAddr: e.target.value })}
                />
              </div>
            </section>

            <section className={`p-10 flex flex-col justify-center items-center transition-colors duration-700 ${nfc.is_fresh ? "bg-black text-white" : "bg-[#f9f9f9]"}`}>
              {nfc.is_fresh ? (
                <div className="text-center animate-in fade-in zoom-in duration-500">
                  <CheckCircle2 size={40} className="text-white mx-auto mb-4" />
                  <p className="font-['Space_Grotesk'] text-[10px] uppercase tracking-widest font-bold mb-2">Hardware Linked</p>
                  <p className="font-['Space_Grotesk'] text-[8px] opacity-40 break-all max-w-[180px] mx-auto">{nfc.hash}</p>
                </div>
              ) : (
                <div className="text-center opacity-30">
                  <Cpu size={40} className="mx-auto mb-4" />
                  <p className="font-['Space_Grotesk'] text-[10px] uppercase tracking-widest font-bold">Awaiting NFC Card</p>
                </div>
              )}
            </section>
          </div>

          <div className="p-1 border-t border-[#f3f3f4]">
            <button
              onClick={handleCommit}
              disabled={loading || !nfc.is_fresh || !adminWallet}
<<<<<<< HEAD
              className="w-full bg-black text-white py-8 font-black uppercase tracking-[0.5em] text-[11px] flex justify-center items-center gap-4 transition-all disabled:opacity-5 active:scale-[0.995]"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <>Commit to Genesis <ShieldCheck size={16} /></>}
=======
              className="w-full rounded-2xl bg-black shadow-md text-white py-8 font-black uppercase tracking-[0.5em] text-[11px] flex justify-center items-center gap-4 transition-all disabled:opacity-5 active:scale-[0.995]"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <>Commit to Chain <ShieldCheck size={16} /></>}
>>>>>>> 8763df4 (pushed the code)
            </button>
          </div>
        </div>
      </main>

      <footer className="py-12 border-t border-[#f3f3f4] bg-white text-center">
        <div className="max-w-6xl mx-auto px-8 flex justify-between items-center font-['Space_Grotesk'] text-[9px] tracking-[0.3em] text-[#777777] uppercase font-bold">
          <span>Ayuda Protocol // 2026</span>
          <span className="hidden sm:inline">The Digital Ledger of Truth</span>
<<<<<<< HEAD
          <span>Status: Admin Active</span>
=======
          <span>Status: Verified</span>
>>>>>>> 8763df4 (pushed the code)
        </div>
      </footer>
    </div>
  );
}
