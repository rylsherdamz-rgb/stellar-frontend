"use client";

import Link from "next/link";

export default function RegisterPage() {
  return (
    <main className="min-h-screen px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-4xl rounded-[2rem] border border-[var(--line)] bg-[var(--panel)] p-6 shadow-[var(--shadow)] sm:p-8">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
          Registration guide
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em]">
          What the issuer needs before submitting
        </h1>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            ["Student wallet", "The destination Stellar address that owns the credential."],
            ["Student name", "A readable identity label stored with the certificate record."],
            ["Certificate hash", "A unique hash captured by NFC scan or manual input."],
          ].map(([title, copy]) => (
            <div key={title} className="field-shell rounded-[1.5rem] p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">{title}</p>
              <p className="mt-3 text-sm leading-6 text-[var(--foreground)]">{copy}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-[1.5rem] border border-[var(--line)] bg-[var(--panel-strong)] p-5">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
            Backend payload
          </p>
          <pre className="mt-4 overflow-x-auto text-sm leading-6 text-[var(--foreground)]">
{`{
  "student_addr": "G...",
  "student_name": "Angela Dela Cruz",
  "certificate_hash": "cert_hash_demo_001",
  "reward_amount": 100
}`}
          </pre>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/"
            className="rounded-full bg-[var(--foreground)] px-5 py-3 text-sm font-medium text-[var(--background)] transition hover:opacity-90"
          >
            Open dashboard
          </Link>
          <Link
            href="/admin"
            className="rounded-full border border-[var(--line)] px-5 py-3 text-sm text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)]"
          >
            Go to issuer console
          </Link>
        </div>
      </div>
    </main>
  );
}
