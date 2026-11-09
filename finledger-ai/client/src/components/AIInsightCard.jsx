import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import Skeleton from './Skeleton';

const AIInsightCard = () => {
  const [insight, setInsight] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInsight = async (refresh = false) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post(`/ai/insight${refresh ? '?refresh=true' : ''}`);
      setInsight(res.data.insight);
    } catch (err) {
      setError('AI insight unavailable right now');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsight();
  }, []);

  return (
    <div className="rounded-xl border bg-gradient-to-br from-purple-50 to-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-purple-700">
          <Sparkles size={20} />
          <h3 className="font-semibold">AI Insight</h3>
        </div>
        <button 
          onClick={() => fetchInsight(true)}
          disabled={loading}
          className="p-1.5 text-purple-400 hover:bg-purple-100 hover:text-purple-600 rounded-lg transition-colors disabled:opacity-50"
          title="Refresh Insight"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="min-h-[80px]">
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center space-y-3 py-2 text-gray-500">
            <AlertCircle size={24} className="text-gray-400" />
            <p className="text-sm">{error}</p>
            <button 
              onClick={() => fetchInsight(true)}
              className="text-xs font-medium text-purple-600 hover:text-purple-700"
            >
              Try again
            </button>
          </div>
        ) : (
          <p className="text-sm leading-relaxed text-gray-700">
            {insight}
          </p>
        )}
      </div>
    </div>
  );
};

export default AIInsightCard;
