import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, ShieldCheck, BrainCircuit, AlertOctagon, PieChart, LineChart } from 'lucide-react';

const features = [
  {
    icon: <Wallet size={24} />,
    title: 'Income & Expense Tracking',
    description: 'Record every transaction with categories, dates, and descriptions. Always know where your money goes.'
  },
  {
    icon: <ShieldCheck size={24} />,
    title: 'Blockchain Security',
    description: 'Every transaction is permanently recorded on a blockchain. No editing, no deleting, no fraud.'
  },
  {
    icon: <BrainCircuit size={24} />,
    title: 'AI Spending Predictions',
    description: 'Our AI analyzes your spending history and predicts next month\'s expenses by category.'
  },
  {
    icon: <AlertOctagon size={24} />,
    title: 'Anomaly Detection',
    description: 'AI automatically flags suspicious or unusual transactions before they become a problem.'
  },
  {
    icon: <PieChart size={24} />,
    title: 'Budget Management',
    description: 'Set spending limits per category. Get warnings when you\'re close to the limit.'
  },
  {
    icon: <LineChart size={24} />,
    title: 'Financial Reports',
    description: 'Monthly, yearly, and category-wise reports with beautiful charts and exportable data.'
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-24 bg-slate-900" id="features">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Everything Your Organization Needs</h2>
          <p className="text-slate-400 text-lg">One platform to manage finances, detect fraud, and predict the future.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-slate-800 p-8 rounded-2xl border-l-4 border-l-indigo-500 shadow-lg hover:shadow-indigo-500/10 transition-all border-y border-r border-slate-700/50"
            >
              <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-6 border border-indigo-500/20">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default FeaturesSection;