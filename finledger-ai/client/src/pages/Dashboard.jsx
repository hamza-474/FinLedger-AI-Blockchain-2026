import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../api/axios';
import { formatCurrency, formatDate } from '../utils/formatters';
import Skeleton from '../components/Skeleton';
import AIInsightCard from '../components/AIInsightCard';
import MonthlyBarChart from '../components/charts/MonthlyBarChart';
import CategoryPieChart from '../components/charts/CategoryPieChart';
import { ArrowUpRight, ArrowDownRight, Wallet, ArrowRight } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await api.get('/transactions/summary');
        setData(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  const SummaryCard = ({ title, amount, change, type }) => {
    const isPositive = change >= 0;
    const Icon = type === 'income' ? ArrowUpRight : type === 'expense' ? ArrowDownRight : Wallet;
    const colorClass = type === 'income' ? 'text-green-600' : type === 'expense' ? 'text-red-600' : 'text-blue-600';
    const bgClass = type === 'income' ? 'bg-green-100' : type === 'expense' ? 'bg-red-100' : 'bg-blue-100';

    return (
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            {loading ? (
              <Skeleton className="mt-2 h-8 w-32" />
            ) : (
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {formatCurrency(amount, user?.currency)}
              </p>
            )}
          </div>
          <div className={`flex h-12 w-12 items-center justify-center rounded-full ${bgClass}`}>
            <Icon size={24} className={colorClass} />
          </div>
        </div>
        {!loading && change !== undefined && (
          <div className="mt-4 flex items-center text-sm">
            <span className={`font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? '+' : ''}{change.toFixed(1)}%
            </span>
            <span className="ml-2 text-gray-500">vs last month</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-500">Welcome back, {user?.name}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <SummaryCard 
          title="Total Income" 
          amount={data?.totalIncome || 0} 
          change={data?.monthOverMonthChange?.income}
          type="income" 
        />
        <SummaryCard 
          title="Total Expenses" 
          amount={data?.totalExpenses || 0} 
          change={data?.monthOverMonthChange?.expenses}
          type="expense" 
        />
        <SummaryCard 
          title="Current Balance" 
          amount={data?.balance || 0} 
          type="balance" 
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Chart */}
        <div className="rounded-xl border bg-white p-6 shadow-sm lg:col-span-2">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Cash Flow</h3>
          {loading ? (
            <Skeleton className="h-72 w-full" />
          ) : (
            <MonthlyBarChart data={data?.chartData || []} currency={user?.currency} />
          )}
        </div>

        {/* AI Insight */}
        <div className="lg:col-span-1">
          <AIInsightCard />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Transactions */}
        <div className="rounded-xl border bg-white shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between border-b p-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
            <Link to="/transactions" className="flex items-center text-sm font-medium text-purple-600 hover:text-purple-700">
              View all <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          <div className="p-0">
            {loading ? (
              <div className="p-6 space-y-4">
                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
              </div>
            ) : data?.recentTransactions?.length > 0 ? (
              <ul className="divide-y">
                {data.recentTransactions.map((tx) => (
                  <li key={tx._id} className="flex items-center justify-between p-4 hover:bg-gray-50 sm:p-6">
                    <div className="flex items-center space-x-4">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        tx.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                      }`}>
                        {tx.type === 'income' ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{tx.category}</p>
                        <p className="text-sm text-gray-500">{tx.note || formatDate(tx.date)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${tx.type === 'income' ? 'text-green-600' : 'text-gray-900'}`}>
                        {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount, tx.currency || user?.currency)}
                      </p>
                      <p className="text-xs text-gray-500">{formatDate(tx.date)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-8 text-center text-gray-500">
                No recent transactions found.
              </div>
            )}
          </div>
        </div>

        {/* Expenses by Category */}
        <div className="rounded-xl border bg-white p-6 shadow-sm lg:col-span-1">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Expenses by Category</h3>
          {loading ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <CategoryPieChart data={data?.categoryBreakdown || []} currency={user?.currency} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
