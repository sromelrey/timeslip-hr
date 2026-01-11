import { HeroSection } from '@/components/landing/hero-section';
import { WhySwitchSection } from '@/components/landing/why-switch-section';
import { FeatureGrid } from '@/components/landing/feature-grid';
import { PricingSection } from '@/components/landing/pricing-section';
import { FeatureComparisonTable } from '@/components/landing/feature-comparison-table';
import { AddonsSection } from '@/components/landing/addons-section';
import { FAQSection } from '@/components/landing/faq-section';
import { LandingFooter } from '@/components/landing/landing-footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TimeSlip HR - Philippine HR & Payroll Software | DOLE-Compliant HRIS',
  description:
    'Complete HR & Payroll solution for Philippine businesses. Time tracking, leave management, payroll processing, and compliance in one platform. Start your 14-day free trial today.',
  keywords: [
    'Philippine HRIS',
    'HR software Philippines',
    'Payroll software Philippines',
    'DOLE-compliant',
    'time tracking',
    'attendance system',
    'payroll processing',
    'employee portal',
  ],
  openGraph: {
    title: 'TimeSlip HR - Philippine HR & Payroll, Simplified',
    description:
      'DOLE-compliant HRIS built for Philippine teams. Automate time tracking, payroll, and compliance.',
    type: 'website',
  },
};

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <WhySwitchSection />
      <FeatureGrid />
      <PricingSection />
      <FeatureComparisonTable />
      <AddonsSection />
      <FAQSection />
      <LandingFooter />
    </main>
  );
}
