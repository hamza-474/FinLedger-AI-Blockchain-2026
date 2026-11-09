import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getDashboardData } from '../api/reportApi';
import StatCard from '../components/dashboard/StatCard';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ShieldCheck,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Activity,
  Zap,
  FileText,
  CheckCircle,
  XCircle,
  Clock
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

const DashboardPage = () => {
  const { user } = React.useContext(AuthContext);
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

  // Premium Chart configuration - Purple Cow Theme
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { color: '#e2e8f0', font: { family: 'Outfit, sans-serif', weight: '600' }, usePointStyle: true, boxWidth: 8 } },
      tooltip: { 
        mode: 'index', 
        intersect: false,
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#f8fafc',
        bodyColor: '#e2e8f0',
        borderColor: 'rgba(168, 85, 247, 0.3)',
        borderWidth: 1,
        padding: 16,
        boxPadding: 8,
        usePointStyle: true,
        cornerRadius: 16,
      }
    },
    scales: {
      y: { border: { display: false }, grid: { color: 'rgba(255, 255, 255, 0.03)', drawBorder: false }, ticks: { color: '#94a3b8', font: { family: 'Outfit' } } },
      x: { border: { display: false }, grid: { display: false }, ticks: { color: '#94a3b8', font: { family: 'Outfit' } } }
    },
    interaction: { mode: 'nearest', axis: 'x', intersect: false },
    elements: {
      point: { radius: 0, hitRadius: 10, hoverRadius: 8 },
      line: { tension: 0.5 }
    }
  };

  const chartData = {
    labels: data.monthlyTrend.map(d => {
      const date = new Date(`${d.month}-01T00:00:00.000Z`);
      return date.toLocaleString('default', { month: 'short' });
    }).reverse(),
    datasets: [
      {
        label: 'Income',
        data: data.monthlyTrend.map(d => d.income).reverse(),
        borderColor: '#a855f7', 
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, 'rgba(168, 85, 247, 0.5)');
          gradient.addColorStop(1, 'rgba(168, 85, 247, 0.0)');
          return gradient;
        },
        fill: true,
        borderWidth: 4,
      },
      {
        label: 'Expenses',
        data: data.monthlyTrend.map(d => d.expense).reverse(),
        borderColor: '#ec4899', 
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, 'rgba(236, 72, 153, 0.5)');
          gradient.addColorStop(1, 'rgba(236, 72, 153, 0.0)');
          return gradient;
        },
        fill: true,
        borderWidth: 4,
      }
    ]
  };

  return (
    <div className="relative min-h-screen pb-12 z-0">
      {/* Ambient Animated Background Globs */}
      <div className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse" style={{ animationDuration: '8s' }}></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-fuchsia-600/10 rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse" style={{ animationDuration: '12s' }}></div>

      <motion.div 
        className="space-y-8 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-4">
          <div>
            <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-100 to-purple-500 tracking-tight drop-shadow-sm">
              {user?.role === 'staff' ? 'My Performance' : 'Financial Overview'}
            </motion.h1>
            <motion.p variants={itemVariants} className="text-purple-200/50 mt-2 text-sm md:text-base font-semibold tracking-widest uppercase">
              {user?.role === 'staff' ? 'Staff Activity Dashboard' : 'Intelligent Enterprise Dashboard'}
            </motion.p>
          </div>
        </div>

        {/* TOP ROW: Stat Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {user?.role === 'staff' ? (
            <>
              <motion.div whileHover={{ y: -8 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} className="h-full">
                <StatCard
                  title="Total Entries Made"
                  value={data.staffStats?.totalEntries || 0}
                  icon={FileText}
                  variant="blue"
                  isCurrency={false}
                />
              </motion.div>
              <motion.div whileHover={{ y: -8 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} className="h-full">
                <StatCard
                  title="Pending Approval"
                  value={data.staffStats?.pending || 0}
                  icon={Clock}
                  variant="yellow"
                  isCurrency={false}
                />
              </motion.div>
              <motion.div whileHover={{ y: -8 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} className="h-full">
                <StatCard
                  title="Approved Entries"
                  value={data.staffStats?.approved || 0}
                  icon={CheckCircle}
                  variant="green"
                  isCurrency={false}
                />
              </motion.div>
            </>
          ) : (
            <>
              <motion.div whileHover={{ y: -8 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} className="h-full">
                <StatCard
                  title="Total Income (This Month)"
                  value={data.totalIncome}
                  icon={TrendingUp}
                  variant="green"
                />
              </motion.div>
              <motion.div whileHover={{ y: -8 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} className="h-full">
                <StatCard
                  title="Total Expenses (This Month)"
                  value={data.totalExpenses}
                  icon={TrendingDown}
                  variant="red"
                />
              </motion.div>
              <motion.div whileHover={{ y: -8 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} className="h-full">
                <StatCard
                  title="Current Balance"
                  value={data.balance}
                  icon={Wallet}
                  variant="blue"
                />
              </motion.div>
            </>
          )}
        </motion.div>

        {/* MIDDLE ROW: Chart & Budgets (Hidden for Staff) */}
        {user?.role === 'admin' && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <motion.div variants={itemVariants} className="xl:col-span-2 bg-gradient-to-br from-[#0b0f19]/90 to-[#131127]/90 backdrop-blur-3xl border border-white/[0.08] rounded-[2rem] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.3)] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-1000"></div>
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-purple-500/20 text-purple-400 rounded-2xl border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                  <Activity size={24} strokeWidth={2.5} />
                </div>
                <h3 className="text-2xl font-black text-white tracking-wide">Cashflow Trend</h3>
              </div>
              <div className="h-[360px] w-full">
                <Line options={chartOptions} data={chartData} />
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-gradient-to-br from-[#0b0f19]/90 to-[#131127]/90 backdrop-blur-3xl border border-white/[0.08] rounded-[2rem] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.3)] flex flex-col h-[480px] relative overflow-hidden group">
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-fuchsia-500/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-1000"></div>
              
              <div className="flex justify-between items-center mb-8 gap-2 relative z-10">
                <h3 className="text-2xl font-black text-white tracking-wide">Budgets</h3>
                <div className="relative">
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-300/50" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={budgetFilter}
                    onChange={(e) => setBudgetFilter(e.target.value)}
                    className="pl-11 pr-4 py-2.5 rounded-2xl bg-black/40 border border-white/10 text-sm text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 w-36 sm:w-48 transition-all placeholder:text-gray-500 shadow-inner"
                  />
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto scrollbar-thin pr-2 space-y-8 relative z-10">
                {filteredBudgets.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-gray-500 text-sm italic font-medium">No budgets found.</p>
                  </div>
                ) : (
                  filteredBudgets.map((budget, index) => {
                    let statusColor = 'from-purple-500 to-indigo-500';
                    let glowColor = 'shadow-purple-500/40';
                    let textColor = 'text-purple-300';
                    
                    if (budget.status === 'warning') {
                      statusColor = 'from-amber-400 to-orange-500';
                      glowColor = 'shadow-orange-500/40';
                      textColor = 'text-orange-300';
                    } else if (budget.status === 'exceeded') {
                      statusColor = 'from-rose-500 to-pink-500';
                      glowColor = 'shadow-rose-500/40';
                      textColor = 'text-rose-300';
                    }

                    return (
                      <motion.div 
                        key={index} 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="space-y-3 group/budget"
                      >
                        <div className="flex justify-between items-end">
                          <span className="text-sm font-bold text-gray-300 group-hover/budget:text-white transition-colors">{budget.category}</span>
                          <span className={`text-base font-black ${textColor}`}>{budget.percentUsed}%</span>
                        </div>
                        <div className="w-full bg-black/50 rounded-full h-3 shadow-inner overflow-hidden border border-white/5 relative">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(budget.percentUsed, 100)}%` }}
                            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 + (index * 0.1) }}
                            className={`h-full rounded-full bg-gradient-to-r ${statusColor} shadow-[0_0_15px_rgba(0,0,0,0)] group-hover/budget:${glowColor} transition-all duration-300 relative`}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-full h-full animate-[shimmer_2s_infinite]"></div>
                          </motion.div>
                        </div>
                        <div className="flex justify-between text-[11px] font-bold tracking-wider uppercase text-gray-500">
                          <span>PKR {budget.spentAmount.toLocaleString()} spent</span>
                          <span>PKR {budget.limitAmount.toLocaleString()} limit</span>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* BOTTOM ROW: Recent Transactions & Blockchain Status */}
        <div className={`grid grid-cols-1 ${user?.role === 'admin' ? 'xl:grid-cols-3' : ''} gap-8`}>
          <motion.div variants={itemVariants} className={`${user?.role === 'admin' ? 'xl:col-span-2' : ''} bg-gradient-to-br from-[#0b0f19]/90 to-[#131127]/90 backdrop-blur-3xl border border-white/[0.08] rounded-[2rem] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.3)] relative overflow-hidden group`}>
            <h3 className="text-2xl font-black text-white mb-8 tracking-wide">Recent Transactions</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-[11px] uppercase tracking-widest text-gray-500 font-bold">
                    <th className="pb-5 pl-4">Title</th>
                    <th className="pb-5">Category</th>
                    <th className="pb-5">Date</th>
                    <th className="pb-5 text-right pr-4">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentTransactions.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="py-12 text-center text-gray-500 text-sm italic font-medium">No recent transactions</td>
                    </tr>
                  ) : (
                    data.recentTransactions.map((tx, idx) => (
                      <motion.tr 
                        key={tx._id} 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + (idx * 0.05) }}
                        className="border-b border-white/[0.03] hover:bg-white/[0.03] transition-colors group/row"
                      >
                        <td className="py-5 pl-4 text-sm text-gray-300 font-bold group-hover/row:text-white transition-colors flex items-center gap-3">
                           {tx.type === 'income' ? <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div> : <div className="w-2 h-2 rounded-full bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.8)]"></div>}
                           {tx.title}
                        </td>
                        <td className="py-5 text-sm">
                          <span className="px-4 py-1.5 rounded-full bg-black/40 border border-white/5 text-xs font-bold tracking-wide text-purple-200/70 group-hover/row:border-purple-500/30 group-hover/row:text-purple-200 transition-all">
                            {tx.category}
                          </span>
                        </td>
                        <td className="py-5 text-sm text-gray-500 font-semibold tracking-wide">
                          {new Date(tx.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="py-5 pr-4 text-sm font-black text-right">
                          {tx.type === 'income' ? (
                            <span className="text-emerald-400 flex items-center justify-end gap-2">
                              <span className="bg-emerald-400/10 p-1 rounded-md border border-emerald-400/20"><ArrowUpRight size={14} strokeWidth={3} /></span> 
                              PKR {tx.amount.toLocaleString()}
                            </span>
                          ) : (
                            <span className="text-rose-400 flex items-center justify-end gap-2">
                              <span className="bg-rose-400/10 p-1 rounded-md border border-rose-400/20"><ArrowDownRight size={14} strokeWidth={3} /></span> 
                              PKR {tx.amount.toLocaleString()}
                            </span>
                          )}
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>

          {user?.role === 'admin' && (
            <motion.div variants={itemVariants} className="bg-gradient-to-br from-[#0b0f19]/90 to-[#131127]/90 backdrop-blur-3xl border border-white/[0.08] rounded-[2rem] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.3)] flex flex-col justify-center items-center text-center relative overflow-hidden group">
              {/* Animated Reactor Core Background */}
              <div className={`absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity duration-1000 ${data.blockchainStatus === 'valid' ? 'bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/20 via-transparent to-transparent' : 'bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-rose-600/30 via-transparent to-transparent'}`}></div>
              
              <motion.div 
                animate={{ scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className={`relative z-10 w-32 h-32 rounded-[2rem] flex items-center justify-center mb-8 shadow-2xl backdrop-blur-xl border ${data.blockchainStatus === 'valid'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.3)]'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/30 shadow-[0_0_40px_rgba(244,63,94,0.4)]'
                }`}
              >
                {data.blockchainStatus === 'valid' ? <Zap size={56} strokeWidth={2} /> : <ShieldAlert size={56} strokeWidth={2} />}
                <div className={`absolute inset-0 rounded-[2rem] border-2 ${data.blockchainStatus === 'valid' ? 'border-emerald-400/50' : 'border-rose-400/50'} animate-ping opacity-20`}></div>
              </motion.div>
              
              <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 mb-3 tracking-tight relative z-10">System Status</h3>

              <div className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 mt-4 space-y-5 relative z-10 shadow-inner">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">Integrity</span>
                  <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border shadow-lg ${data.blockchainStatus === 'valid' ? 'text-emerald-300 bg-emerald-500/20 border-emerald-500/30 shadow-emerald-500/20' : 'text-rose-300 bg-rose-500/20 border-rose-500/30 shadow-rose-500/20 animate-pulse'}`}>
                    {data.blockchainStatus === 'valid' ? 'Secured' : 'Compromised'}
                  </span>
                </div>

                <div className="pt-5 border-t border-white/10">
                  <p className="text-[13px] text-gray-400 text-left leading-relaxed font-semibold">
                    Data is immutably secured by continuous <span className="text-purple-300 font-bold">SHA-256</span> hashing on a distributed runtime network.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardPage;
