"use client";
import React, { useState, useEffect } from 'react';
import { AyudaAPI } from '@/lib/api';
import { Scan, ArrowRight, ShieldCheck, Loader2, Landmark } from 'lucide-react';

export default function ClaimPage() {
  const [claimStatus, setClaimStatus] = useState<'idle' | 'scanning' | 'verifying' | 'success' | 'error'>('idle');
  const [aidData, setAidData] = useState<{ amount: number; hash: string } | null>(null);

  // Poll for the phone's NFC scan signal
  useEffect(() => {
    const poll = setInterval(async () => {
      if (claimStatus !== 'idle') return;
      try {
        const data = await AyudaAPI.getLatestScan();
        if (data.nfc_hash && data.is_fresh) {
          setClaimStatus('verifying');
          handleClaim(data.nfc_hash);
        }
      } catch (e) {
        console.error("Signal Lost");
      }
    }, 2000);
    return () => clearInterval(poll);
  }, [claimStatus]);

  const handleClaim = async (hash: string) => {
    // In a real scenario, we'd use the user's wallet address from their session/auth
    // For this bridge, we assume the NFC hash maps to their identity on-chain
    try {
      const result = await AyudaAPI.claimAid(hash);
      if (result.status === 'success') {
        setAidData({ amount: result.amount, hash: result.tx_hash });
        setClaimStatus('success');
      } else {
        setClaimStatus('error');
      }
    } catch (err) {
      setClaimStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-white text-black font-['Inter'] selection:bg-black selection:text-white">
      <main className="max-w-screen-2xl mx-auto min-h-screen grid grid-cols-1 lg:grid-cols-2">

        {/* Visual Narrative Side */}
        <section className="bg-[#000000] text-white p-12 md:p-24 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-16">
              <div className="w-8 h-8 bg-white" />
              <h1 className="font-[900] uppercase italic tracking-tighter text-xl">Ayuda Protocol</h1>
            </div>
            <h2 className="text-6xl md:text-8xl font-[900] uppercase italic tracking-tighter leading-[0.85] mb-8">
              Claim<br />Your<br />Freedom.
            </h2>
            <p className="font-['Space_Grotesk'] text-[10px] tracking-[0.4em] uppercase opacity-50 max-w-xs leading-loose">
              Direct-to-beneficiary aid distribution secured by the Stellar Network. No middlemen. No delays.
            </p>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex -space-x-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-12 h-12 rounded-none border-2 border-black bg-[#1a1c1c] flex items-center justify-center font-bold text-xs">
                  0{i}
                </div>
              ))}
            </div>
            <p className="text-[9px] font-bold uppercase tracking-widest opacity-40">Verification Nodes Active</p>
          </div>
        </section>

        {/* Interaction Side */}
        <section className="p-12 md:p-24 flex flex-col justify-center bg-[#f9f9f9]">
          <div className="max-w-md mx-auto w-full">
            {claimStatus === 'idle' && (
              <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <div className="w-20 h-20 bg-black flex items-center justify-center">
                  <Scan className="text-white w-10 h-10 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-3xl font-[900] uppercase italic tracking-tighter mb-4">Awaiting Handshake</h3>
                  <p className="text-sm font-medium text-neutral-500 leading-relaxed">
                    Tap your Ayuda NFC Tag against your mobile device to initiate the ledger claim.
                  </p>
                </div>
                <div className="pt-12 border-t border-black/5">
                  <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Listening for hardware signal...
                  </div>
                </div>
              </div>
            )}

            {claimStatus === 'verifying' && (
              <div className="text-center space-y-8">
                <Loader2 className="w-16 h-16 animate-spin mx-auto text-black" />
                <h3 className="text-xl font-bold uppercase tracking-widest italic">Decrypting Ledger...</h3>
              </div>
            )}

            {claimStatus === 'success' && (
              <div className="space-y-10 animate-in zoom-in-95 duration-500">
                <div className="w-20 h-20 bg-black text-white flex items-center justify-center">
                  <ShieldCheck className="w-10 h-10" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400 mb-2">Transaction Confirmed</p>
                  <h3 className="text-5xl font-[900] uppercase italic tracking-tighter mb-6">
                    {aidData?.amount} <span className="text-2xl not-italic font-light">XLM</span>
                  </h3>
                  <div className="p-6 bg-white border-l-4 border-black space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-bold uppercase text-neutral-400">Status</span>
                      <span className="text-[9px] font-bold uppercase">Finalized</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-bold uppercase text-neutral-400">Hash</span>
                      <span className="text-[9px] font-['Space_Grotesk'] font-bold truncate ml-8">
                        {aidData?.hash || '7f3e...a21b'}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => window.location.reload()}
                  className="group flex items-center gap-4 text-[10px] font-[900] uppercase tracking-[0.4em] pt-8"
                >
                  Return to Terminal <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
