"use client";
import { Activity, Users, Landmark } from "lucide-react";

export default function TransparencyStats() {
  // In a real app, you would fetch these from your Axum backend
  const stats = [
    { label: "Total Aid Distributed", value: "₱ 2,500,000", icon: <Landmark /> },
    { label: "Verified Citizens", value: "1,240", icon: <Users /> },
    { label: "Network Up-time", value: "99.9%", icon: <Activity /> },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 text-black p-12">
      <div className="max-w-6xl mx-auto space-y-12">
        <h2 className="text-6xl font-black uppercase italic tracking-widest">Public Ledger</h2>

        <div className="grid md:grid-cols-3 gap-8">
          {stats.map((s, i) => (
            <div key={i} className="border-l-8 border-black bg-white p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <div className="mb-4">{s.icon}</div>
              <p className="text-sm uppercase font-bold text-zinc-500">{s.label}</p>
              <p className="text-4xl font-black">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="border-2 border-black bg-white">
          <div className="bg-black text-white p-2 text-xs font-bold uppercase px-4">Recent Claims (On-Chain)</div>
          <table className="w-full text-left">
            <thead className="border-b-2 border-black font-bold">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Citizen Address</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {[1, 2, 3].map((r) => (
                <tr key={r} className="text-sm">
                  <td className="p-4 font-mono">2026-04-18 11:20</td>
                  <td className="p-4 font-mono text-zinc-500">GD7X...9Y2P</td>
                  <td className="p-4 text-green-600 font-bold uppercase">Verified & Paid</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
