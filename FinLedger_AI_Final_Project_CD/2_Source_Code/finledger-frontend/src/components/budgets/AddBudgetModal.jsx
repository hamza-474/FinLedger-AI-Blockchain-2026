import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBudget, updateBudget } from '../../api/budgetApi';
import toast from 'react-hot-toast';
import { X, Loader2 } from 'lucide-react';

const categories = ['Salary', 'Rent', 'Equipment', 'Revenue', 'Utilities', 'Software', 'Other'];

const AddBudgetModal = ({ isOpen, onClose, budgetToEdit }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { month: new Date().toISOString().slice(0, 7) }
  });
  
  const queryClient = useQueryClient();
  const isEditing = !!budgetToEdit;

  useEffect(() => {
    if (isOpen) {
      if (isEditing) {
        reset({
          category: budgetToEdit.category,
          limitAmount: budgetToEdit.limitAmount,
          month: budgetToEdit.month
        });
      } else {
        reset({ 
          category: '', 
          limitAmount: '', 
          month: new Date().toISOString().slice(0, 7) 
        });
      }
    }
  }, [isOpen, budgetToEdit, reset, isEditing]);

  const mutation = useMutation({
    mutationFn: (data) => isEditing ? updateBudget(budgetToEdit._id, data) : createBudget(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['budgets']);
      toast.success(isEditing ? 'Budget updated successfully' : 'Budget created successfully');
      onClose();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to save budget');
    }
  });

  if (!isOpen) return null;

  const onSubmit = (data) => {
    mutation.mutate({
      ...data,
      limitAmount: parseFloat(data.limitAmount)
    });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-dark-card border border-dark-border rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-dark-border">
          <h2 className="text-xl font-bold text-white">{isEditing ? 'Edit Budget' : 'Add Budget'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Category</label>
            <select 
              className={`input ${errors.category ? 'border-red-500/50' : ''}`}
              disabled={isEditing} // usually category shouldn't be edited
              {...register('category', { required: 'Category is required' })}
            >
              <option value="">Select Category</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            {errors.category && <p className="text-xs text-red-400 mt-1">{errors.category.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Limit Amount (PKR)</label>
            <input 
              type="number" 
              step="0.01"
              min="1"
              className={`input ${errors.limitAmount ? 'border-red-500/50' : ''}`}
              placeholder="5000.00"
              {...register('limitAmount', { required: 'Limit Amount is required', min: 1 })}
            />
            {errors.limitAmount && <p className="text-xs text-red-400 mt-1">{errors.limitAmount.message}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Month</label>
            <input 
              type="month" 
              className={`input ${errors.month ? 'border-red-500/50' : ''}`}
              disabled={isEditing}
              {...register('month', { required: 'Month is required' })}
            />
            {errors.month && <p className="text-xs text-red-400 mt-1">{errors.month.message}</p>}
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-dark-border/50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={mutation.isPending}
              className="btn-primary min-w-[120px] flex justify-center items-center gap-2"
            >
              {mutation.isPending ? <Loader2 className="animate-spin" size={18} /> : 'Save Budget'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBudgetModal;
