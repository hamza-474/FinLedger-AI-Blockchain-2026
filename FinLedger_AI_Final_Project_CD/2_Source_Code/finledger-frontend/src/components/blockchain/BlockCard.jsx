import React, { useState } from 'react';
import { Box, ChevronDown, ChevronUp, Clock, Hash, Lock, Database } from 'lucide-react';

const BlockCard = ({ block }) => {
  const [expanded, setExpanded] = useState(false);
  const isGenesis = block.index === 0;

  const truncateHash = (hash, length = 16) => {
    if (!hash) return '';
    return hash.substring(0, length) + '...';
  };

  const getTransactionInfo = () => {
    if (isGenesis) return { title: 'Genesis Block Data', amount: null };

    // Check if data is a string (Genesis block) or an object (transaction)
    if (typeof block.data === 'string') {
      return { title: block.data, amount: null };
    }

    return {
      title: block.data.title || 'Unknown Transaction',
      amount: block.data.amount,
      type: block.data.type
    };
  };

  const txInfo = getTransactionInfo();

  return (
    <div
      className={`min-w-full lg:min-w-[320px] max-w-[320px] card transition-all duration-300 border-2 shrink-0 ${isGenesis ? 'border-yellow-500/50 shadow-[0_0_20px_rgba(234,179,8,0.15)]' : 'border-accent/40 shadow-[0_0_15px_rgba(99,102,241,0.15)]'
        }`}
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg ${isGenesis ? 'bg-yellow-500/20 text-yellow-500' : 'bg-accent/20 text-accent'}`}>
            <Box size={20} />
          </div>
          <div>
            <h3 className={`font-bold ${isGenesis ? 'text-yellow-500' : 'text-accent'}`}>
              Block #{block.index}
            </h3>
            {isGenesis && <span className="text-[10px] font-bold text-yellow-600 bg-yellow-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider">Genesis</span>}
          </div>
        </div>
        <div className="text-xs text-gray-500 flex items-center gap-1 bg-dark-bg px-2 py-1 rounded border border-dark-border">
          <Clock size={12} />
          {new Date(block.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="bg-dark-bg p-3 rounded-lg border border-dark-border">
          <div className="flex items-start gap-2 mb-1">
            <Database size={14} className="text-gray-400 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{txInfo.title}</p>
              {txInfo.amount && (
                <p className={`text-sm font-bold ${txInfo.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
                  PKR {txInfo.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-1.5 bg-dark-bg/50 p-3 rounded-lg border border-dark-border/50">
          <div className="flex gap-2 items-center text-xs">
            <Hash size={14} className="text-gray-400 shrink-0" />
            <span className="text-gray-500 w-12 shrink-0">Hash:</span>
            <span className="text-gray-300 font-mono truncate">{truncateHash(block.hash)}</span>
          </div>
          <div className="flex gap-2 items-center text-xs">
            <Lock size={14} className="text-gray-400 shrink-0" />
            <span className="text-gray-500 w-12 shrink-0">Prev:</span>
            <span className="text-gray-300 font-mono truncate">{truncateHash(block.previousHash)}</span>
          </div>
        </div>
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-center gap-1 text-xs font-medium text-gray-400 hover:text-white hover:bg-dark-bg py-2 rounded transition-colors"
      >
        {expanded ? (
          <><ChevronUp size={14} /> Hide Details</>
        ) : (
          <><ChevronDown size={14} /> View Full Details</>
        )}
      </button>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-dark-border/50 text-[11px] font-mono break-all space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div>
            <p className="text-gray-500 mb-1 uppercase tracking-wide">Full Hash</p>
            <p className="text-emerald-400 bg-emerald-400/10 p-2 rounded border border-emerald-400/20">{block.hash}</p>
          </div>
          <div>
            <p className="text-gray-500 mb-1 uppercase tracking-wide">Full Previous Hash</p>
            <p className="text-blue-400 bg-blue-400/10 p-2 rounded border border-blue-400/20">{block.previousHash}</p>
          </div>
          <div>
            <p className="text-gray-500 mb-1 uppercase tracking-wide">Raw Data Payload</p>
            <pre className="text-gray-300 bg-dark-bg p-2 rounded border border-dark-border whitespace-pre-wrap">
              {JSON.stringify(block.data, null, 2)}
            </pre>
          </div>
          <div>
            <p className="text-gray-500 mb-1 uppercase tracking-wide">Exact Timestamp</p>
            <p className="text-gray-300 bg-dark-bg p-2 rounded border border-dark-border">{new Date(block.timestamp).toISOString()}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlockCard;
