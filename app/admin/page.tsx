"use client"

import React, { useState, useEffect } from 'react';
import { AyudaAPI } from '@/lib/api';
import { Scan, Lock, Loader2 } from 'lucide-react';

const AdminConsole = () => {
  const [formData, setFormData] = useState({ name: '', address: '', amount: 50 });
  const [nfcHash, setNfcHash] = useState<string | null>(null);
  const [isFresh, setIsFresh] = useState(false);
  const [loading, setLoading] = useState(false);

  // Poll for NFC scans from your phone every 2 seconds
  useEffect(() => {
    const poll = setInterval(async () => {
      try {
        const data = await AyudaAPI.getLatestScan();
        if (data.nfc_hash && data.is_fresh) {
          setNfcHash(data.nfc_hash);
          setIsFresh(true);
        } else {
          setIsFresh(false);
        }
      } catch (e) {
        console.error("Backend unreachable");
      }
    }, 2000);
    return () => clearInterval(poll);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await AyudaAPI.registerCitizen({
      citizen_name: formData.name,
      citizen_addr: formData.address,
      nfc_hash: nfcHash || undefined,
      amount: formData.amount
    });

    if (result.status === 'success') {
      alert("SUCCESS: Identity Committed to Ledger");
      setNfcHash(null); // Clear for next scan
    } else {
      alert(`ERROR: ${result.message}`);
    }
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-12 gap-12 p-12">
      {/* Registration Form */}
      <section className="col-span-7 bg-white p-10 border-l-4 border-black shadow-sm">
        <h3 className="font-[900] text-xl mb-10 uppercase italic">Identity Registration</h3>
        <form onSubmit={handleSubmit} className="space-y-12">
          <div className="relative">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#777777]">Full Name</label>
            <input
              className="w-full border-b border-[#c6c6c6] py-4 focus:outline-none focus:border-black font-bold text-xl"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="relative">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#777777]">Stellar Address</label>
            <input
              className="w-full border-b border-[#c6c6c6] py-4 focus:outline-none focus:border-black font-['Space_Grotesk'] text-sm"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || !isFresh}
            className="w-full bg-black text-white py-6 font-[900] uppercase tracking-[0.3em] text-xs flex justify-center items-center gap-4 disabled:opacity-30"
          >
            {loading ? <Loader2 className="animate-spin" /> : <>Commit to Ledger <Lock size={16} /></>}
          </button>
        </form>
      </section>

      {/* NFC Status Sidebar */}
      <section className="col-span-5">
        <div className={`p-10 border ${isFresh ? 'bg-black text-white' : 'bg-[#eeeeee] text-[#777777]'} transition-all duration-500`}>
          <div className="flex justify-between items-start mb-16">
            <h3 className="font-[900] text-lg uppercase tracking-tighter">NFC Pairing</h3>
            <div className={`px-4 py-1.5 rounded-full flex items-center gap-2 ${isFresh ? 'bg-white text-black' : 'bg-black text-white'}`}>
              <Scan size={12} className={isFresh ? "" : "animate-pulse"} />
              <span className="text-[9px] font-[900] uppercase tracking-widest">
                {isFresh ? "SIGNAL CAPTURED" : "READY TO SCAN"}
              </span>
            </div>
          </div>

          <div className="font-['Space_Grotesk'] text-xs break-all opacity-80 mb-4">
            {nfcHash ? `HASH: ${nfcHash}` : "Awaiting phone signal..."}
          </div>

          <p className="text-[10px] font-bold uppercase tracking-widest leading-loose">
            {isFresh
              ? "Biometric hash verified via mobile node. Ready for ledger commitment."
              : "Scan the beneficiary's physical tag using the Ayuda Mobile Reader."}
          </p>
        </div>
      </section>
    </div>
  );
};
