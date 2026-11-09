import React from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

const ErrorState = ({ message, onRetry }) => {
  return (
    <div className="card flex flex-col items-center justify-center py-12 border-red-500/20 bg-red-500/5">
      <AlertTriangle size={48} className="text-red-400 mb-4" />
      <h3 className="text-xl font-bold text-white mb-2">Something went wrong</h3>
      <p className="text-gray-400 mb-6 text-center max-w-md">{message || 'Failed to load data. Please try again later.'}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-primary flex items-center gap-2">
          <RefreshCcw size={18} />
          <span>Retry</span>
        </button>
      )}
    </div>
  );
};

export default ErrorState;
