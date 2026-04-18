import Link from "next/link";

const stats = [
  {
    label: "Credential rails",
    value: "Soroban + Stellar",
    note: "Registration, verification, and reward flow share one contract surface.",
  },
  {
    label: "Primary region",
    value: "SEA",
    note: "Designed for graduates in the Philippines, Vietnam, and Indonesia.",
  },
  {
    label: "Demo cycle",
    value: "< 2 min",
    note: "Scan, register, verify, and show the reward path in a single walkthrough.",
  },
];

export default function StatsPage() {
  return (
    <main className="min-h-screen px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-5xl rounded-[2rem] border border-[var(--line)] bg-[var(--panel)] p-6 shadow-[var(--shadow)] sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
              Public snapshot
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em]">
              Submission summary
            </h1>
          </div>
          <Link
            href="/"
            className="rounded-full border border-[var(--line)] px-4 py-2 text-sm text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)]"
          >
            Back to dashboard
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {stats.map((item) => (
            <article key={item.label} className="field-shell rounded-[1.5rem] p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                {item.label}
              </p>
              <p className="mt-4 text-3xl font-semibold tracking-[-0.05em]">
                {item.value}
              </p>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{item.note}</p>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
