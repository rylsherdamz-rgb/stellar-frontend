"use client";
import { useState } from "react";
import { isConnected, getAddress, signTransaction } from "@stellar/freighter-api";
import { toast, Toaster } from "sonner";
import { Fingerprint, CreditCard, CheckCircle } from "lucide-react";

export default function ClaimAyuda() {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const startClaim = async () => {
    try {
      setLoading(true);

      // 1. Check Wallet
      if (!(await isConnected())) throw new Error("Install Freighter");
      const userAddr = await getAddress();

      // 2. Scan NFC Card
      toast.info("Please tap your NFC card to the back of your phone...");
      const ndef = new (window as any).NDEFReader();
      await ndef.scan();

      ndef.onreading = async (event: any) => {
        const serial = event.serialNumber;
        const nfcHash = await hashSerial(serial);

        // 3. Request Signature from Freighter
        // In a real app, you'd fetch the XDR from your backend here
        setStep(2);
        toast.info("Biometric verification required...");

        // This is a placeholder for the actual Soroban XDR invocation
        // const signedTx = await signTransaction(XDR_FROM_BACKEND);

        setStep(3);
        toast.success("Ayuda Claimed Successfully!");
      };

    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <Toaster theme="dark" position="top-center" />
      <div className="w-full max-w-md border border-zinc-800 p-8 space-y-8 bg-zinc-950">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter uppercase">Ayuda Portal</h1>
          <p className="text-zinc-500 text-sm">Tap card & verify biometrics to claim aid.</p>
        </div>

        <div className="py-12 flex justify-center">
          {step === 1 && <CreditCard className="w-20 h-20 text-white animate-pulse" />}
          {step === 2 && <Fingerprint className="w-20 h-20 text-blue-500 animate-bounce" />}
          {step === 3 && <CheckCircle className="w-20 h-20 text-green-500" />}
        </div>

        <button
          onClick={startClaim}
          disabled={loading || step === 3}
          className="w-full py-4 bg-white text-black font-black uppercase hover:bg-zinc-200 transition-colors disabled:opacity-50"
        >
          {loading ? "Processing..." : step === 3 ? "Claimed" : "Initiate Claim"}
        </button>
      </div>
    </div>
  );
}

async function hashSerial(serial: string) {
  const msgUint8 = new TextEncoder().encode(serial);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, "0")).join("");
}
