import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getDashboardData } from '../api/reportApi';
import StatCard from '../components/dashboard/StatCard';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ShieldCheck,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const DashboardPage = () => {
  const [budgetFilter, setBudgetFilter] = useState('');

  const { data: response, isLoading, error, refetch } = useQuery({
    queryKey: ['dashboard'],
    queryFn: getDashboardData
  });

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState message={error.message} onRetry={refetch} />;

  const data = response?.data;
  if (!data) return <ErrorState message="No data available" onRetry={refetch} />;

  const filteredBudgets = data.budgetStatus.filter(b => 
    b.category.toLowerCase().includes(budgetFilter.toLowerCase())
  );

  // Chart configuration
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { color: '#94a3b8' } },
      tooltip: { mode: 'index', intersect: false }
    },
    scales: {
      y: { border: { display: false }, grid: { color: '#334155' }, ticks: { color: '#94a3b8' } },
      x: { border: { display: false }, grid: { display: false }, ticks: { color: '#94a3b8' } }
    },
    interaction: { mode: 'nearest', axis: 'x', intersect: false }
  };

  const chartData = {
    labels: data.monthlyTrend.map(d => {
      const date = new Date(`${d.month}-01T00:00:00.000Z`);
      return date.toLocaleString('default', { month: 'short' });
    }).reverse(), // Reverse to show chronological order left to right
    datasets: [
      {
        label: 'Income',
        data: data.monthlyTrend.map(d => d.income).reverse(),
        borderColor: '#3b82f6', // primary
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Expenses',
        data: data.monthlyTrend.map(d => d.expense).reverse(),
        borderColor: '#ef4444', // red
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  return (
    <div className="space-y-6">
      {/* TOP ROW: Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Income (This Month)"
          value={data.totalIncome}
          icon={TrendingUp}
          variant="green"
        />
        <StatCard
          title="Total Expenses (This Month)"
          value={data.totalExpenses}
          icon={TrendingDown}
          variant="red"
        />
        <StatCard
          title="Current Balance"
          value={data.balance}
          icon={Wallet}
          variant={data.balance >= 0 ? "blue" : "red"}
        />
      </div>

      {/* MIDDLE ROW: Chart & Budgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card lg:col-span-2 flex flex-col h-[400px]">
          <h3 className="text-lg font-bold text-white mb-6">Income vs Expenses (Last 6 Months)</h3>
          <div className="flex-1 h-full min-h-0 relative">
            <Line options={chartOptions} data={chartData} />
          </div>
        </div>

        <div className="card flex flex-col h-[400px]">
          <div className="flex justify-between items-center mb-6 gap-2">
            <h3 className="text-lg font-bold text-white">Budget Status</h3>
            <input
              type="text"
              placeholder="Filter..."
              value={budgetFilter}
              onChange={(e) => setBudgetFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-dark-bg border border-dark-border text-sm text-white focus:outline-none focus:border-primary w-28 sm:w-32 transition-colors"
            />
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-thin pr-1 space-y-5 budget-scroll">
            {filteredBudgets.length === 0 ? (
              <p className="text-gray-400 text-sm">No budgets found.</p>
            ) : (
              filteredBudgets.map((budget, index) => {
                let statusColor = 'bg-primary';
                let textColor = 'text-primary';
                if (budget.status === 'warning') {
                  statusColor = 'bg-yellow-500';
                  textColor = 'text-yellow-500';
                } else if (budget.status === 'exceeded') {
                  statusColor = 'bg-red-500';
                  textColor = 'text-red-500';
                }

                return (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-end">
                      <span className="text-sm font-medium text-white">{budget.category}</span>
                      <span className={`text-xs font-bold ${textColor}`}>{budget.percentUsed}%</span>
                    </div>
                    <div className="w-full bg-dark-bg rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${statusColor}`}
                        style={{ width: `${Math.min(budget.percentUsed, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>PKR {budget.spentAmount.toLocaleString()} spent</span>
                      <span>PKR {budget.limitAmount.toLocaleString()} limit</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* BOTTOM ROW: Recent Transactions & Blockchain Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card lg:col-span-2">
          <h3 className="text-lg font-bold text-white mb-4">Recent Transactions</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-dark-border text-sm text-gray-400">
                  <th className="pb-3 font-medium">Title</th>
                  <th className="pb-3 font-medium">Category</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {data.recentTransactions.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-4 text-center text-gray-400 text-sm">No recent transactions</td>
                  </tr>
                ) : (
                  data.recentTransactions.map((tx) => (
                    <tr key={tx._id} className="border-b border-dark-border/50 hover:bg-dark-border/10 transition-colors">
                      <td className="py-3 text-sm text-white font-medium">{tx.title}</td>
                      <td className="py-3 text-sm text-gray-400">
                        <span className="px-2.5 py-1 rounded-full bg-dark-bg border border-dark-border text-xs">
                          {tx.category}
                        </span>
                      </td>
                      <td className="py-3 text-sm text-gray-400">
                        {new Date(tx.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </td>
                      <td className="py-3 text-sm font-bold text-right">
                        {tx.type === 'income' ? (
                          <span className="text-emerald-400 flex items-center justify-end gap-1">
                            <ArrowUpRight size={14} /> +PKR {tx.amount.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-red-400 flex items-center justify-end gap-1">
                            <ArrowDownRight size={14} /> -PKR {tx.amount.toLocaleString()}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card flex flex-col justify-center items-center text-center">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-lg ${data.blockchainStatus === 'valid'
              ? 'bg-emerald-500/10 text-emerald-400 shadow-emerald-500/20'
              : 'bg-red-500/10 text-red-400 shadow-red-500/20'
            }`}>
            {data.blockchainStatus === 'valid' ? <ShieldCheck size={32} /> : <ShieldAlert size={32} />}
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Blockchain Status</h3>

          <div className="w-full bg-dark-bg border border-dark-border rounded-lg p-4 mt-4 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Ledger Integrity:</span>
              <span className={`font-medium ${data.blockchainStatus === 'valid' ? 'text-emerald-400' : 'text-red-400'}`}>
                {data.blockchainStatus === 'valid' ? '✅ Valid' : '⚠️ Tampered'}
              </span>
            </div>

            <div className="pt-2 border-t border-dark-border/50">
              <p className="text-xs text-gray-500 mt-2 text-left leading-relaxed">
                All financial data mapped in this dashboard is immutably secured by continuous SHA-256 cryptographic hashing validation on our JS runtime network.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
