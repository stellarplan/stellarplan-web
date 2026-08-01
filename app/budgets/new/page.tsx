'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { PlanWizard, NewPlan } from '@/components/plans/PlanWizard';

export default function NewPlanPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handle(plan: NewPlan) {
    setSubmitting(true);
    setError('');
    try {
      await api.createPlan({
        name: plan.name,
        category: plan.category,
        amount: plan.amount,
        unlockDay: plan.unlockDay,
        planType: plan.planType,
      } as any);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message ?? 'Unable to create plan.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-md space-y-6">
        {error && (
          <div className="surface-chip chip-danger w-full !justify-start text-sm py-3 px-4">
            {error}
          </div>
        )}
        <PlanWizard onComplete={handle} onCancel={() => router.back()} />
      </div>
    </main>
  );
}
