'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'Is TimeSlip compliant with Philippine labor laws?',
    answer:
      'Yes! TimeSlip is built specifically for the Philippine market. We auto-compute SSS, PhilHealth, Pag-IBIG, and withholding tax based on current DOLE regulations. Our payroll and leave modules follow Philippine labor code requirements, and our audit logs meet DOLE inspection standards.',
  },
  {
    question: 'Can I migrate from my existing system?',
    answer:
      'Absolutely. We provide free data migration assistance for Pro and Enterprise plans. Our team will help you import employee data, leave balances, and historical records from spreadsheets or other HRIS systems. Migration typically takes 1-2 weeks.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major Philippine payment methods: credit/debit cards (Visa, Mastercard), GCash, bank transfer, and check payments. Enterprise clients can also opt for quarterly or annual invoicing.',
  },
  {
    question: 'Do you offer training for our HR team?',
    answer:
      'Yes! All plans include onboarding training via video call. Pro and Enterprise plans also get ongoing training sessions, video tutorials, and a comprehensive knowledge base. We can conduct on-site training for Enterprise clients (Metro Manila only).',
  },
  {
    question: 'Is there a minimum number of employees?',
    answer:
      'No minimum! TimeSlip works for teams of any size — from 5 employees to 5,000+. Pricing is per employee, so you only pay for what you use. Perfect for growing startups and established enterprises alike.',
  },
  {
    question: "What's included in the free trial?",
    answer:
      'The 14-day free trial gives you full access to all features of your chosen plan (Basic, Pro, or Enterprise). No credit card required to start. You can invite your team, import employee data, and test all modules. We provide live onboarding support during your trial.',
  },
  {
    question: 'Can we customize the system for our specific needs?',
    answer:
      'Enterprise plans include custom workflows, report builders, and API access for integrations. For unique requirements (e.g., custom pay structures, industry-specific modules), our team can build tailored solutions. Contact us to discuss your needs.',
  },
  {
    question: 'How secure is our data?',
    answer:
      'We use bank-level encryption (AES-256) for data at rest and in transit. Our servers are hosted in secure, SOC 2 certified data centers. We perform regular security audits and backups. Enterprise clients can opt for self-hosting for complete data control.',
  },
];

export function FAQSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-800 dark:to-purple-900/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Everything you need to know about TimeSlip HR
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-lg px-6 hover:border-purple-300 dark:hover:border-purple-700 transition-all"
              >
                <AccordionTrigger className="text-left font-semibold text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Still have questions?
          </p>
          <a
            href="mailto:support@timeslip.ph"
            className="text-purple-600 dark:text-purple-400 font-semibold hover:underline"
          >
            Contact our sales team →
          </a>
        </div>
      </div>
    </section>
  );
}
