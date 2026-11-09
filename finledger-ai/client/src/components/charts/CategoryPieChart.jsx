import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { formatCurrency } from '../../utils/formatters';

const CategoryPieChart = ({ data, currency }) => {
  if (!data || data.length === 0) {
    return <div className="flex h-64 items-center justify-center text-sm text-gray-500">No expense data for this month</div>;
  }

  // Filter only expenses and positive amounts
  const expenses = data.filter(d => d.type === 'expense' && d.total > 0)
    .sort((a, b) => b.total - a.total); // Sort by biggest first

  // Hardcode colors for defaults if they don't have one in this data structure
  const COLORS = ['#f87171', '#fb923c', '#facc15', '#2dd4bf', '#ec4899', '#a78bfa', '#38bdf8', '#9ca3af'];

  return (
    <div className="flex flex-col h-full">
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={expenses}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="total"
              nameKey="category"
            >
              {expenses.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => formatCurrency(value, currency)}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex-1 overflow-y-auto pr-2">
        <div className="space-y-2">
          {expenses.map((entry, index) => (
            <div key={entry.category} className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <div 
                  className="h-3 w-3 rounded-full" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-gray-600 truncate max-w-[100px]">{entry.category}</span>
              </div>
              <span className="font-medium text-gray-900">{formatCurrency(entry.total, currency)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryPieChart;
