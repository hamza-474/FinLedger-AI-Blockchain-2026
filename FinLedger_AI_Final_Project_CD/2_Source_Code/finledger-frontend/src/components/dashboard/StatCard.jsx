import React from 'react';

const StatCard = ({ title, value, icon: Icon, variant, isCurrency = true }) => {
  let colors = {
    bg: 'bg-primary/10',
    text: 'text-primary',
    border: 'border-primary/20',
    shadow: 'shadow-[0_0_15px_rgba(59,130,246,0.15)]'
  };

  if (variant === 'green') {
    colors = {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      border: 'border-emerald-500/20',
      shadow: 'shadow-[0_0_15px_rgba(16,185,129,0.15)]'
    };
  } else if (variant === 'red') {
    colors = {
      bg: 'bg-red-500/10',
      text: 'text-red-400',
      border: 'border-red-500/20',
      shadow: 'shadow-[0_0_15px_rgba(239,68,68,0.15)]'
    };
  } else if (variant === 'blue') {
    colors = {
      bg: 'bg-primary/10',
      text: 'text-primary',
      border: 'border-primary/20',
      shadow: 'shadow-[0_0_15px_rgba(59,130,246,0.15)]'
    };
  }

  return (
    <div className={`card flex items-center justify-between border ${colors.border} ${colors.shadow} transition-transform duration-300 hover:-translate-y-1`}>
      <div>
        <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-white">
          {isCurrency ? 'PKR ' : ''}
          {value.toLocaleString(undefined, isCurrency ? { minimumFractionDigits: 2, maximumFractionDigits: 2 } : {})}
        </h3>
      </div>
      {Icon && (
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors.bg} ${colors.text}`}>
          <Icon size={24} />
        </div>
      )}
    </div>
  );
};

export default StatCard;
