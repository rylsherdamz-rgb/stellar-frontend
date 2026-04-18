"use client";

import { useEffect, useState } from "react";
import { scanNfc } from "@/lib/nfc";

const BACKEND_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3000/api";

type StatusTone = "neutral" | "success" | "error";

type BackendResponse = {
  status: "success" | "error";
  message: string;
  result?: string | null;
  certificate_hash?: string | null;
};

function toneClass(tone: StatusTone) {
  if (tone === "success") return "status-success";
  if (tone === "error") return "status-error";
  return "status-neutral";
}

export default function StellaroidEarnPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [certificateHash, setCertificateHash] = useState("");
  const [studentAddress, setStudentAddress] = useState("");
  const [studentName, setStudentName] = useState("");
  const [rewardAmount, setRewardAmount] = useState("100");
  const [verifyAddress, setVerifyAddress] = useState("");
  const [verifyHash, setVerifyHash] = useState("");
  const [registerStatus, setRegisterStatus] = useState("Waiting for issuer input.");
  const [registerTone, setRegisterTone] = useState<StatusTone>("neutral");
  const [verifyStatus, setVerifyStatus] = useState("No verification request yet.");
  const [verifyTone, setVerifyTone] = useState<StatusTone>("neutral");
  const [scanStatus, setScanStatus] = useState("Ready to scan on a supported mobile device.");
  const [scanTone, setScanTone] = useState<StatusTone>("neutral");
  const [isRegistering, setIsRegistering] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    const mobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    setIsMobile(mobile);
  }, []);

  useEffect(() => {
    if (isMobile) {
      return;
    }

    const interval = window.setInterval(async () => {
      try {
        const response = await fetch(`${BACKEND_BASE_URL}/latest-scan`);
        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as { nfc_hash?: string | null };
        if (data.nfc_hash) {
          setCertificateHash(data.nfc_hash);
          setScanStatus("Latest scanned certificate hash synced from mobile scanner.");
          setScanTone("success");
        }
      } catch {
        // Ignore polling failures and keep the form usable via manual input.
      }
    }, 2500);

    return () => window.clearInterval(interval);
  }, [isMobile]);

  async function handleScan() {
    setIsScanning(true);
    setScanStatus("Scanning NFC card...");
    setScanTone("neutral");

    try {
      const hash = await scanNfc();
      setCertificateHash(hash);
      setVerifyHash(hash);

      await fetch(`${BACKEND_BASE_URL}/scan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nfc_hash: hash }),
      });

      setScanStatus("Card scanned and certificate hash shared with the backend.");
      setScanTone("success");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to scan NFC tag.";
      setScanStatus(message);
      setScanTone("error");
    } finally {
      setIsScanning(false);
    }
  }

  async function handleRegister() {
    if (!studentAddress || !studentName || !certificateHash) {
      setRegisterStatus("Student wallet, student name, and certificate hash are required.");
      setRegisterTone("error");
      return;
    }

    setIsRegistering(true);
    setRegisterStatus("Registering certificate on Stellar...");
    setRegisterTone("neutral");

    try {
      const response = await fetch(`${BACKEND_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_addr: studentAddress,
          student_name: studentName,
          certificate_hash: certificateHash,
          reward_amount: Number(rewardAmount) || 0,
        }),
      });

      const data = (await response.json()) as BackendResponse;
      setRegisterStatus(data.message);
      setRegisterTone(data.status === "success" ? "success" : "error");
    } catch {
      setRegisterStatus("Registration request failed before reaching the backend.");
      setRegisterTone("error");
    } finally {
      setIsRegistering(false);
    }
  }

  async function handleVerify() {
    const targetAddress = verifyAddress || studentAddress;
    const targetHash = verifyHash || certificateHash;

    if (!targetAddress || !targetHash) {
      setVerifyStatus("Student wallet and certificate hash are required for verification.");
      setVerifyTone("error");
      return;
    }

    setIsVerifying(true);
    setVerifyStatus("Verifying certificate against the contract...");
    setVerifyTone("neutral");

    try {
      const response = await fetch(`${BACKEND_BASE_URL}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_addr: targetAddress,
          certificate_hash: targetHash,
        }),
      });

      const data = (await response.json()) as BackendResponse;
      const resultText = data.result?.trim();
      const verified =
        data.status === "success" &&
        (resultText === "true" ||
          resultText === '"true"' ||
          resultText?.includes("true"));

      setVerifyStatus(
        verified
          ? "Certificate is valid and linked to the submitted wallet."
          : data.status === "success"
            ? "Verification completed, but the contract did not confirm a match."
            : data.message
      );
      setVerifyTone(verified ? "success" : data.status === "success" ? "neutral" : "error");
    } catch {
      setVerifyStatus("Verification request failed before reaching the backend.");
      setVerifyTone("error");
    } finally {
      setIsVerifying(false);
    }
  }

  return (
    <main className="grain-overlay min-h-screen px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section className="ledger-card overflow-hidden rounded-[2rem]">
          <div className="grid gap-0 lg:grid-cols-[1.25fr_0.95fr]">
            <div className="border-b border-[var(--line)] p-6 sm:p-8 lg:border-b-0 lg:border-r lg:p-10">
              <div className="mb-10 flex items-start justify-between gap-4">
                <div>
                  <p className="signal-pill inline-flex min-h-11 items-center rounded-full px-4 text-[0.68rem] font-medium uppercase tracking-[0.22em] text-[var(--muted)]">
                    Southeast Asia credential rail
                  </p>
                  <h1 className="mt-5 max-w-3xl text-4xl leading-none font-semibold tracking-[-0.06em] sm:text-5xl lg:text-6xl">
                    Stellaroid Earn
                  </h1>
                </div>
                <div className="hero-number text-sm uppercase tracking-[0.35em]">SE-01</div>
              </div>

              <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="space-y-5">
                  <p className="max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg">
                    Register student credentials on Soroban, verify them in seconds,
                    and send wallet-based rewards without waiting for manual checks.
                  </p>

                  <div className="grid gap-3 sm:grid-cols-3">
                    {[
                      ["Register", "Issuer binds certificate hash to a student wallet."],
                      ["Verify", "Employer checks the credential against on-chain state."],
                      ["Reward", "Verified students receive a testnet reward flow."],
                    ].map(([title, copy]) => (
                      <div
                        key={title}
                        className="field-shell rounded-[1.4rem] p-4 transition-transform duration-300 hover:-translate-y-1"
                      >
                        <p className="text-[0.68rem] uppercase tracking-[0.2em] text-[var(--muted)]">
                          {title}
                        </p>
                        <p className="mt-3 text-sm leading-6 text-[var(--foreground)]">
                          {copy}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="field-shell rounded-[1.8rem] p-5 sm:p-6">
                  <p className="text-[0.68rem] uppercase tracking-[0.2em] text-[var(--muted)]">
                    Live scan channel
                  </p>
                  <div className="mt-5 rounded-[1.4rem] bg-[var(--panel-strong)] p-5">
                    <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
                      Certificate hash
                    </p>
                    <p className="mt-4 break-all font-mono text-sm leading-6 text-[var(--foreground)]">
                      {certificateHash || "Awaiting NFC scan or manual entry."}
                    </p>
                  </div>

                  <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                    <button
                      onClick={handleScan}
                      disabled={isScanning}
                      className="min-h-12 rounded-full bg-[var(--accent)] px-5 text-sm font-medium text-white transition hover:bg-[var(--accent-strong)] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isScanning ? "Scanning..." : isMobile ? "Scan NFC Card" : "Use Mobile Scanner"}
                    </button>
                    <div className="signal-pill flex min-h-12 items-center rounded-full px-4 text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                      {isMobile ? "Mobile capture mode" : "Desktop sync mode"}
                    </div>
                  </div>

                  <p className={`mt-4 text-sm leading-6 ${toneClass(scanTone)}`}>{scanStatus}</p>
                </div>
              </div>
            </div>

            <div className="bg-[rgba(255,248,235,0.72)] p-6 sm:p-8 lg:p-10">
              <p className="text-[0.68rem] uppercase tracking-[0.2em] text-[var(--muted)]">
                Demo flow
              </p>
              <div className="mt-5 space-y-4">
                {[
                  "Issuer scans or pastes a certificate hash.",
                  "Issuer registers the certificate to a student wallet.",
                  "Backend invokes the Soroban contract.",
                  "Employer verifies the same hash and wallet pair.",
                ].map((step, index) => (
                  <div key={step} className="flex gap-3">
                    <div className="signal-pill flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-mono text-sm">
                      0{index + 1}
                    </div>
                    <p className="pt-2 text-sm leading-6 text-[var(--foreground)]">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <article className="ledger-card rounded-[2rem] p-6 sm:p-8">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[0.68rem] uppercase tracking-[0.2em] text-[var(--muted)]">
                  Issuer console
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-[-0.05em]">
                  Register certificate
                </h2>
              </div>
              <div className="signal-pill rounded-full px-4 py-2 font-mono text-xs uppercase tracking-[0.2em]">
                Soroban write
              </div>
            </div>

            <div className="mt-8 grid gap-4">
              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                  Student wallet
                </span>
                <input
                  value={studentAddress}
                  onChange={(event) => {
                    setStudentAddress(event.target.value);
                    setVerifyAddress(event.target.value);
                  }}
                  className="field-shell min-h-12 w-full rounded-2xl px-4 outline-none transition focus:border-[var(--accent)]"
                  placeholder="G..."
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                  Student name
                </span>
                <input
                  value={studentName}
                  onChange={(event) => setStudentName(event.target.value)}
                  className="field-shell min-h-12 w-full rounded-2xl px-4 outline-none transition focus:border-[var(--accent)]"
                  placeholder="Angela Dela Cruz"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                  Certificate hash
                </span>
                <input
                  value={certificateHash}
                  onChange={(event) => {
                    setCertificateHash(event.target.value);
                    setVerifyHash(event.target.value);
                  }}
                  className="field-shell min-h-12 w-full rounded-2xl px-4 font-mono outline-none transition focus:border-[var(--accent)]"
                  placeholder="cert_hash_demo_001"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                  Reward amount
                </span>
                <input
                  value={rewardAmount}
                  onChange={(event) => setRewardAmount(event.target.value)}
                  className="field-shell min-h-12 w-full rounded-2xl px-4 outline-none transition focus:border-[var(--accent)]"
                  placeholder="100"
                  inputMode="numeric"
                />
              </label>
            </div>

            <button
              onClick={handleRegister}
              disabled={isRegistering}
              className="mt-6 min-h-12 w-full rounded-full bg-[var(--foreground)] px-5 text-sm font-medium text-[var(--background)] transition hover:opacity-88 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isRegistering ? "Registering..." : "Register certificate"}
            </button>

            <p className={`mt-4 text-sm leading-6 ${toneClass(registerTone)}`}>{registerStatus}</p>
          </article>

          <article className="ledger-card rounded-[2rem] p-6 sm:p-8">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[0.68rem] uppercase tracking-[0.2em] text-[var(--muted)]">
                  Employer check
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-[-0.05em]">
                  Verify certificate
                </h2>
              </div>
              <div className="signal-pill rounded-full px-4 py-2 font-mono text-xs uppercase tracking-[0.2em]">
                Soroban read
              </div>
            </div>

            <div className="mt-8 grid gap-4">
              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                  Student wallet
                </span>
                <input
                  value={verifyAddress}
                  onChange={(event) => setVerifyAddress(event.target.value)}
                  className="field-shell min-h-12 w-full rounded-2xl px-4 outline-none transition focus:border-[var(--signal)]"
                  placeholder="G..."
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                  Certificate hash
                </span>
                <input
                  value={verifyHash}
                  onChange={(event) => setVerifyHash(event.target.value)}
                  className="field-shell min-h-12 w-full rounded-2xl px-4 font-mono outline-none transition focus:border-[var(--signal)]"
                  placeholder="cert_hash_demo_001"
                />
              </label>
            </div>

            <button
              onClick={handleVerify}
              disabled={isVerifying}
              className="mt-6 min-h-12 w-full rounded-full bg-[var(--signal)] px-5 text-sm font-medium text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isVerifying ? "Verifying..." : "Verify credential"}
            </button>

            <p className={`mt-4 text-sm leading-6 ${toneClass(verifyTone)}`}>{verifyStatus}</p>
          </article>
        </section>
      </div>
    </main>
  );
}
