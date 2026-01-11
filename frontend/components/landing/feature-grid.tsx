import { Card } from '@/components/ui/card';
import { Clock, Calendar, DollarSign, CheckSquare, Shield, FileText } from 'lucide-react';

const features = [
  {
    icon: Clock,
    title: 'Time & Attendance',
    description: 'Kiosk mode, biometric integration, overtime tracking, and late/undertime calculations built for PH laws.',
  },
  {
    icon: Calendar,
    title: 'Leave Management',
    description: 'VL, SL, emergency leave, and custom leave types. Track balances, accruals, and approvals in one place.',
  },
  {
    icon: DollarSign,
    title: 'Payroll Processing',
    description: 'SSS, PhilHealth, Pag-IBIG, withholding tax auto-computed. Generate payslips in seconds.',
  },
  {
    icon: CheckSquare,
    title: 'Approval Workflows',
    description: 'Multi-level approvals for timesheets, leave, and adjustments. Email notifications and audit trails.',
  },
  {
    icon: Shield,
    title: 'Role-Based Access Control',
    description: 'Admin, Manager, and Employee roles with granular permissions. Secure your HR data.',
  },
  {
    icon: FileText,
    title: 'Audit Logs',
    description: 'Complete history of all changes. WHO changed WHAT and WHEN — DOLE-audit ready.',
  },
];

export function FeatureGrid() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-purple-50 dark:from-gray-800 dark:to-purple-900/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Everything You Need, <span className="gradient-text">Out of the Box</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Full-featured HRIS built specifically for the Philippine market
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index}
                className="p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-purple-300 dark:hover:border-purple-700 group bg-white dark:bg-gray-900"
              >
                <div className="mb-4 p-3 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/40 dark:to-blue-900/40 rounded-xl w-fit group-hover:scale-110 transition-transform">
                  <Icon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
