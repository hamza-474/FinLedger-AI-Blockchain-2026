import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTransaction } from '../../api/transactionApi';
import toast from 'react-hot-toast';
import { X, Loader2, UploadCloud } from 'lucide-react';

const categories = ['Salary', 'Rent', 'Equipment', 'Revenue', 'Utilities', 'Software', 'Other'];

const AddTransactionModal = ({ isOpen, onClose }) => {
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
    defaultValues: { type: 'expense', date: new Date().toISOString().split('T')[0], isReimbursement: false }
  });
  
  const [receiptBase64, setReceiptBase64] = useState(null);
  const typeValue = watch('type');
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries(['transactions']);
      queryClient.invalidateQueries(['dashboard']);
      queryClient.invalidateQueries(['summary']);
      toast.success('Transaction added & saved to blockchain ✅');
      setReceiptBase64(null);
      reset();
      onClose();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to add transaction');
    }
  });

  if (!isOpen) return null;

  const onSubmit = (data) => {
    mutation.mutate({
      ...data,
      amount: parseFloat(data.amount),
      receiptUrl: receiptBase64
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('File size must be less than 2MB');
        e.target.value = '';
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-dark-card border border-dark-border rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-dark-border">
          <h2 className="text-xl font-bold text-white">Add Transaction</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          {/* Type Toggle */}
          <div className="flex bg-dark-bg rounded-lg p-1">
            <label className={`flex-1 text-center py-2 rounded-md cursor-pointer transition-colors font-medium text-sm ${
              typeValue === 'income' ? 'bg-emerald-500/20 text-emerald-400 shadow-sm' : 'text-gray-400 hover:text-gray-200'
            }`}>
              <input type="radio" value="income" className="hidden" {...register('type')} />
              Income
            </label>
            <label className={`flex-1 text-center py-2 rounded-md cursor-pointer transition-colors font-medium text-sm ${
              typeValue === 'expense' ? 'bg-red-500/20 text-red-400 shadow-sm' : 'text-gray-400 hover:text-gray-200'
            }`}>
              <input type="radio" value="expense" className="hidden" {...register('type')} />
              Expense
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Title</label>
            <input 
              type="text" 
              className={`input ${errors.title ? 'border-red-500/50' : ''}`}
              placeholder="e.g. Office Rent"
              {...register('title', { required: 'Title is required' })}
            />
            {errors.title && <p className="text-xs text-red-400 mt-1">{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Amount (PKR)</label>
              <input 
                type="number" 
                step="0.01"
                min="0.01"
                className={`input ${errors.amount ? 'border-red-500/50' : ''}`}
                placeholder="0.00"
                {...register('amount', { required: 'Amount is required', min: 0.01 })}
              />
              {errors.amount && <p className="text-xs text-red-400 mt-1">{errors.amount.message}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Date</label>
              <input 
                type="date" 
                className={`input ${errors.date ? 'border-red-500/50' : ''}`}
                {...register('date', { required: 'Date is required' })}
              />
              {errors.date && <p className="text-xs text-red-400 mt-1">{errors.date.message}</p>}
            </div>
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
              placeholder="Additional details..."
              {...register('description')}
            ></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Receipt/Invoice (Max 2MB)</label>
              <div className="relative">
                <input 
                  type="file" 
                  accept="image/*,application/pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className={`flex items-center justify-center gap-2 px-4 py-2 border border-dashed rounded-lg text-sm transition-colors ${receiptBase64 ? 'border-emerald-500/50 text-emerald-400 bg-emerald-500/5' : 'border-dark-border text-gray-400 hover:border-gray-500 hover:text-gray-300'}`}>
                  <UploadCloud size={16} />
                  <span>{receiptBase64 ? 'File Attached ✓' : 'Upload File'}</span>
                </div>
              </div>
            </div>

            {typeValue === 'expense' && (
              <div className="flex items-center mt-6">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input 
                      type="checkbox" 
                      className="peer sr-only"
                      {...register('isReimbursement')}
                    />
                    <div className="w-5 h-5 rounded bg-dark-bg border border-dark-border peer-checked:bg-purple-500 peer-checked:border-purple-500 transition-all flex items-center justify-center">
                      <svg className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-400 group-hover:text-gray-200 transition-colors">Reimbursement Request</span>
                </label>
              </div>
            )}
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
              className="btn-primary min-w-[150px] flex justify-center items-center gap-2"
            >
              {mutation.isPending ? <Loader2 className="animate-spin" size={18} /> : 'Save to Ledger'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;
