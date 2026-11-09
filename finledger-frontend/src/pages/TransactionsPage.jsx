import React, { useState, useContext, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTransactions, getSummary, deleteTransaction, approveTransaction, rejectTransaction } from '../api/transactionApi';
import { AuthContext } from '../context/AuthContext';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';
import ConfirmModal from '../components/common/ConfirmModal';
import AddTransactionModal from '../components/transactions/AddTransactionModal';
import EditTransactionModal from '../components/transactions/EditTransactionModal';
import useTitle from '../hooks/useTitle';
import toast from 'react-hot-toast';
import {
  Plus,
  Search,
  FilterX,
  Pencil,
  Trash2,
  Copy,
  ArrowUpRight,
  ArrowDownRight,
  Receipt,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Paperclip
} from 'lucide-react';

const categories = ['Salary', 'Rent', 'Equipment', 'Revenue', 'Utilities', 'Software', 'Other'];

const TransactionsPage = () => {
  useTitle('Transactions Ledger');

  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();

  // Filters state
  const [filters, setFilters] = useState({ type: '', category: '', month: '' });
  const [search, setSearch] = useState('');

  // Pagination
  const [page, setPage] = useState(1);
  const limit = 10;

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingTx, setEditingTx] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, id: null });

  const { data: txResponse, isLoading: isLoadingTx, error: errorTx, refetch: refetchTx } = useQuery({
    queryKey: ['transactions', filters],
    queryFn: () => getTransactions(filters)
  });

  const { data: summaryResponse } = useQuery({
    queryKey: ['summary', filters.month],
    queryFn: () => getSummary(filters.month)
  });

  const handleDelete = async (id) => {
    // Show confirm dialog first
    const confirmed = window.confirm(
      'Are you sure you want to delete this transaction? This cannot be undone.'
    );
    if (!confirmed) return;
    
    try {
      await deleteTransaction(id);
      toast.success('Transaction deleted successfully');
      queryClient.invalidateQueries(['transactions']);
      queryClient.invalidateQueries(['summary']);
      queryClient.invalidateQueries(['dashboard']);
      refetchTx();
    } catch (error) {
      toast.error('Failed to delete transaction');
    }
  };

  const approveMutation = useMutation({
    mutationFn: (id) => approveTransaction(id),
    onSuccess: () => {
      toast.success('Transaction approved and added to blockchain');
      queryClient.invalidateQueries(['transactions']);
      queryClient.invalidateQueries(['summary']);
      queryClient.invalidateQueries(['dashboard']);
      refetchTx();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to approve transaction');
    }
  });

  const rejectMutation = useMutation({
    mutationFn: (id) => rejectTransaction(id),
    onSuccess: () => {
      toast.success('Transaction rejected');
      queryClient.invalidateQueries(['transactions']);
      refetchTx();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to reject transaction');
    }
  });

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Hash copied to clipboard!');
  };

  // Filter local search and paginate
  const filteredTransactions = useMemo(() => {
    if (!txResponse?.data) return [];
    let result = txResponse.data;
    if (search) {
      result = result.filter(tx => tx.title.toLowerCase().includes(search.toLowerCase()));
    }
    return result;
  }, [txResponse, search]);

  const totalPages = Math.ceil(filteredTransactions.length / limit);
  const paginatedTransactions = filteredTransactions.slice((page - 1) * limit, page * limit);

  if (isLoadingTx) return <LoadingState />;
  if (errorTx) return <ErrorState message={errorTx.message} onRetry={refetchTx} />;

  const summary = summaryResponse?.data || { totalIncome: 0, totalExpenses: 0, balance: 0 };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-white">Transactions Ledger</h1>
        <button
          onClick={() => setIsAddOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          <span>New Transaction</span>
        </button>
      </div>

      {/* Summary Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card py-4 flex items-center justify-between bg-dark-bg/50 border-dark-border">
          <span className="text-gray-400 font-medium">Total Income</span>
          <span className="text-xl font-bold text-emerald-400">+PKR {summary.totalIncome.toLocaleString()}</span>
        </div>
        <div className="card py-4 flex items-center justify-between bg-dark-bg/50 border-dark-border">
          <span className="text-gray-400 font-medium">Total Expenses</span>
          <span className="text-xl font-bold text-red-400">-PKR {summary.totalExpenses.toLocaleString()}</span>
        </div>
        <div className="card py-4 flex items-center justify-between bg-dark-bg/50 border-dark-border">
          <span className="text-gray-400 font-medium">Net Balance</span>
          <span className={`text-xl font-bold ${summary.balance >= 0 ? 'text-primary' : 'text-red-400'}`}>
            PKR {summary.balance.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="card p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            className="input w-auto text-sm py-1.5"
            value={filters.type}
            onChange={(e) => { setFilters({ ...filters, type: e.target.value }); setPage(1); }}
          >
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <select
            className="input w-auto text-sm py-1.5"
            value={filters.category}
            onChange={(e) => { setFilters({ ...filters, category: e.target.value }); setPage(1); }}
          >
            <option value="">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <input
            type="month"
            className="input w-auto text-sm py-1.5 text-gray-400"
            value={filters.month}
            onChange={(e) => { setFilters({ ...filters, month: e.target.value }); setPage(1); }}
          />

          {(filters.type || filters.category || filters.month || search) && (
            <button
              onClick={() => { setFilters({ type: '', category: '', month: '' }); setSearch(''); setPage(1); }}
              className="text-gray-400 hover:text-white flex items-center gap-1 text-sm transition-colors"
            >
              <FilterX size={16} /> Clear
            </button>
          )}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Search title..."
            className="input pl-10 py-1.5 text-sm"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
      </div>

      {/* Transactions Table */}
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-dark-bg/50 border-b border-dark-border text-xs uppercase tracking-wider text-gray-400">
                <th className="px-6 py-4 font-semibold">#</th>
                <th className="px-6 py-4 font-semibold">Title</th>
                <th className="px-6 py-4 font-semibold text-right">Amount</th>
                <th className="px-6 py-4 font-semibold">Type</th>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Blockchain Hash</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {paginatedTransactions.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-0 border-none">
                    <EmptyState
                      icon={Receipt}
                      title="No transactions found"
                      message={search || filters.type || filters.category || filters.month ? "No transactions match your current filters." : "No transactions yet. Add your first one! ➕"}
                    />
                  </td>
                </tr>
              ) : (
                paginatedTransactions.map((tx, index) => (
                  <tr key={tx._id} className="hover:bg-dark-bg/30 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {(page - 1) * limit + index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-white">{tx.title}</p>
                        {tx.isDuplicate && (
                          <span title="Duplicate Title Detected: Another transaction has the same title" className="text-orange-400">
                            <AlertTriangle size={14} />
                          </span>
                        )}
                      </div>
                      {tx.description && <p className="text-xs text-gray-500 truncate max-w-[200px]">{tx.description}</p>}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-right">
                      {tx.type === 'income' ? (
                        <span className="text-emerald-400 flex items-center justify-end gap-1">
                          <ArrowUpRight size={14} /> +PKR {tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                      ) : (
                        <span className="text-red-400 flex items-center justify-end gap-1">
                          <ArrowDownRight size={14} /> -PKR {tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1.5 items-start">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${tx.type === 'income'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-red-500/10 text-red-400 border-red-500/20'
                          }`}>
                          {tx.type === 'income' ? 'Income' : 'Expense'}
                        </span>
                        {tx.isReimbursement && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 uppercase tracking-wider">
                            Reimbursement
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full bg-dark-bg border border-dark-border text-xs text-gray-300 mb-1 inline-block">
                        {tx.category}
                      </span>
                      {tx.receiptUrl && (
                        <div className="mt-1">
                          <a href={tx.receiptUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[11px] text-accent hover:text-accent/80 transition-colors font-medium">
                            <Paperclip size={12} /> View Receipt
                          </a>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {(!tx.status || tx.status === 'approved') && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1 w-max">
                          <CheckCircle size={12} /> Approved
                        </span>
                      )}
                      {tx.status === 'pending' && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-orange-500/10 text-orange-400 border border-orange-500/20 flex items-center gap-1 w-max">
                          <Clock size={12} /> Pending
                        </span>
                      )}
                      {tx.status === 'rejected' && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20 flex items-center gap-1 w-max">
                          <XCircle size={12} /> Rejected
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {new Date(tx.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 font-mono">
                      <div className="flex items-center gap-2">
                        {tx.blockHash ? `${tx.blockHash.substring(0, 10)}...` : 'Pending...'}
                        {tx.blockHash && (
                          <button
                            onClick={() => copyToClipboard(tx.blockHash)}
                            className="text-gray-500 hover:text-accent transition-colors"
                            title="Copy full hash"
                          >
                            <Copy size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => setEditingTx(tx)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                          title="Edit transaction"
                        >
                          <Pencil size={18} />
                        </button>
                        {user?.role === 'admin' && tx.status === 'pending' && (
                          <>
                            <button
                              onClick={() => approveMutation.mutate(tx._id)}
                              disabled={approveMutation.isPending}
                              className="p-2 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 rounded-lg transition-all"
                              title="Approve Transaction"
                            >
                              <CheckCircle size={18} />
                            </button>
                            <button
                              onClick={() => rejectMutation.mutate(tx._id)}
                              disabled={rejectMutation.isPending}
                              className="p-2 text-orange-400 hover:text-orange-300 hover:bg-orange-500/10 rounded-lg transition-all"
                              title="Reject Transaction"
                            >
                              <XCircle size={18} />
                            </button>
                          </>
                        )}
                        {user?.role === 'admin' && (
                          <button
                            onClick={() => handleDelete(tx._id)}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all"
                            title="Delete transaction"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-dark-border flex items-center justify-between">
            <span className="text-sm text-gray-400">
              Showing {(page - 1) * limit + 1} to {Math.min(page * limit, filteredTransactions.length)} of {filteredTransactions.length} entries
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 rounded-md bg-dark-bg border border-dark-border text-sm disabled:opacity-50 hover:bg-dark-border/50 transition-colors"
              >
                Prev
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 rounded-md bg-dark-bg border border-dark-border text-sm disabled:opacity-50 hover:bg-dark-border/50 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <AddTransactionModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
      <EditTransactionModal isOpen={!!editingTx} onClose={() => setEditingTx(null)} transaction={editingTx} />
    </div>
  );
};

export default TransactionsPage;
