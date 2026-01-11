import { Card } from '@/components/ui/card';
import { Fingerprint, Building2, Headphones } from 'lucide-react';

const addons = [
  {
    icon: Fingerprint,
    name: 'Biometrics Integration',
    price: '₱2,000',
    period: '/month',
    description: 'Connect fingerprint or face recognition devices',
    features: [
      'Supports ZKTeco, Anviz, and more',
      'Real-time sync',
      'Anti-buddy punching',
      'Photo capture on clock-in',
    ],
  },
  {
    icon: Building2,
    name: 'Multi-Branch Management',
    price: '₱1,500',
    period: '/month',
    description: 'Manage employees across multiple locations',
    features: [
      'Unlimited branches',
      'Per-branch reports',
      'Location-based policies',
      'Consolidated dashboard',
    ],
  },
  {
    icon: Headphones,
    name: 'Priority Support',
    price: '₱3,000',
    period: '/month',
    description: '24/7 support with dedicated account manager',
    features: [
      '24/7 phone & chat support',
      'Dedicated account manager',
      '<1 hour response time',
      'Monthly strategy calls',
    ],
  },
];

export function AddonsSection() {
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="gradient-text">Power Up</span> with Add-ons
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Extend TimeSlip with optional modules tailored to your needs
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {addons.map((addon, index) => {
            const Icon = addon.icon;
            return (
              <Card
                key={index}
                className="p-6 hover:shadow-xl transition-all duration-300 border-2 hover:border-purple-300 dark:hover:border-purple-700 group"
              >
                <div className="mb-4 p-3 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/40 dark:to-blue-900/40 rounded-xl w-fit group-hover:scale-110 transition-transform">
                  <Icon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>

                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  {addon.name}
                </h3>

                <div className="mb-3">
                  <span className="text-3xl font-bold gradient-text">
                    {addon.price}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {addon.period}
                  </span>
                </div>

                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {addon.description}
                </p>

                <ul className="space-y-2">
                  {addon.features.map((feature, fIndex) => (
                    <li
                      key={fIndex}
                      className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
                    >
                      <span className="text-purple-600 dark:text-purple-400 mt-0.5">
                        •
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            );
          })}
        </div>

        <p className="text-center mt-8 text-gray-600 dark:text-gray-400">
          All add-ons can be enabled or disabled anytime. No long-term commitment.
        </p>
      </div>
    </section>
  );
}
