import React from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, isConfirming }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-dark-card border border-dark-border rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex items-start gap-4 mb-2">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20 shrink-0">
              <AlertTriangle size={24} className="text-red-500" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-wide mb-2 pt-2">{title}</h2>
              <p className="text-gray-400 leading-relaxed font-medium">
                {message}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-dark-bg/80 px-6 py-4 border-t border-dark-border flex justify-end gap-3">
          <button 
            onClick={onCancel}
            disabled={isConfirming}
            className="px-6 py-2.5 rounded-xl text-[15px] font-bold text-gray-400 hover:text-white hover:bg-dark-border/50 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            disabled={isConfirming}
            className="px-6 py-2.5 rounded-xl text-[15px] font-bold bg-red-500 text-white hover:bg-red-600 shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all flex items-center justify-center min-w-[120px]"
          >
            {isConfirming ? <Loader2 size={18} className="animate-spin" /> : 'Yes, Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
