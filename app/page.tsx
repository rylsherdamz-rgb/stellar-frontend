"use client"

import React, { useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import {
  Terminal,
  Nfc,
  ShieldCheck,
  Wallet,
  ArrowRight,
  History,
  Fingerprint,
  Banknote,
  FileText,
  Lock
} from 'lucide-react'

const Dashboard: NextPage = () => {
  return (
    <>
      <Head>
        <title>AYUDA PROTOCOL | The Digital Ledger of Truth</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="min-h-screen bg-[#f9f9f9] text-[#1a1c1c] antialiased selection:bg-black selection:text-white font-['Inter']">

        <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-[#c6c6c6]/10">
          <div className="flex justify-between items-center px-8 py-5 w-full max-w-screen-2xl mx-auto">
            <div className="font-['Inter'] font-[900] tracking-tighter text-xl uppercase">
              AYUDA PROTOCOL
            </div>
            <div className="hidden md:flex gap-10 items-center">
              <a className="font-['Inter'] tracking-tight text-[11px] uppercase border-b border-black pb-0.5 font-bold" href="#">Network</a>
              <a className="font-['Inter'] tracking-tight text-[11px] uppercase text-[#777777] font-medium hover:text-black transition-colors" href="#">Ledger</a>
              <a className="font-['Inter'] tracking-tight text-[11px] uppercase text-[#777777] font-medium hover:text-black transition-colors" href="#">Distribution</a>
              <a className="font-['Inter'] tracking-tight text-[11px] uppercase text-[#777777] font-medium hover:text-black transition-colors" href="#">Governance</a>
            </div>
            <div className="flex gap-3">
              <button className="bg-black text-[#e2e2e2] font-['Space_Grotesk'] text-[10px] tracking-widest uppercase px-6 py-3 rounded-sm active:scale-95 transition-all">
                Connect Wallet
              </button>
              <button className="hidden lg:block font-['Space_Grotesk'] text-[10px] tracking-widest uppercase border border-[#777777] px-6 py-3 rounded-sm hover:bg-[#eeeeee] transition-colors">
                Terminal
              </button>
            </div>
          </div>
        </nav>

        <main>
          <section className="min-h-screen flex flex-col justify-center px-8 max-w-screen-2xl mx-auto pt-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
              <div className="lg:col-span-7">
                <span className="font-['Space_Grotesk'] text-[10px] tracking-[0.4em] uppercase text-[#777777] mb-8 block">
                  SYSTEM STATUS: ACTIVE
                </span>
                <h1 className="text-[clamp(4rem,10vw,9rem)] font-[900] tracking-tighter leading-[0.8] mb-12 uppercase italic">
                  The <br /> Digital <br /> Ledger of <br />
                  <span className="text-[#dadada] not-italic">Truth.</span>
                </h1>
                <p className="max-w-lg text-lg text-[#474747] font-light mb-12 leading-relaxed">
                  A decentralized framework for global aid distribution. We replace uncertainty with immutable cryptographic evidence, ensuring every cent reaches its intended recipient through NFC-enabled blockchain validation.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button className="bg-black text-[#e2e2e2] px-10 py-5 font-['Space_Grotesk'] font-bold tracking-[0.2em] uppercase text-xs rounded-sm hover:opacity-80 transition-all flex items-center gap-4 group">
                    Launch Admin <Terminal size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button className="border border-[#777777] px-10 py-5 font-['Space_Grotesk'] font-bold tracking-[0.2em] uppercase text-xs rounded-sm hover:bg-[#eeeeee] transition-all flex items-center gap-4 group">
                    Claim Aid <Nfc size={16} className="group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              </div>
              <div className="lg:col-span-5 aspect-square bg-[#f3f3f4] rounded-sm overflow-hidden relative group">
                <img
                  className="w-full h-full object-cover grayscale contrast-125 opacity-90 group-hover:scale-105 transition-transform duration-[2s]"
                  src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=1000"
                  alt="Network mesh"
                />
              </div>
            </div>
          </section>

          <section className="py-40 bg-white">
            <div className="max-w-screen-2xl mx-auto px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-32 items-start">
                <div>
                  <span className="font-['Space_Grotesk'] text-[10px] tracking-widest uppercase text-[#ba1a1a] font-bold mb-6 block">01 / PROBLEM</span>
                  <h2 className="text-[clamp(3rem,5vw,5rem)] font-[900] tracking-tighter uppercase leading-[0.9]">
                    The <br /> Accountability <br /> Crisis
                  </h2>
                </div>
                <div className="pt-4 lg:pt-20">
                  <p className="text-3xl font-light text-[#474747] leading-tight">
                    Traditional aid distribution loses up to 30% of funds to leakage, administrative friction, and lack of last-mile visibility.
                    <span className="text-black font-bold block mt-4">The chain is broken.</span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-0.5 bg-[#eeeeee] border border-[#eeeeee]">
                <div className="bg-white p-16 hover:bg-[#f3f3f4] transition-colors group">
                  <Banknote size={40} strokeWidth={1} className="mb-10 group-hover:translate-y-[-4px] transition-transform" />
                  <h3 className="font-['Space_Grotesk'] font-bold uppercase tracking-[0.2em] text-xs mb-6">Opaque Leakage</h3>
                  <p className="text-sm text-[#474747] leading-relaxed font-light">Funds vanish in layers of intermediaries with zero cryptographic trail or verification.</p>
                </div>
                <div className="bg-white p-16 hover:bg-[#f3f3f4] transition-colors group">
                  <Fingerprint size={40} strokeWidth={1} className="mb-10 group-hover:translate-y-[-4px] transition-transform" />
                  <h3 className="font-['Space_Grotesk'] font-bold uppercase tracking-[0.2em] text-xs mb-6">Identity Fraud</h3>
                  <p className="text-sm text-[#474747] leading-relaxed font-light">Ghost beneficiaries and duplicate identities drain resources intended for those in crisis.</p>
                </div>
                <div className="bg-white p-16 hover:bg-[#f3f3f4] transition-colors group">
                  <History size={40} strokeWidth={1} className="mb-10 group-hover:translate-y-[-4px] transition-transform" />
                  <h3 className="font-['Space_Grotesk'] font-bold uppercase tracking-[0.2em] text-xs mb-6">Manual Reporting</h3>
                  <p className="text-sm text-[#474747] leading-relaxed font-light">Slow, paper-based audit logs that are easily manipulated and impossible to scale.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="py-40">
            <div className="max-w-screen-2xl mx-auto px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
                <div className="relative">
                  <div className="aspect-[4/5] bg-[#eeeeee] overflow-hidden rounded-sm">
                    <img
                      className="w-full h-full object-cover grayscale contrast-125"
                      src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1000"
                      alt="Hardware chip"
                    />
                  </div>
                  <div className="absolute -bottom-10 -right-10 bg-black text-white p-12 shadow-2xl">
                    <div className="font-['Space_Grotesk'] text-6xl font-bold">100%</div>
                    <div className="font-['Space_Grotesk'] text-[10px] tracking-[0.3em] uppercase opacity-50 mt-2">Traceability</div>
                  </div>
                </div>
                <div>
                  <span className="font-['Space_Grotesk'] text-[10px] tracking-widest uppercase text-[#777777] font-bold mb-6 block">02 / SOLUTION</span>
                  <h2 className="text-[clamp(3rem,5vw,5rem)] font-[900] tracking-tighter uppercase mb-10 leading-[0.9]">The Immutable Bridge</h2>
                  <p className="text-xl text-[#474747] mb-12 leading-relaxed font-light">
                    AYUDA Protocol fuses Near-Field Communication (NFC) with Blockchain Ledgers to create a physically-bound digital proof of distribution.
                  </p>
                  <div className="space-y-10">
                    <div className="flex items-start gap-6">
                      <div className="bg-[#eeeeee] p-4">
                        <Lock size={20} strokeWidth={1.5} />
                      </div>
                      <div>
                        <h4 className="font-bold uppercase text-xs tracking-widest mb-2">Biometric-Bound NFC</h4>
                        <p className="text-sm text-[#474747] font-light">Tokens are stored on encrypted hardware tags, tied to unique beneficiary hashes.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-6">
                      <div className="bg-[#eeeeee] p-4">
                        <Wallet size={20} strokeWidth={1.5} />
                      </div>
                      <div>
                        <h4 className="font-bold uppercase text-xs tracking-widest mb-2">On-Chain Custody</h4>
                        <p className="text-sm text-[#474747] font-light">Real-time treasury monitoring. Funds only move when verified by a physical tap event.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="py-40 bg-[#f3f3f4]">
            <div className="max-w-screen-2xl mx-auto px-8">
              <div className="text-center mb-32">
                <span className="font-['Space_Grotesk'] text-[10px] tracking-[0.4em] uppercase text-[#777777] font-bold mb-6 block">03 / PROTOCOL FLOW</span>
                <h2 className="text-[clamp(3rem,6vw,6rem)] font-[900] tracking-tighter uppercase italic">The Triple-Sync</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
                {[
                  { step: '01', title: 'Admin Registration', desc: 'Authority nodes register verified campaigns and distribute encrypted NFC tags to local field agents.' },
                  { step: '02', title: 'Backend Funding', desc: 'Smart contracts escrow the funds. Capital is locked until a valid cryptographic handshake is initiated.' },
                  { step: '03', title: 'NFC Claim Event', desc: 'Beneficiary taps the card. The transaction is validated, recorded on-chain, and aid is instantly disbursed.' }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-black text-white flex items-center justify-center mb-10 rounded-sm font-['Space_Grotesk'] text-xl font-bold shadow-xl shadow-black/10">
                      {item.step}
                    </div>
                    <h3 className="font-[900] uppercase tracking-tighter text-xl mb-6">{item.title}</h3>
                    <p className="text-sm text-[#474747] leading-relaxed font-light px-4">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="py-52 bg-black text-white text-center relative overflow-hidden">
            <div className="relative z-10 px-8">
              <h2 className="text-[clamp(3rem,8vw,8rem)] font-[900] tracking-tighter uppercase leading-[0.85] mb-16">
                Rebuilding Trust <br /> from the <span className="text-[#777777]">Genesis Block.</span>
              </h2>
              <div className="flex flex-wrap justify-center gap-6">
                <button className="bg-white text-black px-12 py-6 font-['Space_Grotesk'] font-[900] tracking-[0.3em] uppercase text-sm hover:opacity-80 transition-all rounded-sm flex items-center gap-4">
                  Deploy Protocol <ArrowRight size={18} />
                </button>
                <button className="border border-white text-white px-12 py-6 font-['Space_Grotesk'] font-[900] tracking-[0.3em] uppercase text-sm hover:bg-white hover:text-black transition-all rounded-sm flex items-center gap-4">
                  Read Whitepaper <FileText size={18} />
                </button>
              </div>
            </div>
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="w-full h-full grid grid-cols-12">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="border-r border-white/20 h-full"></div>
                ))}
              </div>
            </div>
          </section>
        </main>

        <footer className="py-20 px-8 bg-white border-t border-[#eeeeee]">
          <div className="max-w-screen-2xl mx-auto flex flex-col items-center gap-12">
            <div className="font-[900] uppercase tracking-[0.6em] text-sm">
              AYUDA PROTOCOL
            </div>
            <div className="flex flex-wrap justify-center gap-12 font-['Space_Grotesk'] text-[10px] tracking-widest uppercase text-[#777777] font-bold">
              <a className="hover:text-black transition-colors underline decoration-2 underline-offset-4" href="#">Whitepaper</a>
              <a className="hover:text-black transition-colors" href="#">Transparency Report</a>
              <a className="hover:text-black transition-colors" href="#">Security Audit</a>
              <a className="hover:text-black transition-colors" href="#">Terms</a>
            </div>
            <div className="text-center">
              <div className="font-['Space_Grotesk'] text-[10px] tracking-[0.4em] text-[#dadada] uppercase">
                © 2026 AYUDA PROTOCOL. THE DIGITAL LEDGER OF TRUTH.
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}

export default Dashboard
