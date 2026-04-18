"use client";

import Link from "next/link";
import { useState } from "react";
import { scanNfc } from "@/lib/nfc";

const BACKEND_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3000/api";

export default function ClaimPage() {
  const [studentAddress, setStudentAddress] = useState("");
  const [certificateHash, setCertificateHash] = useState("");
  const [status, setStatus] = useState("Ready to verify a student's credential.");
  const [isLoading, setIsLoading] = useState(false);

  async function handleScan() {
    setStatus("Scanning NFC card...");

    try {
      const hash = await scanNfc();
      setCertificateHash(hash);
      setStatus("Certificate hash captured from NFC card.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to scan NFC card.");
    }
  }

  async function handleVerify() {
    if (!studentAddress || !certificateHash) {
      setStatus("Student wallet and certificate hash are required.");
      return;
    }

    setIsLoading(true);
    setStatus("Verifying credential on Soroban...");

    try {
      const response = await fetch(`${BACKEND_BASE_URL}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_addr: studentAddress,
          certificate_hash: certificateHash,
        }),
      });

      const data = (await response.json()) as {
        status: string;
        message: string;
        result?: string | null;
      };

      if (data.status === "success" && data.result?.includes("true")) {
        setStatus("Credential verified. Wallet and certificate hash match.");
      } else {
        setStatus(data.message || "Verification did not confirm a match.");
      }
    } catch {
      setStatus("Backend request failed.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-[var(--line)] bg-[var(--panel)] p-6 shadow-[var(--shadow)] sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
              Employer check
            </p>
            <h1 className="mt-2 text-4xl font-semibold tracking-[-0.05em]">
              Claim and verify
            </h1>
          </div>
          <Link
            href="/"
            className="rounded-full border border-[var(--line)] px-4 py-2 text-sm text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)]"
          >
            Back to dashboard
          </Link>
        </div>

        <div className="mt-8 grid gap-4">
          <input
            value={studentAddress}
            onChange={(event) => setStudentAddress(event.target.value)}
            placeholder="Student wallet"
            className="field-shell min-h-12 rounded-2xl px-4 outline-none"
          />
          <input
            value={certificateHash}
            onChange={(event) => setCertificateHash(event.target.value)}
            placeholder="Certificate hash"
            className="field-shell min-h-12 rounded-2xl px-4 font-mono outline-none"
          />
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={handleScan}
            className="min-h-12 flex-1 rounded-full bg-[var(--accent)] px-5 text-sm font-medium text-white transition hover:bg-[var(--accent-strong)]"
          >
            Scan certificate
          </button>
          <button
            onClick={handleVerify}
            disabled={isLoading}
            className="min-h-12 flex-1 rounded-full bg-[var(--foreground)] px-5 text-sm font-medium text-[var(--background)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Verifying..." : "Verify credential"}
          </button>
        </div>

        <p className="mt-5 text-sm leading-6 text-[var(--muted)]">{status}</p>
      </div>
    </main>
  );
}
