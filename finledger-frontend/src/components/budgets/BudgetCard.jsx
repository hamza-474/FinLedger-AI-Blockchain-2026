import React, { useContext } from 'react';
import { Pencil, Trash2, Briefcase, Home, Monitor, DollarSign, Zap, Code, HelpCircle } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

const getCategoryIcon = (category) => {
  switch (category) {
    case 'Salary': return <Briefcase size={20} />;
    case 'Rent': return <Home size={20} />;
    case 'Equipment': return <Monitor size={20} />;
    case 'Revenue': return <DollarSign size={20} />;
    case 'Utilities': return <Zap size={20} />;
    case 'Software': return <Code size={20} />;
    default: return <HelpCircle size={20} />;
  }
};

const BudgetCard = ({ budget, onEdit, onDelete }) => {
  const { user } = useContext(AuthContext);
  const percentUsed = budget.percentUsed || (budget.spentAmount / budget.limitAmount) * 100;

  let statusColor = 'bg-emerald-500';
  let badgeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  let statusText = 'Within Limit';

  if (budget.status === 'warning') {
    statusColor = 'bg-yellow-500';
    badgeColor = 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
    statusText = '⚠ Warning';
  } else if (budget.status === 'exceeded') {
    statusColor = 'bg-red-500';
    badgeColor = 'bg-red-500/10 text-red-400 border-red-500/20';
    statusText = '🚨 Exceeded';
  }

  return (
    <div className="card hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-dark-bg border border-dark-border flex items-center justify-center text-primary">
            {getCategoryIcon(budget.category)}
          </div>
          <div>
            <h3 className="font-bold text-white text-lg">{budget.category}</h3>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${badgeColor}`}>
              {statusText}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {user?.role === 'admin' && (
            <>
              <button
                onClick={() => onEdit(budget)}
                className="p-1.5 text-gray-400 hover:text-white bg-dark-bg rounded-md transition-colors"
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={() => onDelete(budget._id)}
                className="p-1.5 text-gray-400 hover:text-red-400 bg-dark-bg rounded-md transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Budget Limit</span>
          <span className="font-bold text-white">PKR {budget.limitAmount.toLocaleString()}</span>
        </div>

        <div className="w-full bg-dark-bg rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${statusColor}`}
            style={{ width: `${Math.min(percentUsed, 100)}%` }}
          ></div>
        </div>

        <div className="flex justify-between text-sm border-t border-dark-border/50 pt-3">
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Amount Spent</p>
            <p className="font-bold text-white">PKR {budget.spentAmount.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 mb-0.5">Remaining</p>
            <p className={`font-bold ${budget.status === 'exceeded' ? 'text-red-400' : 'text-emerald-400'}`}>
              PKR {Math.max(budget.limitAmount - budget.spentAmount, 0).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetCard;
