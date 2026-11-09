import React, { useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const stats = [
  { icon: '🔐', target: 100, suffix: '%', label: 'Tamper-Proof Records' },
  { icon: '⚡', target: 24, suffix: '/7', label: 'Real-time AI Analysis' },
  { icon: '📊', target: 25, suffix: '+', label: 'Financial Reports' },
  { icon: '🔗', target: 1, suffix: '', label: 'Blockchain Secured' }
];

const Counter = ({ target }) => {
  const [count, setCount] = useState(0);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const duration = 2000;
      const stepTime = Math.abs(Math.floor(duration / target));
      const timer = setInterval(() => {
        start += 1;
        setCount(start);
        if (start === target) clearInterval(timer);
      }, stepTime);
      return () => clearInterval(timer);
    }
  }, [isInView, target]);

  return <span ref={ref}>{count}</span>;
};

const StatsBar = () => {
  return (
    <div className="w-full bg-slate-900 border-y border-indigo-500/20 relative z-20">
      <div className="container mx-auto px-6 lg:px-12 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:divide-x divide-slate-800">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="flex flex-col items-center justify-center text-center px-4"
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl md:text-4xl font-extrabold text-white">
                  <Counter target={stat.target} />
                </span>
                <span className="text-xl font-bold text-indigo-400">{stat.suffix}</span>
              </div>
              <p className="text-sm text-slate-400 mt-1 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsBar;