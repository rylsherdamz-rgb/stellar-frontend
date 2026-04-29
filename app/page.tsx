"use client";

import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import {
  ArrowRight,
  ShieldCheck,
  Smartphone,
  Zap,
  Globe,
  Fingerprint
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f9f9f9] text-[#1a1c1c] font-['Inter'] selection:bg-black selection:text-white">
      <Head>
        <title>AYUDA | Secure Aid Distribution</title>
      </Head>

      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-[#f3f3f4]">
        <div className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
          <div className="font-black text-2xl tracking-tighter uppercase">AYUDA PROTOCOL</div>
          <div className="hidden md:flex gap-10 items-center font-['Space_Grotesk'] text-[10px] tracking-[0.2em] uppercase font-bold text-[#777777]">
            <Link href="/claim" className="hover:text-black transition-colors">Claim Relief</Link>
            <Link href="/admin" className="hover:text-black transition-colors">Admin Portal</Link>
            <span className="px-3 py-1 bg-black text-white text-[8px]">Status: Active</span>
          </div>
        </div>
      </nav>

      <main className="pt-32">
        <section className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
          <header>
            <p className="font-['Space_Grotesk'] text-xs tracking-[0.5em] uppercase text-[#777777] mb-6">The Digital Ledger of Truth</p>
            <h1 className="text-7xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85] mb-8">
              Aid that <br /> reaches <span className="text-zinc-300">you.</span>
            </h1>
            <p className="text-xl text-[#474747] leading-relaxed max-w-lg mb-12">
              We use secure NFC cards and blockchain technology to ensure that every cent of aid goes directly to the person who needs it. No middle-men, no lost funds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/claim" className="bg-black text-white px-10 py-6 font-black uppercase tracking-[0.3em] text-[11px] flex items-center justify-between group">
<<<<<<< HEAD
                <p className="text-white">Claim My Aid</p> <ArrowRight className="ml-4 group-hover:translate-x-2 transition-transform" size={18} />
=======
                <p className="text-white">
                  Claim My Aid
                </p><ArrowRight className="ml-4 group-hover:translate-x-2 transition-transform text-white" size={18} />
>>>>>>> 8763df4 (pushed the code)
              </Link>
              <Link href="/admin" className="bg-white border border-[#eeeeee] text-black px-10 py-6 font-black uppercase tracking-[0.3em] text-[11px] hover:bg-[#f3f3f4] transition-colors">
                Staff Login
              </Link>
            </div>
          </header>

          <div className="relative">
            <div className="aspect-square bg-white shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] p-1 rounded-[0.125rem]">
              <img
                src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop"
                alt="Secure Network"
                className="w-full h-full object-cover opacity-90 grayscale hover:grayscale-0 transition-all duration-1000"
              />
            </div>
            <div className="absolute -bottom-8 -left-8 bg-black text-white p-8 hidden md:block">
              <p className="text-4xl font-black italic">100%</p>
              <p className="font-['Space_Grotesk'] text-[9px] uppercase tracking-widest mt-2 opacity-60">Verified Delivery</p>
            </div>
          </div>
        </section>

        <section className="bg-[#f3f3f4] py-32 mt-20">
          <div className="max-w-7xl mx-auto px-8">
            <div className="mb-20">
              <p className="font-['Space_Grotesk'] text-[10px] tracking-[0.4em] uppercase text-[#777777] mb-4">How it works</p>
              <h2 className="text-5xl font-black tracking-tighter uppercase italic">Simple. Secure. Honest.</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
              <div className="bg-white p-12 space-y-6">
                <Fingerprint size={32} className="text-zinc-300" />
                <h3 className="font-black text-xl uppercase">Identity Card</h3>
                <p className="text-sm text-[#777777] leading-relaxed">
                  Every beneficiary receives a secure tap-to-verify card. This card is your digital key to receiving aid safely.
                </p>
              </div>

              <div className="bg-white p-12 space-y-6">
                <Smartphone size={32} className="text-zinc-300" />
                <h3 className="font-black text-xl uppercase">Fast Tapping</h3>
                <p className="text-sm text-[#777777] leading-relaxed">
                  Just tap your card on an authorized phone. The system checks your identity instantly on the secure ledger.
                </p>
              </div>

              <div className="bg-white p-12 space-y-6">
                <ShieldCheck size={32} className="text-zinc-300" />
                <h3 className="font-black text-xl uppercase">Direct Payment</h3>
                <p className="text-sm text-[#777777] leading-relaxed">
                  Once verified, the funds are sent directly to your digital wallet. No paperwork, no long lines, no waiting.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-32 bg-white text-center">
          <div className="max-w-3xl mx-auto px-8">
            <h2 className="text-6xl font-black tracking-tighter uppercase mb-8">Ready to <span className="text-zinc-300">start?</span></h2>
<<<<<<< HEAD
            <p className="font-['Space_Grotesk'] text-sm tracking-widest uppercase text-[#777777] mb-12">Authorized by Genesis Node Protocol</p>
            <Link href="/claim" className="inline-block bg-black text-white px-16 py-8 font-black uppercase tracking-[0.5em] text-[12px] hover:opacity-90 transition-opacity">
              Connect My Wallet
=======
            <p className="font-['Space_Grotesk'] text-sm tracking-widest uppercase text-[#777777] mb-12">Authorized by Stellar Node Protocol</p>
            <Link href="/claim" className="inline-block bg-black text-white px-16 py-8 font-black uppercase tracking-[0.5em] text-[12px] hover:opacity-90 transition-opacity">
              <p className="text-white">
                Connect My Wallet
              </p>
>>>>>>> 8763df4 (pushed the code)
            </Link>
          </div>
        </section>
      </main>

      <footer className="py-20 border-t border-[#f3f3f4] bg-white">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="font-black text-lg tracking-tighter uppercase">AYUDA</div>
          <div className="flex gap-12 font-['Space_Grotesk'] text-[10px] tracking-[0.3em] text-[#777777] uppercase font-bold">
            <Link href="#" className="hover:text-black transition-colors">Security</Link>
            <Link href="#" className="hover:text-black transition-colors">Transparency</Link>
            <Link href="#" className="hover:text-black transition-colors">Terms</Link>
          </div>
          <div className="font-['Space_Grotesk'] text-[9px] tracking-[0.2em] text-[#777777] uppercase font-bold">
            © 2026 Ayuda Protocol // Philippines
          </div>
        </div>
      </footer>

      <div className="fixed top-0 right-0 w-1/4 h-screen bg-[#f3f3f4]/30 -z-10 pointer-events-none"></div>
    </div>
  );
}
