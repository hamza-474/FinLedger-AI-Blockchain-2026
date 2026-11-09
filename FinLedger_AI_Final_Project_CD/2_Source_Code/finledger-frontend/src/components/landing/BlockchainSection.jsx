import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, CheckCircle2, Lock } from 'lucide-react';

const BlockchainSection = () => {
  return (
    <section className="py-24 bg-slate-900 relative" id="blockchain">
      {/* Glow */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">

          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 text-sm font-bold border border-indigo-500/20 mb-6">
              <Lock size={16} /> Immutable Ledger
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
              Your Data, <br className="hidden md:block" />
              <span className="text-indigo-400">Permanently Secured</span>
            </h2>
            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
              Traditional finance software lets admins edit or delete records.
              FinLedger AI stores every transaction on a blockchain — making it
              mathematically impossible to tamper with historical data.
            </p>

            <ul className="space-y-4">
              {[
                "Every transaction gets a unique cryptographic hash",
                "Each record links to the previous — forming an unbreakable chain",
                "Any tampering is instantly detected and reported",
                "Full audit trail available at any time"
              ].map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-3 text-slate-300"
                >
                  <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={20} />
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="flex-1 w-full overflow-hidden py-10">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-2">
              {[
                { id: 1, title: 'Salary', hash: 'a3f9...2x', prev: '0000...00' },
                { id: 2, title: 'Office Rent', hash: '7d4e...9b', prev: 'a3f9...2x' },
                { id: 3, title: 'Equipment', hash: '2b6c...4m', prev: '7d4e...9b' }
              ].map((block, i) => (
                <React.Fragment key={i}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.3 }}
                    className="bg-slate-800 border border-slate-700 rounded-xl p-4 w-full md:w-40 relative shadow-xl shadow-black/40"
                  >
                    <div className="absolute -top-3 -right-3 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-slate-900 shadow-sm">
                      <ShieldAlert size={12} className="text-white" />
                    </div>
                    <div className="text-xs font-bold text-slate-500 mb-1">BLOCK #{block.id}</div>
                    <div className="font-bold text-white mb-3 truncate">{block.title}</div>
                    <div className="space-y-1">
                      <div className="text-[10px] text-slate-400 bg-slate-900 p-1.5 rounded truncate border border-slate-700">Prev: {block.prev}</div>
                      <div className="text-[10px] text-indigo-400 bg-indigo-500/10 p-1.5 rounded truncate border border-indigo-500/20">Hash: {block.hash}</div>
                    </div>
                  </motion.div>

                  {i < 2 && (
                    <motion.div
                      initial={{ scaleX: 0, opacity: 0 }}
                      whileInView={{ scaleX: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: (i * 0.3) + 0.15, duration: 0.3 }}
                      className="hidden md:flex items-center text-slate-600 origin-left"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                    </motion.div>
                  )}
                  {i < 2 && (
                    <motion.div
                      initial={{ scaleY: 0, opacity: 0 }}
                      whileInView={{ scaleY: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: (i * 0.3) + 0.15, duration: 0.3 }}
                      className="md:hidden flex items-center text-slate-600 origin-top py-1"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M19 12l-7 7-7-7" /></svg>
                    </motion.div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
export default BlockchainSection;