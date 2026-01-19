'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

type BillingCycle = 'monthly' | 'annual';

const pricingTiers = [
  {
    name: 'Free',
    monthlyPrice: 0,
    subtext: 'Complete HRIS for teams up to 20',
    features: [
      'Up to 20 employees',
      'Time tracking & attendance',
      'Timesheet management',
      'Approval workflows',
      'Payroll processing',
      'Payslip generation & PDF',
      'SSS/PhilHealth/Pag-IBIG',
      'Employee portal (full access)',
      'Dashboard & reports',
      '1 admin account',
      '1 kiosk session',
      '6-month data retention',
    ],
    limitations: [
      'Max 20 employees',
      '1 admin account only',
      '1 concurrent kiosk session',
      'Data older than 6 months archived/deleted',
    ],
  },
  {
    name: 'Basic',
    monthlyPrice: 69,
    features: [
      'Unlimited employees',
      '5 admin accounts',
      '3 concurrent kiosk sessions',
      'Unlimited data retention',
      'Everything in Free',
      'Email support',
    ],
    notIncluded: ['Leave management', 'Advanced reports'],
  },
  {
    name: 'Pro',
    monthlyPrice: 119,
    popular: true,
    features: [
      'Unlimited employees',
      'Unlimited admin accounts',
      'Unlimited kiosk sessions',
      'Unlimited data retention',
      'Everything in Basic',
      'Leave management (future)',
      'Advanced reports (future)',
      'Priority support',
    ],
    notIncluded: ['SSO', 'Custom reports', 'Self-hosting'],
  },
  {
    name: 'Enterprise',
    monthlyPrice: null,
    features: [
      'Everything in Pro',
      'Single Sign-On (SSO)',
      'Custom report builder',
      'Self-hosting option',
      'Dedicated account manager',
      'SLA guarantee',
      'Custom integrations',
    ],
    notIncluded: [],
  },
];

export function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');

  const getPrice = (monthlyPrice: number | null) => {
    if (monthlyPrice === null) return 'Custom';
    if (monthlyPrice === 0) return 'Free';
    if (billingCycle === 'annual') {
      const annualPrice = Math.round(monthlyPrice * 0.8); // 20% discount
      return `₱${annualPrice}`;
    }
    return `₱${monthlyPrice}`;
  };

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Simple, <span className="gradient-text">Transparent Pricing</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Pay per employee. Cancel anytime. No hidden fees.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4 p-1 bg-gray-100 dark:bg-gray-800 rounded-full">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-md'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                billingCycle === 'annual'
                  ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-md'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Annual
              <span className="ml-2 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {pricingTiers.map((tier, index) => (
            <Card
              key={index}
              className={`p-6 relative transition-all duration-300 ${
                tier.popular
                  ? 'border-2 border-purple-500 shadow-2xl glow-effect-strong lg:scale-105'
                  : tier.monthlyPrice === 0
                  ? 'border-2 border-gray-300 dark:border-gray-600 hover:border-purple-200 dark:hover:border-purple-800 hover:shadow-lg'
                  : 'border-2 hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-xl'
              }`}
            >
              {tier.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1">
                  Most Popular
                </Badge>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                  {tier.name}
                </h3>
                {(tier as { subtext?: string }).subtext && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                    {(tier as { subtext?: string }).subtext}
                  </p>
                )}
                <div className="mb-2">
                  {tier.monthlyPrice !== null ? (
                    <>
                      <span className="text-4xl font-bold gradient-text">
                        {getPrice(tier.monthlyPrice)}
                      </span>
                      {tier.monthlyPrice > 0 && (
                        <span className="text-gray-600 dark:text-gray-400">
                          /employee/{billingCycle === 'monthly' ? 'mo' : 'mo'}
                        </span>
                      )}
                      {tier.monthlyPrice === 0 && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Forever Free
                        </p>
                      )}
                    </>
                  ) : (
                    <span className="text-4xl font-bold gradient-text">Custom</span>
                  )}
                </div>
                {tier.monthlyPrice !== null && tier.monthlyPrice > 0 && billingCycle === 'annual' && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Billed annually (₱{Math.round(tier.monthlyPrice * 0.8 * 12)}/employee/year)
                  </p>
                )}
              </div>

              <ul className="space-y-2 mb-6">
                {tier.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              {(tier as { limitations?: string[] }).limitations && (
                <div className="mb-6 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                  <p className="text-xs font-semibold text-amber-800 dark:text-amber-300 mb-2">
                    Free Tier Limitations:
                  </p>
                  <ul className="space-y-1">
                    {(tier as { limitations?: string[] }).limitations!.map((limitation, lIndex) => (
                      <li key={lIndex} className="text-xs text-amber-700 dark:text-amber-400">
                        • {limitation}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Button
                className={`w-full ${
                  tier.popular
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'
                    : tier.monthlyPrice === 0
                    ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {tier.monthlyPrice === 0
                  ? 'Get Started Free'
                  : tier.monthlyPrice !== null
                  ? 'Start Free Trial'
                  : 'Contact Sales'}
              </Button>
            </Card>
          ))}
        </div>

        <p className="text-center mt-8 text-gray-600 dark:text-gray-400">
          All paid plans include a 14-day free trial. No credit card required.
        </p>

      </div>
    </section>
  );
}
