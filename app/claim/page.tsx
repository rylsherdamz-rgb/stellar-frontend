"use client";

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { AyudaBridge } from '@/lib/api';
import { toast, Toaster } from 'sonner';
import {
  Fingerprint,
  Loader2,
  Wallet,
  ShieldCheck,
  ArrowRight,
  Lock
} from 'lucide-react';

export default function ClaimPage() {
  const [userWallet, setUserWallet] = useState<string>("");
  const [nfc, setNfc] = useState({ hash: null, is_fresh: false });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const interval = setInterval(async () => {
      const data = await AyudaBridge.getLatestScan();
      if (data.is_fresh && !nfc.is_fresh) {
        toast.success("Card Identity Verified", {
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
      if (addr) {
        setUserWallet(addr);
        toast.success("Wallet Linked to Session");
      }
    } catch (err: any) {
      toast.error(err.message || "Freighter Link Failed");
    }
  };

  const handleClaim = async () => {
    if (!userWallet) return toast.error("Connect wallet first");
    if (!nfc.is_fresh) return toast.error("Tap your NFC card");

    setLoading(true);
    try {
      // 1. Trigger the bridge claim logic
      // This fetches XDR from backend and opens the Freighter Pop-up
      const signedXdr = await AyudaBridge.claim(userWallet);

      if (signedXdr) {
        toast.success("Transaction Signed & Disbursed!");
        // Optional: Reset NFC state after successful claim
        setNfc({ hash: null, is_fresh: false });
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Claim Failed: Verification Mismatch");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9] text-[#1a1c1c] font-['Inter'] selection:bg-black selection:text-white">
      <Toaster position="bottom-right" />
      <Head>
        <title>AYUDA | Claim Relief</title>
      </Head>

      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-[#f3f3f4]">
        <div className="max-w-6xl mx-auto px-8 py-6 flex justify-between items-center">
          <h1 className="font-black text-2xl tracking-tighter uppercase text-black">AYUDA PROTOCOL</h1>
          <span className="font-['Space_Grotesk'] text-[10px] tracking-[0.3em] text-[#777777] uppercase font-bold">
            Verified Gateway V1.0.4
          </span>
        </div>
      </nav>

      <main className="pt-40 pb-24 px-6 max-w-xl mx-auto flex flex-col justify-center min-h-[90vh]">
        <header className="mb-12">
          <p className="font-['Space_Grotesk'] text-[10px] tracking-[0.4em] uppercase text-[#777777] mb-4">Protocol Interface // Claim_Funds</p>
          <h2 className="text-6xl md:text-7xl font-black tracking-tighter uppercase leading-[0.85] mb-8">
            Claim Your <br /> <span className="text-zinc-300">Ayuda.</span>
          </h2>
          <div className="bg-white p-10 border-l-4 border-black shadow-[0_24px_48px_rgba(26,28,28,0.06)]">
            <p className="text-xl font-medium tracking-tight leading-snug">
              Authenticate your hardware and sign the transaction with your wallet to authorize the disbursement.
            </p>
          </div>
        </header>

        <section className="space-y-6">
          {/* Step 1: Hardware Verification */}
          <div className={`flex items-center gap-6 p-8 transition-colors duration-500 ${nfc.is_fresh ? "bg-black text-white" : "bg-[#f3f3f4]"}`}>
            <div className={`w-14 h-14 flex items-center justify-center rounded-[0.125rem] ${nfc.is_fresh ? "bg-white text-black" : "bg-black text-white"}`}>
              {nfc.is_fresh ? <ShieldCheck size={28} /> : <Fingerprint size={28} />}
            </div>
            <div>
              <p className={`font-['Space_Grotesk'] text-[9px] tracking-widest uppercase font-bold mb-1 ${nfc.is_fresh ? "text-zinc-400" : "text-[#777777]"}`}>Hardware Status</p>
              <p className="font-bold text-lg tracking-tight uppercase">
                {nfc.is_fresh ? "NFC Identity Verified" : "Awaiting Card Contact..."}
              </p>
            </div>
          </div>

          {/* Step 2: Wallet Authentication */}
          <div className="bg-white border border-[#eeeeee] p-1">
            {!userWallet ? (
              <button
                onClick={handleConnect}
                className="w-full flex items-center justify-between p-8 group hover:bg-[#fcfcfc] transition-colors"
              >
                <div className="text-left">
                  <p className="font-['Space_Grotesk'] text-[9px] tracking-widest uppercase font-bold text-[#777777] mb-1">Authorization Required</p>
                  <p className="font-bold text-lg tracking-tight uppercase">Connect Freighter Wallet</p>
                </div>
                <div className="p-3 bg-black text-white group-hover:scale-110 transition-transform">
                  <Wallet size={20} />
                </div>
              </button>
            ) : (
              <div className="w-full flex items-center justify-between p-8 bg-[#fcfcfc]">
                <div className="text-left overflow-hidden">
                  <p className="font-['Space_Grotesk'] text-[9px] tracking-widest uppercase font-bold text-emerald-600 mb-1">Identity Linked</p>
                  <p className="font-['Space_Grotesk'] text-sm font-bold tracking-tighter truncate opacity-60">
                    {userWallet}
                  </p>
                </div>
                <div className="p-3 text-emerald-600">
                  <Lock size={20} />
                </div>
              </div>
            )}
          </div>

          {/* Step 3: Execution */}
          <button
            onClick={handleClaim}
            disabled={loading || !nfc.is_fresh || !userWallet}
            className="w-full bg-black text-white py-8 px-10 font-black uppercase tracking-[0.5em] text-[11px] flex justify-between items-center transition-all disabled:opacity-5 active:scale-[0.99]"
          >
            {loading ? (
              <Loader2 className="animate-spin mx-auto" size={20} />
            ) : (
              <>
                Sign & Claim Funds
                <ArrowRight size={20} />
              </>
            )}
          </button>

          <div className="grid grid-cols-2 gap-1 mt-6">
            <div className="bg-[#eeeeee] p-6">
              <p className="font-['Space_Grotesk'] text-[9px] tracking-widest uppercase text-[#777777] mb-4">Network State</p>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-black rounded-full animate-pulse"></span>
                <span className="font-bold text-[10px] uppercase tracking-tighter">Soroban VM Ready</span>
              </div>
            </div>
            <div className="bg-white border border-[#eeeeee] p-6">
              <p className="font-['Space_Grotesk'] text-[9px] tracking-widest uppercase text-[#777777] mb-4">Ledger Record</p>
              <p className="font-['Space_Grotesk'] text-[10px] font-bold uppercase truncate opacity-30">
                {nfc.hash ? `NFC: ${nfc.hash.slice(0, 12)}...` : "Awaiting Auth"}
              </p>
            </div>
          </div>
        </section>

        <footer className="mt-20 pt-12 border-t border-[#f3f3f4] flex flex-col items-center gap-8">
          <div className="flex gap-8 font-['Space_Grotesk'] text-[9px] tracking-[0.3em] text-[#777777] uppercase font-bold">
            <span>Whitepaper</span>
            <span>Security Audit</span>
            <span>Terms</span>
          </div>
          <div className="text-center space-y-1">
            <p className="font-black text-[10px] tracking-[0.2em] uppercase">© 2026 AYUDA PROTOCOL</p>
            <p className="font-['Space_Grotesk'] text-[9px] tracking-[0.4em] text-zinc-300 uppercase">The Digital Ledger of Truth</p>
          </div>
        </footer>
      </main>

      <div className="fixed top-0 right-0 w-1/3 h-screen bg-[#f3f3f4]/50 -z-10 pointer-events-none"></div>
    </div>
  );
}
