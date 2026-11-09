import React from 'react';

const StatCard = ({ title, value, icon: Icon, variant, isCurrency = true }) => {
  let colors = {
    bg: 'bg-indigo-500/10',
    text: 'text-indigo-400',
    border: 'border-indigo-500/20',
    shadow: 'shadow-[0_8px_32px_rgba(99,102,241,0.15)]',
    glow: 'from-indigo-500/30'
  };

  if (variant === 'green') {
    colors = {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      border: 'border-emerald-500/20',
      shadow: 'shadow-[0_8px_32px_rgba(16,185,129,0.15)]',
      glow: 'from-emerald-500/30'
    };
  } else if (variant === 'red') {
    colors = {
      bg: 'bg-rose-500/10',
      text: 'text-rose-400',
      border: 'border-rose-500/20',
      shadow: 'shadow-[0_8px_32px_rgba(244,63,94,0.15)]',
      glow: 'from-rose-500/30'
    };
  } else if (variant === 'blue') {
    colors = {
      bg: 'bg-violet-500/10',
      text: 'text-violet-400',
      border: 'border-violet-500/20',
      shadow: 'shadow-[0_8px_32px_rgba(139,92,246,0.25)]',
      glow: 'from-violet-500/40'
    };
  }

  return (
    <div className={`h-full flex flex-col justify-center relative overflow-hidden bg-gradient-to-br from-[#0f172a]/90 to-[#1e1b4b]/90 backdrop-blur-3xl rounded-[2rem] p-5 lg:p-6 xl:p-8 border border-white/[0.08] ${colors.shadow} transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] group z-10`}>
      {/* Dynamic Purple Cow Glow */}
      <div className={`absolute -top-24 -right-24 w-56 h-56 bg-gradient-to-br ${colors.glow} to-transparent rounded-full opacity-30 group-hover:opacity-70 group-hover:scale-125 transition-all duration-700 blur-3xl -z-10`}></div>
      <div className={`absolute -bottom-24 -left-24 w-56 h-56 bg-gradient-to-tr ${colors.glow} to-transparent rounded-full opacity-20 group-hover:opacity-60 group-hover:scale-125 transition-all duration-700 blur-3xl -z-10`}></div>
      
      <div className="relative flex items-center justify-between z-10">
        <div className="space-y-2 flex-1 pr-2">
          <p className="text-gray-400/90 text-[10px] md:text-xs font-bold tracking-wider uppercase leading-tight">{title}</p>
          <h3 className="text-xl md:text-2xl lg:text-xl xl:text-2xl 2xl:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-50 to-gray-400 drop-shadow-sm flex flex-wrap items-baseline gap-1">
            {isCurrency ? <span className="text-xs md:text-sm text-gray-500 font-bold tracking-normal">PKR</span> : ''}
            <span>{value.toLocaleString(undefined, isCurrency ? { minimumFractionDigits: 2, maximumFractionDigits: 2 } : {})}</span>
          </h3>
        </div>
        {Icon && (
          <div className={`w-12 h-12 sm:w-14 sm:h-14 xl:w-16 xl:h-16 flex-shrink-0 rounded-xl xl:rounded-[1.25rem] flex items-center justify-center ${colors.bg} ${colors.text} ${colors.border} border backdrop-blur-xl shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500`}>
            <Icon className="w-6 h-6 sm:w-7 sm:h-7 xl:w-8 xl:h-8" strokeWidth={2.5} />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
