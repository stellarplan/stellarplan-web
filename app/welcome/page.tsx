import Link from 'next/link';

export default function WelcomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="max-w-md w-full text-center space-y-10">
        {/* stamp */}
        <div className="flex justify-center">
          <div className="vault-lock w-20 h-20 !rounded-[24px] !bg-gradient-to-br from-[#E9DFD2] to-[#D8C6AE]">
            <span className="text-4xl">🌠</span>
          </div>
        </div>

        <header className="space-y-3">
          <h1 className="text-5xl">Your Money,<br />Protected.</h1>
          <p className="text-muted text-base leading-relaxed max-w-sm mx-auto">
            When your salary arrives, StellarPlan automatically sets aside rent,
            bills, and savings before you can accidentally spend them.
          </p>
        </header>

        <div className="space-y-3">
          <Link href="/signup" className="btn-primary w-full">
            Create my account
          </Link>
          <Link href="/login" className="btn-ghost w-full">
            I already have an account
          </Link>
        </div>

        <p className="text-xs text-muted/70">
          Built on <span className="font-semibold">Stellar</span> · Powered by <span className="font-semibold">Soroban</span>
        </p>
      </div>
    </main>
  );
}
