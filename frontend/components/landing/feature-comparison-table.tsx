import { Check, X } from 'lucide-react';

const features = [
  { name: 'Employee limit', free: '20', basic: 'Unlimited', pro: 'Unlimited', enterprise: 'Unlimited' },
  { name: 'Admin accounts', free: '1', basic: '5', pro: 'Unlimited', enterprise: 'Unlimited' },
  { name: 'Concurrent kiosk sessions', free: '1', basic: '3', pro: 'Unlimited', enterprise: 'Unlimited' },
  { name: 'Data retention', free: '6 months', basic: 'Unlimited', pro: 'Unlimited', enterprise: 'Unlimited' },
  { name: 'Time & Attendance tracking', free: true, basic: true, pro: true, enterprise: true },
  { name: 'Timesheet management', free: true, basic: true, pro: true, enterprise: true },
  { name: 'Approval workflows', free: true, basic: true, pro: true, enterprise: true },
  { name: 'Payroll processing', free: true, basic: true, pro: true, enterprise: true },
  { name: 'Payslip generation & PDF', free: true, basic: true, pro: true, enterprise: true },
  { name: 'SSS/PhilHealth/Pag-IBIG', free: true, basic: true, pro: true, enterprise: true },
  { name: 'Employee portal', free: true, basic: true, pro: true, enterprise: true },
  { name: 'Dashboard & reports', free: true, basic: true, pro: true, enterprise: true },
  { name: 'Leave management', free: false, basic: false, pro: true, enterprise: true },
  { name: 'Advanced reports', free: false, basic: false, pro: true, enterprise: true },
  { name: 'Single Sign-On (SSO)', free: false, basic: false, pro: false, enterprise: true },
  { name: 'Custom report builder', free: false, basic: false, pro: false, enterprise: true },
  { name: 'Self-hosting option', free: false, basic: false, pro: false, enterprise: true },
  { name: 'Dedicated account manager', free: false, basic: false, pro: false, enterprise: true },
];

export function FeatureComparisonTable() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="gradient-text">Compare Plans</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Find the perfect plan for your team size and needs
          </p>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full max-w-5xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
            <thead>
              <tr className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                <th className="py-4 px-6 text-left font-semibold">Features</th>
                <th className="py-4 px-4 text-center font-semibold">Free</th>
                <th className="py-4 px-4 text-center font-semibold">Basic</th>
                <th className="py-4 px-4 text-center font-semibold">Pro</th>
                <th className="py-4 px-4 text-center font-semibold">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature, index) => (
                <tr
                  key={index}
                  className={`border-b dark:border-gray-700 ${
                    index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800/50' : ''
                  }`}
                >
                  <td className="py-4 px-6 font-medium text-gray-900 dark:text-white">
                    {feature.name}
                  </td>
                  <td className="py-4 px-4 text-center">
                    {typeof feature.free === 'boolean' ? (
                      feature.free ? (
                        <Check className="h-6 w-6 text-green-500 mx-auto" />
                      ) : (
                        <X className="h-6 w-6 text-gray-300 dark:text-gray-600 mx-auto" />
                      )
                    ) : (
                      <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                        {feature.free}
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-center">
                    {typeof feature.basic === 'boolean' ? (
                      feature.basic ? (
                        <Check className="h-6 w-6 text-green-500 mx-auto" />
                      ) : (
                        <X className="h-6 w-6 text-gray-300 dark:text-gray-600 mx-auto" />
                      )
                    ) : (
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {feature.basic}
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-center">
                    {typeof feature.pro === 'boolean' ? (
                      feature.pro ? (
                        <Check className="h-6 w-6 text-green-500 mx-auto" />
                      ) : (
                        <X className="h-6 w-6 text-gray-300 dark:text-gray-600 mx-auto" />
                      )
                    ) : (
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {feature.pro}
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-center">
                    {typeof feature.enterprise === 'boolean' ? (
                      feature.enterprise ? (
                        <Check className="h-6 w-6 text-green-500 mx-auto" />
                      ) : (
                        <X className="h-6 w-6 text-gray-300 dark:text-gray-600 mx-auto" />
                      )
                    ) : (
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {feature.enterprise}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-6">
          {['free', 'basic', 'pro', 'enterprise'].map((tier) => (
            <div
              key={tier}
              className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6"
            >
              <h3 className="text-2xl font-bold mb-4 gradient-text capitalize">
                {tier}
              </h3>
              <ul className="space-y-3">
                {features.map((feature, index) => {
                  const value = feature[tier as keyof typeof feature];
                  return (
                    <li key={index} className="flex items-center justify-between">
                      <span className="text-gray-700 dark:text-gray-300 text-sm">
                        {feature.name}
                      </span>
                      {typeof value === 'boolean' ? (
                        value ? (
                          <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                        ) : (
                          <X className="h-5 w-5 text-gray-300 dark:text-gray-600 flex-shrink-0" />
                        )
                      ) : (
                        <span className="text-sm font-semibold text-purple-600 dark:text-purple-400 flex-shrink-0">
                          {value}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
