"use client";

import { FormEvent, useState } from "react";
import { scanNfc } from "@/lib/nfc";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "https://ayuda-backend.onrender.com";

const initialForm = {
  citizenId: "",
  citizenAddr: "",
  nfcHash: "",
};

export default function RegisterPage() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("Ready to register a citizen.");
  const [isScanning, setIsScanning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = Boolean(
    form.citizenId.trim() && form.citizenAddr.trim() && form.nfcHash.trim()
  );

  async function handleScan() {
    setIsScanning(true);
    setStatus("Waiting for an NFC card...");

    try {
      const hash = await scanNfc();
      setForm((current) => ({ ...current, nfcHash: hash }));
      setStatus("NFC hash captured. Review the details and submit.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to read the NFC card.";
      setStatus(message);
    } finally {
      setIsScanning(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit) {
      setStatus("Citizen ID, wallet address, and NFC hash are required.");
      return;
    }

    setIsSubmitting(true);
    setStatus("Submitting registration to the backend...");

    try {
      const response = await fetch(`${BACKEND_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          citizen_addr: form.citizenAddr.trim(),
          citizen_id: form.citizenId.trim(),
          nfc_hash: form.nfcHash.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || data.status !== "success") {
        throw new Error(data.message || "Registration failed.");
      }

      setStatus("Citizen registered successfully on Stellar.");
      setForm(initialForm);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to connect to backend.";
      setStatus(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#183042_0%,#0a1017_48%,#040608_100%)] px-4 py-8 text-stone-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 lg:flex-row">
        <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/6 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur md:p-8 lg:min-h-[44rem] lg:w-[24rem]">
          <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />
          <div className="flex h-full flex-col justify-between gap-10">
            <div className="space-y-8">
              <div className="space-y-4">
                <span className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.32em] text-cyan-100">
                  Ayuda Registrar
                </span>
                <div className="space-y-3">
                  <h1 className="max-w-sm font-serif text-4xl leading-none text-white sm:text-5xl">
                    Register a citizen with the fields the backend actually expects.
                  </h1>
                  <p className="max-w-md text-sm leading-6 text-stone-300">
                    The backend only accepts a single `POST /register` request with
                    wallet address, citizen ID, and NFC hash. This screen captures
                    all three in one place.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 text-sm text-stone-200">
                <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
                  <p className="text-[0.65rem] uppercase tracking-[0.28em] text-stone-400">
                    Backend endpoint
                  </p>
                  <p className="mt-2 break-all font-mono text-xs text-cyan-100">
                    {BACKEND_URL}/register
                  </p>
                </div>

                <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
                  <p className="text-[0.65rem] uppercase tracking-[0.28em] text-stone-400">
                    Required payload
                  </p>
                  <p className="mt-2 font-mono text-xs leading-6 text-stone-200">
                    citizen_addr
                    <br />
                    citizen_id
                    <br />
                    nfc_hash
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-300/15 bg-emerald-300/10 p-4">
              <p className="text-[0.65rem] uppercase tracking-[0.28em] text-emerald-100/70">
                Status
              </p>
              <p className="mt-2 text-sm leading-6 text-emerald-50">{status}</p>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-[#f5efe2] p-5 text-slate-950 shadow-[0_24px_80px_rgba(0,0,0,0.25)] sm:p-6 md:p-8 lg:flex-1">
          <form className="flex h-full flex-col gap-6" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_18rem]">
              <div className="space-y-2">
                <label
                  className="text-[0.7rem] font-semibold uppercase tracking-[0.26em] text-slate-500"
                  htmlFor="citizen-id"
                >
                  Citizen Name or ID
                </label>
                <input
                  id="citizen-id"
                  required
                  value={form.citizenId}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      citizenId: event.target.value,
                    }))
                  }
                  placeholder="Richie De Guzman"
                  className="min-h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-700 focus:ring-2 focus:ring-cyan-700/20"
                />
              </div>

              <div className="rounded-[1.5rem] border border-slate-300 bg-white/70 p-4">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.26em] text-slate-500">
                  Submission state
                </p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.18em]">
                  <span className="rounded-full bg-slate-900 px-3 py-2 text-white">
                    {isSubmitting ? "Submitting" : "Idle"}
                  </span>
                  <span className="rounded-full bg-cyan-100 px-3 py-2 text-cyan-900">
                    {isScanning ? "Scanning NFC" : form.nfcHash ? "NFC Ready" : "Awaiting NFC"}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label
                className="text-[0.7rem] font-semibold uppercase tracking-[0.26em] text-slate-500"
                htmlFor="citizen-addr"
              >
                Stellar Wallet Address
              </label>
              <input
                id="citizen-addr"
                required
                value={form.citizenAddr}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    citizenAddr: event.target.value,
                  }))
                }
                placeholder="G..."
                className="min-h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 font-mono text-sm outline-none transition focus:border-cyan-700 focus:ring-2 focus:ring-cyan-700/20"
              />
            </div>

            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_15rem]">
              <div className="space-y-2">
                <label
                  className="text-[0.7rem] font-semibold uppercase tracking-[0.26em] text-slate-500"
                  htmlFor="nfc-hash"
                >
                  NFC Hash
                </label>
                <textarea
                  id="nfc-hash"
                  required
                  value={form.nfcHash}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      nfcHash: event.target.value,
                    }))
                  }
                  placeholder="Scan a card on a supported device, or paste the hashed NFC value."
                  className="min-h-36 w-full rounded-[1.5rem] border border-slate-300 bg-white px-4 py-3 font-mono text-sm outline-none transition focus:border-cyan-700 focus:ring-2 focus:ring-cyan-700/20"
                />
              </div>

              <div className="flex flex-col justify-between rounded-[1.5rem] border border-slate-300 bg-slate-950 p-5 text-stone-100">
                <div className="space-y-3">
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.26em] text-cyan-200/80">
                    NFC capture
                  </p>
                  <h2 className="font-serif text-2xl leading-tight text-white">
                    Scan locally when Web NFC is available.
                  </h2>
                  <p className="text-sm leading-6 text-stone-300">
                    Desktop browsers without NFC support can still complete the
                    form by pasting the hash manually.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleScan}
                  disabled={isScanning || isSubmitting}
                  className="mt-6 min-h-12 rounded-full bg-cyan-300 px-5 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:bg-cyan-100"
                >
                  {isScanning ? "Scanning..." : "Scan NFC Card"}
                </button>
              </div>
            </div>

            <div className="grid gap-4 border-t border-slate-300 pt-5 md:grid-cols-[minmax(0,1fr)_15rem] md:items-center">
              <p className="text-sm leading-6 text-slate-600">
                Submit only after all three values are present. The request goes
                straight to the Rust backend and invokes the Stellar contract.
              </p>

              <button
                type="submit"
                disabled={!canSubmit || isSubmitting}
                className="min-h-12 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold uppercase tracking-[0.24em] text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {isSubmitting ? "Registering..." : "Register Citizen"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
