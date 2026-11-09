import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBudgetStatus, deleteBudget } from '../api/budgetApi';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import BudgetCard from '../components/budgets/BudgetCard';
import AddBudgetModal from '../components/budgets/AddBudgetModal';
import StatCard from '../components/dashboard/StatCard';
import EmptyState from '../components/common/EmptyState';
import ConfirmModal from '../components/common/ConfirmModal';
import useTitle from '../hooks/useTitle';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import { Plus, LayoutGrid, AlertOctagon, CheckCircle2 } from 'lucide-react';

const BudgetsPage = () => {
  useTitle('Budget Management');

  useTitle('Budget Management');

  const { user } = React.useContext(AuthContext);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [modalState, setModalState] = useState({ isOpen: false, budget: null });
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, id: null });
  const queryClient = useQueryClient();

  const { data: response, isLoading, error, refetch } = useQuery({
    queryKey: ['budgets', selectedMonth],
    queryFn: () => getBudgetStatus(selectedMonth)
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBudget,
    onSuccess: () => {
      queryClient.invalidateQueries(['budgets']);
      toast.success('Budget deleted successfully');
      setDeleteConfirm({ isOpen: false, id: null });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete budget');
    }
  });

  const handleDelete = (id) => {
    setDeleteConfirm({ isOpen: true, id });
  };

  const confirmDelete = () => {
    deleteMutation.mutate(deleteConfirm.id);
  };

  const openAddModal = () => setModalState({ isOpen: true, budget: null });
  const openEditModal = (budget) => setModalState({ isOpen: true, budget });
  const closeModal = () => setModalState({ isOpen: false, budget: null });

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState message={error.message} onRetry={refetch} />;

  const budgets = response?.data || [];

  // Calculate summaries
  const totalBudgets = budgets.length;
  const exceededBudgets = budgets.filter(b => b.status === 'exceeded').length;
  const onTrackBudgets = budgets.filter(b => b.status === 'within_limit').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-white">Budget Management</h1>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <input
            type="month"
            className="input w-auto text-sm"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          />
          {user?.role === 'admin' && (
            <button
              onClick={openAddModal}
              className="btn-primary flex items-center gap-2"
            >
              <Plus size={20} />
              <span>Set Budget</span>
            </button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Categories Monitored"
          value={totalBudgets}
          icon={LayoutGrid}
          variant="blue"
          isCurrency={false}
        />
        <StatCard
          title="Budgets Exceeded"
          value={exceededBudgets}
          icon={AlertOctagon}
          variant="red"
          isCurrency={false}
        />
        <StatCard
          title="Budgets On Track"
          value={onTrackBudgets}
          icon={CheckCircle2}
          variant="green"
          isCurrency={false}
        />
      </div>

      {/* Budgets Grid */}
      {budgets.length === 0 ? (
        <EmptyState
          icon={LayoutGrid}
          title="No Budgets Set"
          message={`You haven't set any budget limits for ${new Date(selectedMonth + '-01').toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}. ${user?.role === 'admin' ? 'Create a budget to track spending 💰' : 'Wait for an admin to set budgets.'}`}
          actionText={user?.role === 'admin' ? "Add First Budget" : undefined}
          actionIcon={user?.role === 'admin' ? Plus : undefined}
          onAction={user?.role === 'admin' ? openAddModal : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {budgets.map(budget => (
            <BudgetCard
              key={budget._id}
              budget={budget}
              onEdit={openEditModal}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <AddBudgetModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        budgetToEdit={modalState.budget}
      />
      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        title="Delete Budget"
        message="Are you sure you want to permanently delete this budget limit? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm({ isOpen: false, id: null })}
        isConfirming={deleteMutation.isPending}
      />
    </div>
  );
};

export default BudgetsPage;
