import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, BrainCircuit, Activity, FileText, MessageSquare } from 'lucide-react';

const aiFeatures = [
  {
    icon: <Sparkles size={24} />,
    title: 'Spending Predictions',
    description: "AI predicts next month's expenses by category based on your history.",
    tag: 'Powered by Gemini AI'
  },
  {
    icon: <Activity size={24} />,
    title: 'Anomaly Detection',
    description: 'Automatically flags transactions that look suspicious or out of pattern.',
    tag: 'Real-time Analysis'
  },
  {
    icon: <FileText size={24} />,
    title: 'Auto-Generated Reports',
    description: 'AI writes professional financial analysis reports — no manual work needed.',
    tag: 'One Click Report'
  },
  {
    icon: <MessageSquare size={24} />,
    title: 'Ask AI Anything',
    description: 'Chat with AI about your finances. Get advice, summaries, and recommendations.',
    tag: 'AI Chat Assistant'
  }
];

const AISection = () => {
  return (
    <section className="py-24 bg-slate-900 border-t border-slate-800 relative" id="ai">
      <div className="absolute left-1/2 top-0 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>

      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-cyan-500/10 text-cyan-400 mb-4 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <BrainCircuit size={32} />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Artificial Intelligence Built Into Every Decision</h2>
          <p className="text-slate-400 text-lg">FinLedger AI uses advanced LLMs to act as your personal financial analyst.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {aiFeatures.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
              className="bg-slate-800/50 border border-slate-700 p-8 rounded-2xl relative overflow-hidden group hover:border-cyan-500/50 hover:bg-slate-800 transition-all"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500 opacity-50 group-hover:opacity-100 group-hover:shadow-[0_0_10px_#06b6d4] transition-all"></div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mt-1">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">{feature.description}</p>
                  <span className="inline-block px-3 py-1 bg-slate-900 border border-slate-700 rounded-full text-xs font-semibold text-cyan-400">
                    {feature.tag}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AISection;