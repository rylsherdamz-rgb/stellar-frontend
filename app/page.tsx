"use client";

import { useState, useEffect } from 'react';

export default function AyudaRoot() {
  const [nfcHash, setNfcHash] = useState<string | null>(null);
  const [citizenAddr, setCitizenAddr] = useState("");
  const [citizenId, setCitizenId] = useState("");
  const [status, setStatus] = useState("SYSTEM READY");
  const [isMobile, setIsMobile] = useState(false);

  const BACKEND_URL = "https://your-backend.onrender.com";

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));

    const interval = setInterval(async () => {
      if (!isMobile) { // Only poll if we are on the laptop
        try {
          const res = await fetch(`${BACKEND_URL}/latest-scan`);
          const data = await res.json();
          if (data.nfc_hash) setNfcHash(data.nfc_hash);
        } catch (e) { console.error("Sync error"); }
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [isMobile]);

  const startScan = async () => {
    try {
      // @ts-ignore
      const ndef = new NDEFReader();
      await ndef.scan();
      setStatus("SCANNING TAG...");
      ndef.onreading = async ({ serialNumber }: any) => {
        setNfcHash(serialNumber);
        await fetch(`${BACKEND_URL}/scan`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nfc_hash: serialNumber })
        });
        setStatus("HASH TRANSMITTED");
      };
    } catch (e) { setStatus("NFC ERROR: USE CHROME ON ANDROID"); }
  };

  const register = async () => {
    setStatus("INVOKING SMART CONTRACT...");
    const res = await fetch(`${BACKEND_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ citizen_addr: citizenAddr, citizen_id: citizenId })
    });
    const data = await res.json();
    setStatus(data.status === "success" ? "TRANSACTION VERIFIED" : "FAILURE");
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 font-mono">
      {/* Background Ambient Glow */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/5 blur-[120px] rounded-full" />
      </div>

      {/* Main Container */}
      <div className="w-full max-w-lg border border-white/10 bg-white/[0.02] backdrop-blur-md p-8 rounded-2xl shadow-2xl">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-2xl font-bold tracking-tighter">AYUDA / v1.0</h1>
            <p className="text-[10px] text-white/40 uppercase tracking-[0.2em]">Decentralized Identity Protocol</p>
          </div>
          <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
        </div>

        {isMobile ? (
          /* MOBILE VIEW */
          <div className="space-y-6 text-center">
            <div className="py-20 border-2 border-dashed border-white/10 rounded-xl">
              <p className="text-sm text-white/60 mb-8">{status}</p>
              <button
                onClick={startScan}
                className="bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-white/90 transition-all uppercase text-xs tracking-widest"
              >
                Initialize Scanner
              </button>
            </div>
            <p className="text-[10px] text-white/30 italic">Target device: Handheld Sensor</p>
          </div>
        ) : (
          /* LAPTOP VIEW */
          <div className="space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] uppercase text-white/40 tracking-widest">Detected NFC Fingerprint</label>
              <div className="bg-white/[0.05] border border-white/10 p-4 rounded-lg font-mono text-sm">
                {nfcHash || <span className="text-white/20">AWAITING EXTERNAL SENSOR INPUT...</span>}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase text-white/40 tracking-widest">Stellar Address</label>
                <input
                  onChange={(e) => setCitizenAddr(e.target.value)}
                  className="bg-transparent border-b border-white/20 py-2 focus:outline-none focus:border-white transition-colors text-sm"
                  placeholder="G..."
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase text-white/40 tracking-widest">Subject Identity</label>
                <input
                  onChange={(e) => setCitizenId(e.target.value)}
                  className="bg-transparent border-b border-white/20 py-2 focus:outline-none focus:border-white transition-colors text-sm"
                  placeholder="Full Name / Student ID"
                />
              </div>
            </div>

            <button
              disabled={!nfcHash}
              onClick={register}
              className={`w-full py-4 rounded-lg font-bold text-xs tracking-[0.3em] uppercase transition-all
                ${nfcHash ? 'bg-white text-black hover:invert' : 'bg-white/5 text-white/20 cursor-not-allowed'}
              `}
            >
              Authorize Registration
            </button>

            <p className="text-center text-[9px] text-white/20">{status}</p>
          </div>
        )}
      </div>

      <footer className="mt-12 text-[10px] text-white/20 tracking-widest uppercase">
        Stellar Network / Soroban Smart Contract / Richie De Guzman
      </footer>
    </main>
  );
}
