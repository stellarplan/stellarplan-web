'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield, Zap, Lock, ArrowRight, CheckCircle2, Wallet, Star, Globe2, Cpu } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen text-foreground flex flex-col selection:bg-stellar selection:text-white overflow-x-hidden" style={{ background: 'rgb(8,11,18)' }}>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ NAVBAR */}
      <header className="sticky top-0 z-50 border-b" style={{ borderColor: 'rgba(30,45,69,0.6)', backdropFilter: 'blur(20px)', background: 'rgba(8,11,18,0.85)' }}>
        <div className="max-w-6xl mx-auto px-6 h-18 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-9 h-9 rounded-xl grid place-items-center" style={{ background: 'linear-gradient(135deg, #3B82F6, #7C3AED)', boxShadow: '0 0 20px rgba(59,130,246,0.4)' }}>
              <Star size={18} className="text-white fill-white" />
              <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'rgba(255,255,255,0.1)' }} />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'hsl(228,60%,93%)' }}>
              Stellar<span style={{ color: 'hsl(217,91%,60%)' }}>Plan</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium" style={{ color: 'hsl(222,22%,55%)' }}>
            <a href="#features" className="hover:text-foreground transition-colors" style={{ transition: 'color 0.2s' }}>Features</a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
            <a href="#security" className="hover:text-foreground transition-colors">Security</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login" className="btn-ghost text-sm px-4 py-2">Sign In</Link>
            <Link href="/signup" className="btn-primary text-sm px-5 py-2.5 rounded-xl">
              Get Started <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </header>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ HERO */}
      <section className="relative pt-20 pb-32 md:pt-28 md:pb-40 overflow-hidden">
        {/* Star field */}
        <div className="star-field" />

        {/* Aurora orbs */}
        <div className="aurora-orb w-[700px] h-[700px] top-[-200px] left-1/2 -translate-x-1/2" style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)' }} />
        <div className="aurora-orb w-[500px] h-[500px] bottom-[-100px] right-[-100px]" style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.10) 0%, transparent 70%)' }} />
        <div className="aurora-orb w-[400px] h-[400px] top-1/2 left-[-100px]" style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.07) 0%, transparent 70%)' }} />

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

            {/* Left Content */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider"
                style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)', color: 'hsl(217,91%,60%)' }}
              >
                <Zap size={13} /> Powered by Soroban Smart Contracts
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.03em', fontFamily: 'var(--font-display)' }}
              >
                Your Money,{' '}
                <br className="hidden sm:inline" />
                <span className="shimmer-text">Protected Before You Spend It.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-base md:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0"
                style={{ color: 'hsl(222,22%,60%)' }}
              >
                When your salary lands in your Stellar wallet, StellarPlan automatically locks rent, electricity, and emergency savings into non-custodial Soroban vaults — so bill money can never accidentally be spent.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
              >
                <Link href="/signup" className="btn-primary w-full sm:w-auto text-base px-8 py-4 rounded-xl shadow-2xl">
                  Create Protected Vault <ArrowRight size={18} />
                </Link>
                <Link href="/login" className="w-full sm:w-auto text-base px-6 py-4 rounded-xl font-semibold text-center transition-all duration-200 hover:text-foreground" style={{ background: 'rgba(30,45,69,0.5)', border: '1px solid rgba(30,45,69,0.9)', color: 'hsl(222,22%,60%)' }}>
                  Sign In to Dashboard
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs font-medium"
                style={{ color: 'hsl(222,22%,55%)' }}
              >
                <span className="flex items-center gap-2"><CheckCircle2 size={15} style={{ color: 'hsl(189,95%,43%)' }} /> Non-Custodial Vaults</span>
                <span className="flex items-center gap-2"><CheckCircle2 size={15} style={{ color: 'hsl(189,95%,43%)' }} /> Instant Salary Detection</span>
                <span className="flex items-center gap-2"><CheckCircle2 size={15} style={{ color: 'hsl(189,95%,43%)' }} /> Zero Minimums</span>
              </motion.div>
            </div>

            {/* Right — Mockup Card */}
            <div className="lg:col-span-5 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.88, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 160, damping: 22 }}
                className="relative"
                style={{ animation: 'float 6s ease-in-out infinite' }}
              >
                {/* Outer glow */}
                <div className="absolute inset-0 rounded-3xl" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(59,130,246,0.15) 0%, transparent 70%)', filter: 'blur(20px)', transform: 'scale(1.1)' }} />

                {/* Card */}
                <div className="relative rounded-3xl p-6 space-y-5" style={{ background: 'rgba(14,20,32,0.95)', border: '1px solid rgba(59,130,246,0.25)', boxShadow: '0 0 0 1px rgba(59,130,246,0.08), 0 32px 80px -16px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)' }}>

                  {/* Header */}
                  <div className="flex items-center justify-between pb-4" style={{ borderBottom: '1px solid rgba(30,45,69,0.8)' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl grid place-items-center" style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.2)' }}>
                        <Wallet size={19} style={{ color: 'hsl(217,91%,60%)' }} />
                      </div>
                      <div>
                        <p className="font-semibold text-sm" style={{ color: 'hsl(228,60%,93%)' }}>Stellar Wallet</p>
                        <p className="text-xs font-mono" style={{ color: 'hsl(222,22%,55%)' }}>G...8F2A</p>
                      </div>
                    </div>
                    <span className="chip-stellar">Active</span>
                  </div>

                  {/* Balance */}
                  <div className="rounded-2xl p-4" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(124,58,237,0.08))', border: '1px solid rgba(59,130,246,0.2)' }}>
                    <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'hsl(222,22%,55%)' }}>Salary Auto-Split Active</p>
                    <p className="text-3xl font-bold font-mono" style={{ color: 'hsl(228,60%,93%)', fontFamily: 'var(--font-mono)' }}>$2,500.00 <span className="text-sm" style={{ color: 'hsl(222,22%,55%)' }}>USDC</span></p>
                  </div>

                  {/* Vaults */}
                  <div className="space-y-2.5">
                    {[
                      { emoji: '🏠', name: 'House Rent', amount: '$850.00', color: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.2)', amountColor: 'hsl(217,91%,60%)' },
                      { emoji: '⚡', name: 'Electricity', amount: '$150.00', color: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.15)', amountColor: 'hsl(217,91%,60%)' },
                      { emoji: '🛡️', name: 'Emergency Vault', amount: '$500.00', color: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)', amountColor: 'hsl(38,92%,50%)' },
                    ].map((v) => (
                      <div key={v.name} className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm" style={{ background: v.color, border: `1px solid ${v.border}` }}>
                        <div className="flex items-center gap-2.5">
                          <span className="text-base">{v.emoji}</span>
                          <span className="font-semibold text-xs" style={{ color: 'hsl(228,60%,93%)' }}>{v.name}</span>
                        </div>
                        <span className="font-mono font-bold text-xs" style={{ color: v.amountColor }}>{v.amount}</span>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-medium" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.15)', color: 'hsl(38,92%,50%)' }}>
                    <Lock size={13} /> Locked via Soroban smart contract
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ FEATURES */}
      <section id="features" className="py-24 relative" style={{ background: 'rgba(14,20,32,0.4)', borderTop: '1px solid rgba(30,45,69,0.5)', borderBottom: '1px solid rgba(30,45,69,0.5)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-2" style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', color: 'hsl(217,91%,60%)' }}>
              <Star size={12} /> Core Features
            </div>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 700, letterSpacing: '-0.03em', color: 'hsl(228,60%,93%)', fontFamily: 'var(--font-display)' }}>
              Built for Absolute Financial Discipline
            </h2>
            <p style={{ color: 'hsl(222,22%,55%)', lineHeight: 1.7 }}>
              Traditional budgeting relies on willpower. StellarPlan replaces willpower with automated Soroban smart contract protection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Zap, title: 'Automated Salary Ingestion', desc: 'Horizon API monitors your Stellar account. The millisecond salary arrives, payment allocation triggers automatically — no manual action required.', color: 'rgba(59,130,246,0.15)', iconColor: 'hsl(217,91%,60%)', border: 'rgba(59,130,246,0.2)' },
              { icon: Lock, title: 'Soroban Time-Locked Vaults', desc: 'Funds are escrowed directly in Soroban smart contract vaults. They automatically unlock on bill payment day — fully trustless and non-custodial.', color: 'rgba(245,158,11,0.12)', iconColor: 'hsl(38,92%,50%)', border: 'rgba(245,158,11,0.2)' },
              { icon: Shield, title: 'Friction-Based Early Release', desc: 'Need emergency money before due date? Pass identity authentication and a mandatory 10-second cooldown to break the smart contract lock.', color: 'rgba(6,182,212,0.12)', iconColor: 'hsl(189,95%,43%)', border: 'rgba(6,182,212,0.2)' },
            ].map(({ icon: Icon, title, desc, color, iconColor, border }) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-2xl p-8 space-y-5 transition-all duration-300 group"
                style={{ background: 'rgba(14,20,32,0.8)', border: '1px solid rgba(30,45,69,0.8)' }}
                whileHover={{ borderColor: border, y: -4 }}
              >
                <div className="w-12 h-12 rounded-2xl grid place-items-center" style={{ background: color, border: `1px solid ${border}` }}>
                  <Icon size={22} style={{ color: iconColor }} />
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'hsl(228,60%,93%)', fontFamily: 'var(--font-display)' }}>{title}</h3>
                <p style={{ color: 'hsl(222,22%,55%)', fontSize: '0.875rem', lineHeight: 1.7 }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ HOW IT WORKS */}
      <section id="how-it-works" className="py-24 relative overflow-hidden">
        <div className="aurora-orb w-[400px] h-[400px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)' }} />
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 style={{ fontSize: '2.25rem', fontWeight: 700, letterSpacing: '-0.03em', color: 'hsl(228,60%,93%)', fontFamily: 'var(--font-display)' }}>
              How StellarPlan Works in 3 Steps
            </h2>
            <p style={{ color: 'hsl(222,22%,55%)' }}>Set up once in minutes. Smart contracts handle every payday automatically.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-8 left-1/6 right-1/6 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.3), rgba(124,58,237,0.3), transparent)', top: '2.25rem', left: '20%', right: '20%', position: 'absolute' }} />

            {[
              { step: '01', title: 'Create Essential Plans', desc: 'Define monthly targets for rent, electricity, groceries, and savings with your preferred unlock due dates.', color: 'rgba(59,130,246,0.15)', border: 'rgba(59,130,246,0.3)' },
              { step: '02', title: 'Connect Stellar Wallet', desc: 'Link your Freighter wallet or public key. No private keys are ever shared or stored by StellarPlan.', color: 'rgba(124,58,237,0.15)', border: 'rgba(124,58,237,0.3)' },
              { step: '03', title: 'Auto-Protect Paycheck', desc: 'When salary lands, funds auto-split into Soroban vaults. Remaining money stays available for daily spending.', color: 'rgba(6,182,212,0.15)', border: 'rgba(6,182,212,0.3)' },
            ].map(({ step, title, desc, color, border }) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-2xl p-8 text-center space-y-4"
                style={{ background: 'rgba(14,20,32,0.7)', border: '1px solid rgba(30,45,69,0.7)' }}
              >
                <div className="w-12 h-12 rounded-2xl grid place-items-center mx-auto text-sm font-bold font-mono" style={{ background: color, border: `1px solid ${border}`, color: 'hsl(228,60%,93%)', fontFamily: 'var(--font-mono)' }}>
                  {step}
                </div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'hsl(228,60%,93%)', fontFamily: 'var(--font-display)' }}>{title}</h4>
                <p style={{ color: 'hsl(222,22%,55%)', fontSize: '0.875rem', lineHeight: 1.7 }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ FOOTER */}
      <footer className="mt-auto py-10" style={{ borderTop: '1px solid rgba(30,45,69,0.5)', background: 'rgba(14,20,32,0.5)' }}>
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-xs" style={{ color: 'hsl(222,22%,45%)' }}>
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg grid place-items-center" style={{ background: 'linear-gradient(135deg, #3B82F6, #7C3AED)' }}>
              <Star size={13} className="text-white fill-white" />
            </div>
            <span className="font-bold" style={{ color: 'hsl(228,60%,93%)' }}>StellarPlan</span>
            <span style={{ color: 'rgba(123,141,176,0.5)' }}>—</span>
            <span>Smart Contract Salary Protection</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="https://stellar.org" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">Stellar Network</a>
            <a href="https://soroban.stellar.org" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">Soroban</a>
            <Link href="/login" className="hover:text-foreground transition-colors">Login</Link>
            <Link href="/signup" className="hover:text-foreground transition-colors">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
