'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield, Zap, Lock, ArrowRight, CheckCircle2, DollarSign, Wallet, Layers, Cpu, Compass } from 'lucide-react';
import { formatMoney } from '@/lib/format';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-jade selection:text-white">
      {/* ------------------------------------------------ Header / Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-surface/80 border-b border-clay/50">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#E9DFD2] to-[#D8C6AE] grid place-items-center text-xl shadow-inner border border-clay/60">
              🌠
            </div>
            <span className="font-serif text-2xl font-bold tracking-tight text-foreground">
              Stellar<span className="text-jade">Plan</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-muted">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
            <a href="#security" className="hover:text-foreground transition-colors">Soroban Security</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login" className="btn-ghost text-sm px-4">
              Sign In
            </Link>
            <Link href="/signup" className="btn-primary text-sm px-5 py-2.5">
              Get Started <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------ Hero Section */}
      <section className="relative pt-16 pb-24 md:pt-24 md:pb-36 overflow-hidden">
        {/* Glow lights */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-jade/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-[400px] h-[400px] bg-copper/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-jade/10 border border-jade/30 text-jade text-xs font-bold uppercase tracking-wider shadow-sm"
              >
                <Zap size={14} /> Powered by Soroban & Stellar Smart Contracts
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold tracking-tight text-foreground leading-[1.15]"
              >
                Your Money, <br className="hidden sm:inline" />
                <span className="shimmer-text">Protected Before You Spend It.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-muted text-base md:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0"
              >
                When your salary lands in your wallet, StellarPlan automatically locks rent, electricity, and emergency savings into non-custodial Soroban vaults—so you never accidentally spend bill money.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2"
              >
                <Link href="/signup" className="btn-primary w-full sm:w-auto text-base px-8 py-4 shadow-xl">
                  Create Protected Vault <ArrowRight size={18} />
                </Link>
                <Link href="/login" className="btn-ghost w-full sm:w-auto text-base px-6 py-4 border border-clay/60 bg-surface">
                  Sign In to Account
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center justify-center lg:justify-start gap-6 text-xs text-muted font-medium pt-4"
              >
                <span className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-jade" /> Non-Custodial Vaults</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-jade" /> Instant Automated Detection</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-jade" /> Zero Minimums</span>
              </motion.div>
            </div>

            {/* Right Interactive Mockup Showcase */}
            <div className="lg:col-span-5 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 180 }}
                className="card p-6 md:p-8 space-y-6 glow-jade border-2 border-clay/80 bg-surface/90 shadow-2xl relative"
              >
                <div className="flex items-center justify-between pb-4 border-b border-clay/40">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-jade/15 text-jade grid place-items-center font-bold">
                      <Wallet size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-foreground">Stellar Testnet Account</p>
                      <p className="text-xs text-muted font-mono">G...8F2A</p>
                    </div>
                  </div>
                  <span className="chip-jade">Active Vault</span>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-jade/10 via-surface to-copper/10 border border-jade/30">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted mb-1">Salary Auto-Split Active</p>
                    <p className="text-3xl font-extrabold font-mono text-foreground">$2,500.00 <span className="text-xs text-muted">USDC</span></p>
                  </div>

                  <div className="space-y-2.5">
                    <div className="p-3 rounded-xl bg-surface border border-clay/60 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg">🏠</span>
                        <span className="font-bold">House Rent</span>
                      </div>
                      <span className="font-mono font-bold text-jade">$850.00</span>
                    </div>

                    <div className="p-3 rounded-xl bg-surface border border-clay/60 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg">⚡</span>
                        <span className="font-bold">Electricity Bill</span>
                      </div>
                      <span className="font-mono font-bold text-jade">$150.00</span>
                    </div>

                    <div className="p-3 rounded-xl bg-surface border border-clay/60 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg">🛡️</span>
                        <span className="font-bold">Emergency Vault</span>
                      </div>
                      <span className="font-mono font-bold text-copper-dark">$500.00</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-clay/30 text-center text-xs text-muted font-medium flex items-center justify-center gap-1.5">
                  <Lock size={14} className="text-copper-dark" />
                  Locked until due date via Soroban smart contract
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ Features Grid */}
      <section id="features" className="py-20 bg-surface/60 border-y border-clay/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
              Built For Absolute Financial Discipline
            </h2>
            <p className="text-muted text-sm sm:text-base leading-relaxed">
              Traditional budgeting relies on willpower. StellarPlan replaces willpower with automated Soroban smart contract protection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card p-8 space-y-4 hover:border-jade/40 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-jade/15 text-jade grid place-items-center text-2xl shadow-inner">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-bold font-serif text-foreground">Automated Salary Ingestion</h3>
              <p className="text-muted text-xs sm:text-sm leading-relaxed">
                Horizon API monitors your Stellar account. The millisecond salary arrives, payment allocation triggers automatically.
              </p>
            </div>

            <div className="card p-8 space-y-4 hover:border-jade/40 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-copper/15 text-copper-dark grid place-items-center text-2xl shadow-inner">
                <Lock size={24} />
              </div>
              <h3 className="text-xl font-bold font-serif text-foreground">Soroban Time-Locked Vaults</h3>
              <p className="text-muted text-xs sm:text-sm leading-relaxed">
                Funds are escrowed directly in Soroban smart contract vaults. They automatically unlock on bill payment day.
              </p>
            </div>

            <div className="card p-8 space-y-4 hover:border-jade/40 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-jade/15 text-jade grid place-items-center text-2xl shadow-inner">
                <Shield size={24} />
              </div>
              <h3 className="text-xl font-bold font-serif text-foreground">Friction-Based Early Release</h3>
              <p className="text-muted text-xs sm:text-sm leading-relaxed">
                Need emergency money before due date? Pass security authentication and a mandatory 10-second cooldown to break the lock.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
              How StellarPlan Works in 3 Steps
            </h2>
            <p className="text-muted text-sm sm:text-base">
              Set up once in minutes, then let smart contracts handle the rest every payday.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="card p-6 space-y-3 relative text-center">
              <div className="w-10 h-10 rounded-full bg-jade text-white font-mono font-bold text-sm grid place-items-center mx-auto shadow-md">
                1
              </div>
              <h4 className="text-lg font-bold font-serif text-foreground">Create Essential Plans</h4>
              <p className="text-muted text-xs leading-relaxed">
                Define monthly targets for rent, electricity, groceries, and savings, with your preferred unlock due dates.
              </p>
            </div>

            <div className="card p-6 space-y-3 relative text-center">
              <div className="w-10 h-10 rounded-full bg-jade text-white font-mono font-bold text-sm grid place-items-center mx-auto shadow-md">
                2
              </div>
              <h4 className="text-lg font-bold font-serif text-foreground">Connect Stellar Wallet</h4>
              <p className="text-muted text-xs leading-relaxed">
                Link your Freighter wallet or public key. No private keys are ever shared or stored.
              </p>
            </div>

            <div className="card p-6 space-y-3 relative text-center">
              <div className="w-10 h-10 rounded-full bg-jade text-white font-mono font-bold text-sm grid place-items-center mx-auto shadow-md">
                3
              </div>
              <h4 className="text-lg font-bold font-serif text-foreground">Auto-Protect Paycheck</h4>
              <p className="text-muted text-xs leading-relaxed">
                When salary lands, funds auto-split into Soroban vaults. Remaining money stays available for daily spending.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ Footer */}
      <footer className="mt-auto border-t border-clay/50 bg-surface py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-muted">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-clay/50 grid place-items-center text-xs">🌠</div>
            <span className="font-bold text-foreground">StellarPlan</span> — Smart Contract Salary Protection
          </div>

          <div className="flex items-center gap-6">
            <a href="https://stellar.org" target="_blank" rel="noreferrer" className="hover:text-foreground">Stellar Network</a>
            <a href="https://soroban.stellar.org" target="_blank" rel="noreferrer" className="hover:text-foreground">Soroban Smart Contracts</a>
            <Link href="/login" className="hover:text-foreground">Login</Link>
            <Link href="/signup" className="hover:text-foreground">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
