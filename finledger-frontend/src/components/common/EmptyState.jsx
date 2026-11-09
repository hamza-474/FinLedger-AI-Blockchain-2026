import React from 'react';

const EmptyState = ({ icon: Icon, title, message, actionText, onAction, actionIcon: ActionIcon }) => {
  return (
    <div className="card flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-500 border border-dark-border/50 bg-dark-bg/30">
      {Icon && <div className="p-5 bg-dark-bg border border-dark-border rounded-full mb-6 shadow-inner shadow-black">
        <Icon size={48} className="text-gray-500 opacity-50" />
      </div>}
      <h3 className="text-2xl font-black text-white mb-3 tracking-wide">{title}</h3>
      <p className="text-gray-400 max-w-sm mb-8 leading-relaxed font-medium">
        {message}
      </p>
      {actionText && onAction && (
        <button onClick={onAction} className="btn-primary flex items-center gap-3 px-8 py-3.5 font-bold text-lg shadow-lg shadow-accent/20">
          {ActionIcon && <ActionIcon size={20} />} {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
