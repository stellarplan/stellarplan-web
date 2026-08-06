'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield, Zap, Lock, ArrowRight, CheckCircle2, Wallet, Layers, CalendarClock, ShieldCheck, KeyRound, Fingerprint, Unlock } from 'lucide-react';
import Logo from '@/components/common/Logo';

export default function LandingPage() {
  return (
    <div className="min-h-screen text-foreground flex flex-col selection:bg-emerald-500 selection:text-black overflow-x-hidden" style={{ background: '#0C0D10' }}>

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-[#2B2C33]" style={{ background: '#0C0D10' }}>
        <div className="max-w-6xl mx-auto px-6 h-18 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl grid place-items-center bg-emerald-500">
              <Logo size={18} className="text-black" />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em', color: '#FAFAFA' }}>
              Stellar<span style={{ color: '#10B981' }}>Plan</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium" style={{ color: '#A1A1AA' }}>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#security" className="hover:text-white transition-colors">Security</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login" className="btn-ghost text-sm px-4 py-2">Sign In</Link>
            <Link href="/signup" className="btn-primary text-sm px-5 py-2.5 rounded-xl">
              Get Started <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative pt-20 pb-32 md:pt-28 md:pb-40 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

            {/* Left Content */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-950/80 border border-emerald-800 text-emerald-400"
              >
                <Zap size={13} /> Powered by Soroban Smart Contracts
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.03em', fontFamily: 'var(--font-display)', color: '#FAFAFA' }}
              >
                Your Money,{' '}
                <br className="hidden sm:inline" />
                <span className="text-emerald-400">Protected Before You Spend It.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-base md:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0"
                style={{ color: '#A1A1AA' }}
              >
                When your salary lands in your Stellar wallet, StellarPlan automatically locks rent, electricity, and emergency savings into non-custodial Soroban vaults — so bill money can never accidentally be spent.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
              >
                <Link href="/login" className="btn-primary w-full sm:w-auto text-base px-8 py-4 rounded-xl">
                  Sign In with Freighter Wallet <ArrowRight size={18} />
                </Link>
                <Link href="/signup" className="btn-ghost w-full sm:w-auto text-base px-6 py-4 rounded-xl font-semibold text-center">
                  Create Account
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs font-medium text-[#A1A1AA]"
              >
                <span className="flex items-center gap-2"><CheckCircle2 size={15} className="text-emerald-400" /> Non-Custodial Vaults</span>
                <span className="flex items-center gap-2"><CheckCircle2 size={15} className="text-emerald-400" /> Instant Salary Detection</span>
                <span className="flex items-center gap-2"><CheckCircle2 size={15} className="text-emerald-400" /> Freighter Wallet Connect</span>
              </motion.div>
            </div>

            {/* Right Card */}
            <div className="lg:col-span-5 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative rounded-3xl p-6 space-y-5 bg-[#141519] border border-[#2B2C33]"
              >
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-[#2B2C33]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl grid place-items-center bg-emerald-950 border border-emerald-800 text-emerald-400">
                      <Wallet size={19} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-[#FAFAFA]">Freighter Wallet</p>
                      <p className="text-xs font-mono text-[#A1A1AA]">G...8F2A</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">Active</span>
                </div>

                {/* Balance */}
                <div className="rounded-2xl p-4 bg-[#1C1D22] border border-[#2B2C33]">
                  <p className="text-xs font-bold uppercase tracking-wider mb-1 text-[#A1A1AA]">Salary Auto-Split Active</p>
                  <p className="text-3xl font-bold font-mono text-[#FAFAFA]">$2,500.00 <span className="text-sm text-[#71717A]">USDC</span></p>
                </div>

                {/* Vaults */}
                <div className="space-y-2.5">
                  {[
                    { emoji: '🏠', name: 'House Rent', amount: '$850.00', color: '#10B981' },
                    { emoji: '⚡', name: 'Electricity', amount: '$150.00', color: '#10B981' },
                    { emoji: '🛡️', name: 'Emergency Vault', amount: '$500.00', color: '#F43F5E' },
                  ].map((v) => (
                    <div key={v.name} className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm bg-[#1C1D22] border border-[#2B2C33]">
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">{v.emoji}</span>
                        <span className="font-semibold text-xs text-[#FAFAFA]">{v.name}</span>
                      </div>
                      <span className="font-mono font-bold text-xs" style={{ color: v.color }}>{v.amount}</span>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-medium bg-rose-950/40 border border-rose-900/60 text-rose-400">
                  <Lock size={13} /> Locked via Soroban smart contract
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 relative bg-[#0C0D10] border-t border-b border-[#2B2C33]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 style={{ fontSize: '2.25rem', fontWeight: 700, letterSpacing: '-0.03em', color: '#FAFAFA', fontFamily: 'var(--font-display)' }}>
              Built for Absolute Financial Discipline
            </h2>
            <p style={{ color: '#A1A1AA', lineHeight: 1.7 }}>
              Traditional budgeting relies on willpower. StellarPlan replaces willpower with automated Soroban smart contract protection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Zap, title: 'Automated Salary Ingestion', desc: 'Horizon API monitors your Stellar account. The millisecond salary arrives, payment allocation triggers automatically — no manual action required.' },
              { icon: Lock, title: 'Soroban Time-Locked Vaults', desc: 'Funds are escrowed directly in Soroban smart contract vaults. They automatically unlock on bill payment day — fully trustless and non-custodial.' },
              { icon: Shield, title: 'Friction-Based Early Release', desc: 'Need emergency money before due date? Authenticate with Freighter wallet to break the smart contract lock.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-2xl p-8 space-y-5 bg-[#141519] border border-[#2B2C33]"
              >
                <div className="w-12 h-12 rounded-2xl grid place-items-center bg-emerald-950 border border-emerald-800 text-emerald-400">
                  <Icon size={22} />
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FAFAFA', fontFamily: 'var(--font-display)' }}>{title}</h3>
                <p style={{ color: '#A1A1AA', fontSize: '0.875rem', lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24 relative bg-[#0C0D10]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-950/80 border border-emerald-800 text-emerald-400">
              How It Works
            </span>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 700, letterSpacing: '-0.03em', color: '#FAFAFA', fontFamily: 'var(--font-display)' }}>
              From Paycheck to Protected in Three Steps
            </h2>
            <p style={{ color: '#A1A1AA', lineHeight: 1.7 }}>
              No manual transfers and no willpower required. StellarPlan watches your wallet and does the splitting the moment your salary arrives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: '01', icon: Wallet, title: 'Your Salary Lands', desc: 'Your employer pays USDC into your Stellar wallet as usual. A Horizon listener detects the incoming deposit within seconds — no bank and no middleman in between.' },
              { step: '02', icon: Layers, title: 'Funds Auto-Split into Vaults', desc: 'Your plan runs instantly: rent, utilities, and savings are locked into individual Soroban vaults on-chain. Only what is genuinely free to spend stays in your wallet.' },
              { step: '03', icon: CalendarClock, title: 'Money Unlocks on Schedule', desc: 'Bill vaults auto-release on their due date so payments are always covered. Savings stay locked until you deliberately break them with a Freighter signature.' },
            ].map(({ step, icon: Icon, title, desc }) => (
              <div key={step} className="relative rounded-2xl p-8 space-y-5 bg-[#141519] border border-[#2B2C33]">
                <span className="absolute top-6 right-6 font-mono text-sm font-bold text-[#3F3F46]">{step}</span>
                <div className="w-12 h-12 rounded-2xl grid place-items-center bg-emerald-950 border border-emerald-800 text-emerald-400">
                  <Icon size={22} />
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FAFAFA', fontFamily: 'var(--font-display)' }}>{title}</h3>
                <p style={{ color: '#A1A1AA', fontSize: '0.875rem', lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECURITY */}
      <section id="security" className="py-24 relative bg-[#0C0D10] border-t border-[#2B2C33]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-950/80 border border-emerald-800 text-emerald-400">
                <Shield size={13} /> Security
              </span>
              <h2 style={{ fontSize: '2.25rem', fontWeight: 700, letterSpacing: '-0.03em', color: '#FAFAFA', fontFamily: 'var(--font-display)' }}>
                Non-Custodial by Design
              </h2>
              <p style={{ color: '#A1A1AA', lineHeight: 1.7 }}>
                StellarPlan is non-custodial from the ground up. Your money is guarded by open Soroban contracts and your own wallet key — never by our servers, and never by trust in us.
              </p>
              <div className="flex items-center gap-3 rounded-xl px-4 py-3 bg-emerald-950/40 border border-emerald-900/60 text-sm text-emerald-300">
                <ShieldCheck size={18} className="shrink-0" /> Every vault can only ever pay funds back to its owner — you.
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: KeyRound, title: 'Non-Custodial Vaults', desc: 'Each vault is a single-owner Soroban contract. StellarPlan can never move, redirect, or withdraw your funds.' },
                { icon: Fingerprint, title: 'Wallet-Only Sign-In', desc: 'No passwords or email to leak. You sign a one-time SEP-53 challenge in Freighter; your keys never leave the extension.' },
                { icon: Lock, title: 'On-Chain Time-Locks', desc: 'Lock rules live in the contract, not a database. Even we cannot release your savings before you choose to.' },
                { icon: Unlock, title: 'Signed Early Exits', desc: 'Breaking a vault early takes a fresh Freighter signature every time — a deliberate, phishing-resistant action.' },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="rounded-2xl p-6 space-y-3 bg-[#141519] border border-[#2B2C33]">
                  <div className="w-10 h-10 rounded-xl grid place-items-center bg-emerald-950 border border-emerald-800 text-emerald-400">
                    <Icon size={19} />
                  </div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FAFAFA', fontFamily: 'var(--font-display)' }}>{title}</h3>
                  <p style={{ color: '#A1A1AA', fontSize: '0.8rem', lineHeight: 1.65 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative bg-[#0C0D10] border-t border-[#2B2C33]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="relative overflow-hidden rounded-3xl p-10 md:p-14 text-center bg-[#141519] border border-emerald-900">
            <div className="relative z-10 space-y-6">
              <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 700, letterSpacing: '-0.03em', color: '#FAFAFA', fontFamily: 'var(--font-display)', lineHeight: 1.15 }}>
                Stop rationing your paycheck by willpower.
              </h2>
              <p className="max-w-xl mx-auto" style={{ color: '#A1A1AA', lineHeight: 1.7 }}>
                Connect your Freighter wallet and let StellarPlan protect rent, bills, and savings automatically — the moment you get paid.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <Link href="/login" className="btn-primary w-full sm:w-auto text-base px-8 py-4 rounded-xl">
                  Sign In with Freighter <ArrowRight size={18} />
                </Link>
                <Link href="/signup" className="btn-ghost w-full sm:w-auto text-base px-6 py-4 rounded-xl font-semibold text-center">
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-auto py-10 border-t border-[#2B2C33] bg-[#0C0D10]">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-[#71717A]">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg grid place-items-center bg-emerald-500 text-black">
              <Logo size={13} className="text-black" />
            </div>
            <span className="font-bold text-[#FAFAFA]">StellarPlan</span>
            <span>—</span>
            <span>Smart Contract Salary Protection</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="https://stellar.org" target="_blank" rel="noreferrer" className="hover:text-white">Stellar Network</a>
            <a href="https://soroban.stellar.org" target="_blank" rel="noreferrer" className="hover:text-white">Soroban</a>
            <Link href="/login" className="hover:text-white">Login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
