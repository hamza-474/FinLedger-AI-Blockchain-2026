import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../hooks/useAuth';
import { formatCurrency } from '../utils/formatters';
import Skeleton from '../components/Skeleton';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';

const Budgets = () => {
  const { user } = useAuth();
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const currentDate = new Date();
  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [year, setYear] = useState(currentDate.getFullYear());

  const [editingBudget, setEditingBudget] = useState(null);
  const [editAmount, setEditAmount] = useState('');

  const [addingNew, setAddingNew] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [newAmount, setNewAmount] = useState('');

  useEffect(() => {
    fetchData();
  }, [month, year]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [budgetsRes, categoriesRes] = await Promise.all([
        api.get(`/budgets?month=${month}&year=${year}`),
        api.get('/categories')
      ]);
      setBudgets(budgetsRes.data);
      // Only expense categories
      setCategories(categoriesRes.data.filter(c => c.type === 'expense'));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBudget = async (category, amount) => {
    try {
      await api.post('/budgets', {
        category,
        amount: parseFloat(amount),
        month,
        year
      });
      toast.success('Budget saved');
      fetchData();
      setEditingBudget(null);
      setAddingNew(false);
      setNewCategory('');
      setNewAmount('');
    } catch (error) {
      // Interceptor handles toast
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this budget?')) {
      try {
        await api.delete(`/budgets/${id}`);
        toast.success('Budget deleted');
        fetchData();
      } catch (error) {
        // ...
      }
    }
  };

  const availableCategories = categories.filter(
    c => !budgets.find(b => b.category === c.name)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Budgets</h2>
          <p className="text-gray-500">Manage your monthly spending limits</p>
        </div>
        <div className="flex items-center space-x-2 bg-white p-2 rounded-lg border shadow-sm">
          <select 
            value={month} 
            onChange={(e) => setMonth(parseInt(e.target.value))}
            className="bg-transparent text-sm font-medium focus:outline-none focus:ring-0 border-none cursor-pointer"
          >
            {Array.from({ length: 12 }).map((_, i) => {
              const date = new Date(2000, i, 1);
              return <option key={i} value={i + 1}>{date.toLocaleString('default', { month: 'long' })}</option>;
            })}
          </select>
          <select 
            value={year} 
            onChange={(e) => setYear(parseInt(e.target.value))}
            className="bg-transparent text-sm font-medium focus:outline-none focus:ring-0 border-none cursor-pointer"
          >
            {[year - 1, year, year + 1].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-xl border bg-white p-6 shadow-sm h-40">
              <Skeleton className="h-6 w-1/2 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {budgets.map(budget => {
            const catInfo = categories.find(c => c.name === budget.category);
            const percentage = Math.min(100, Math.round((budget.spent / budget.amount) * 100)) || 0;
            const isEditing = editingBudget === budget._id;
            
            let colorClass = 'bg-green-500';
            if (percentage >= 100) colorClass = 'bg-red-500';
            else if (percentage >= 80) colorClass = 'bg-amber-500';

            return (
              <div key={budget._id} className="rounded-xl border bg-white p-6 shadow-sm relative group">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="h-3 w-3 rounded-full" 
                      style={{ backgroundColor: catInfo?.color || '#808080' }}
                    />
                    <h3 className="font-semibold text-gray-900">{budget.category}</h3>
                  </div>
                  <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => {
                        setEditingBudget(budget._id);
                        setEditAmount(budget.amount.toString());
                      }}
                      className="text-gray-400 hover:text-purple-600"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(budget._id)} className="text-gray-400 hover:text-red-600">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {isEditing ? (
                  <div className="flex items-center space-x-2 mb-4">
                    <input 
                      type="number" 
                      value={editAmount}
                      onChange={(e) => setEditAmount(e.target.value)}
                      className="w-full text-lg font-bold p-1 border rounded-md focus:ring-purple-500 focus:border-purple-500"
                      autoFocus
                    />
                    <button onClick={() => handleSaveBudget(budget.category, editAmount)} className="text-green-600 hover:text-green-700 p-1">
                      <Save size={18} />
                    </button>
                    <button onClick={() => setEditingBudget(null)} className="text-gray-500 hover:text-gray-700 p-1">
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <div className="mb-2">
                    <span className="text-2xl font-bold text-gray-900">{formatCurrency(budget.amount, user?.currency)}</span>
                    <span className="text-sm text-gray-500 ml-2">limit</span>
                  </div>
                )}

                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">{formatCurrency(budget.spent, user?.currency)} spent</span>
                    <span className={`font-medium ${percentage >= 100 ? 'text-red-600' : 'text-gray-700'}`}>
                      {percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className={`h-2.5 rounded-full ${colorClass}`} style={{ width: `${percentage}%` }}></div>
                  </div>
                </div>
              </div>
            );
          })}

          {addingNew ? (
            <div className="rounded-xl border-2 border-dashed border-purple-300 bg-purple-50 p-6 shadow-sm flex flex-col justify-center">
              <h3 className="font-semibold text-purple-900 mb-4">Add New Budget</h3>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full mb-3 rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 p-2 border text-sm"
              >
                <option value="">Select Category</option>
                {availableCategories.map(c => (
                  <option key={c.name} value={c.name}>{c.name}</option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Amount limit"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                className="w-full mb-4 rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 p-2 border text-sm"
              />
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleSaveBudget(newCategory, newAmount)}
                  disabled={!newCategory || !newAmount}
                  className="flex-1 bg-purple-600 text-white rounded-md py-2 text-sm font-medium hover:bg-purple-700 disabled:opacity-50"
                >
                  Save
                </button>
                <button 
                  onClick={() => setAddingNew(false)}
                  className="px-3 bg-white border border-gray-300 text-gray-700 rounded-md py-2 text-sm font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            availableCategories.length > 0 && (
              <button 
                onClick={() => setAddingNew(true)}
                className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50/50 p-6 flex flex-col items-center justify-center text-gray-500 hover:text-purple-600 hover:border-purple-300 hover:bg-purple-50 transition-colors h-full min-h-[200px]"
              >
                <Plus size={32} className="mb-2" />
                <span className="font-medium">Add Budget</span>
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default Budgets;
