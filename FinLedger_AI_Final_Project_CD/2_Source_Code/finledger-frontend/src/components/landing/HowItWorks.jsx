import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Coins, Sparkles } from 'lucide-react';

const steps = [
  {
    icon: <Building2 size={28} />,
    num: "01",
    title: "Register Your Organization",
    description: "Create your account and set up your organization profile in under 2 minutes."
  },
  {
    icon: <Coins size={28} />,
    num: "02",
    title: "Record Transactions",
    description: "Add income and expenses. Every record is automatically saved to the blockchain."
  },
  {
    icon: <Sparkles size={28} />,
    num: "03",
    title: "Get AI Insights",
    description: "Let AI analyze your data, detect anomalies, and predict future spending."
  }
];

const HowItWorks = () => {
  return (
    <section className="py-24 bg-slate-900 relative overflow-hidden" id="how-it-works">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800/50 via-slate-900 to-slate-900 pointer-events-none"></div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Get Started in 3 Simple Steps</h2>
          <div className="w-20 h-1 bg-indigo-500 mx-auto rounded-full"></div>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-6 relative">

          {/* Desktop connecting line */}
          <div className="hidden lg:block absolute top-1/2 left-[10%] right-[10%] h-0.5 bg-slate-800 -translate-y-1/2 z-0">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: '100%' }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="h-full bg-indigo-500/50 border-t border-dashed border-indigo-400"
            ></motion.div>
          </div>

          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2, duration: 0.6 }}
              className="flex-1 w-full max-w-sm relative z-10"
            >
              <div className="bg-slate-800/80 backdrop-blur-sm p-8 rounded-2xl border border-slate-700 text-center relative overflow-hidden group hover:border-indigo-500/50 transition-colors">
                <span className="absolute -top-6 -right-2 text-9xl font-black text-slate-700/20 group-hover:text-indigo-500/10 transition-colors select-none">
                  {step.num}
                </span>

                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 p-[1px] mb-6 shadow-lg shadow-indigo-500/20">
                  <div className="w-full h-full bg-slate-900 rounded-2xl flex items-center justify-center text-white">
                    {step.icon}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;