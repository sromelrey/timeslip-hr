import { Card } from '@/components/ui/card';
import { X, ArrowRight } from 'lucide-react';

const painPoints = [
  {
    pain: 'Manual timesheet tracking',
    impact: 'Error-prone, time-consuming',
    solution: 'Automated time & attendance',
    benefit: 'Zero data entry, real-time tracking',
  },
  {
    pain: 'Delayed payslip generation',
    impact: 'Employee complaints, HR overtime',
    solution: 'One-click payslip generation',
    benefit: 'Employee portal access, instant delivery',
  },
  {
    pain: 'Compliance nightmares',
    impact: 'DOLE audit anxiety, penalties',
    solution: 'Built-in Philippine compliance',
    benefit: 'Audit-ready reports, peace of mind',
  },
  {
    pain: 'Scattered approval workflows',
    impact: 'Delays, lost requests, bottlenecks',
    solution: 'Centralized approval system',
    benefit: 'Email notifications, full audit trail',
  },
];

export function WhySwitchSection() {
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Why Philippine Teams <span className="gradient-text">Switch to TimeSlip</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Stop wrestling with spreadsheets. Start working smarter.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {painPoints.map((item, index) => (
            <Card 
              key={index} 
              className="p-6 hover:shadow-xl transition-all duration-300 border-2 hover:border-purple-200 dark:hover:border-purple-800 group"
            >
              {/* Pain Point */}
              <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-start gap-3">
                  <div className="mt-1 p-1 bg-red-100 dark:bg-red-900/30 rounded-full">
                    <X className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">
                      {item.pain}
                    </h3>
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {item.impact}
                    </p>
                  </div>
                </div>
              </div>

              {/* Solution */}
              <div className="flex items-center gap-2 mb-3">
                <ArrowRight className="h-5 w-5 text-purple-600 dark:text-purple-400 group-hover:translate-x-1 transition-transform" />
                <h4 className="font-semibold text-purple-600 dark:text-purple-400">
                  {item.solution}
                </h4>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                {item.benefit}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
