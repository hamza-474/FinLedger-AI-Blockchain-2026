import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTransaction } from '../../api/transactionApi';
import toast from 'react-hot-toast';
import { X, Loader2, Info } from 'lucide-react';

const categories = ['Salary', 'Rent', 'Equipment', 'Revenue', 'Utilities', 'Software', 'Other'];

const EditTransactionModal = ({ isOpen, onClose, transaction }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  
  const queryClient = useQueryClient();

  useEffect(() => {
    if (transaction && isOpen) {
      reset({
        title: transaction.title,
        description: transaction.description || '',
        category: transaction.category
      });
    }
  }, [transaction, isOpen, reset]);

  const mutation = useMutation({
    mutationFn: (data) => updateTransaction(transaction._id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['transactions']);
      queryClient.invalidateQueries(['dashboard']);
      toast.success('Transaction updated');
      onClose();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update transaction');
    }
  });

  if (!isOpen || !transaction) return null;

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-dark-card border border-dark-border rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-dark-border">
          <h2 className="text-xl font-bold text-white">Edit Transaction</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="bg-primary/10 border-l-4 border-primary p-4 mx-6 mt-6 flex gap-3 text-sm text-primary">
          <Info size={20} className="shrink-0 mt-0.5" />
          <p>
            <strong>Blockchain Immutability:</strong> The Amount, Type, and Date fields are permanently sealed in the ledger and cannot be altered.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4 opacity-60">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Amount</label>
              <input 
                type="text" 
                className="input cursor-not-allowed"
                value={`PKR ${transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Date</label>
              <input 
                type="text" 
                className="input cursor-not-allowed"
                value={new Date(transaction.date).toLocaleDateString()}
                disabled
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Title</label>
            <input 
              type="text" 
              className={`input ${errors.title ? 'border-red-500/50' : ''}`}
              {...register('title', { required: 'Title is required' })}
            />
            {errors.title && <p className="text-xs text-red-400 mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Category</label>
            <select 
              className={`input ${errors.category ? 'border-red-500/50' : ''}`}
              {...register('category', { required: 'Category is required' })}
            >
              <option value="">Select Category</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            {errors.category && <p className="text-xs text-red-400 mt-1">{errors.category.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Description (Optional)</label>
            <textarea 
              className="input resize-none h-20"
              {...register('description')}
            ></textarea>
          </div>

          <div className="pt-2 flex justify-end gap-3">
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
              {mutation.isPending ? <Loader2 className="animate-spin" size={18} /> : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTransactionModal;
