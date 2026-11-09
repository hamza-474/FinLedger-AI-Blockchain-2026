import React, { useState, useRef, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { predictSpending, detectAnomalies, generateReport, askQuestion } from '../api/aiApi';
import toast from 'react-hot-toast';
import {
  Sparkles,
  Search,
  FileText,
  MessageSquare,
  Send,
  User,
  Bot,
  AlertTriangle,
  CheckCircle2,
  Copy,
  TrendingUp,
  BrainCircuit,
  Loader2
} from 'lucide-react';
import useTitle from '../hooks/useTitle';

const AIPage = () => {
  useTitle('AI Insights');

  const [activeTab, setActiveTab] = useState('predictions');

  const tabs = [
    { id: 'predictions', label: 'Predictions', icon: Sparkles },
    { id: 'anomalies', label: 'Anomalies', icon: Search },
    { id: 'report', label: 'Financial Report', icon: FileText },
    { id: 'chat', label: 'Ask AI', icon: MessageSquare }
  ];

  return (
    <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-accent/20 text-accent rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.2)]">
          <BrainCircuit size={28} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">AI Insights</h1>
          <p className="text-sm text-accent font-medium mt-0.5">Powered by Google Gemini 1.5 Pro</p>
        </div>
      </div>

      {/* Tabs Header */}
      <div className="flex overflow-x-auto gap-2 border-b border-dark-border pb-px custom-scrollbar shrink-0">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 border-b-2 font-bold text-sm transition-all whitespace-nowrap ${isActive
                  ? 'border-accent text-accent bg-accent/10 rounded-t-lg'
                  : 'border-transparent text-gray-400 hover:text-white hover:bg-dark-border/50 rounded-t-lg'
                }`}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content Area */}
      <div className="flex-1 card overflow-hidden flex flex-col p-0 border-dark-border">
        {activeTab === 'predictions' && <PredictionsTab />}
        {activeTab === 'anomalies' && <AnomaliesTab />}
        {activeTab === 'report' && <ReportTab />}
        {activeTab === 'chat' && <ChatTab />}
      </div>
    </div>
  );
};

// --- TAB COMPONENTS --- //

const LoadingView = ({ message }) => (
  <div className="flex flex-col items-center justify-center h-full py-20 animate-pulse text-accent">
    <div className="relative mb-8">
      <Loader2 size={64} className="animate-spin text-accent/50 absolute" />
      <Sparkles size={64} className="animate-ping opacity-50" />
    </div>
    <h3 className="text-2xl font-bold text-white mb-3">{message}</h3>
    <p className="text-gray-400 max-w-md text-center leading-relaxed">
      This process involves analyzing millions of data points and running complex neural models. It may take 5-10 seconds to generate a high-fidelity response.
    </p>
  </div>
);

const PredictionsTab = () => {
  const [data, setData] = useState(null);

  const mutation = useMutation({
    mutationFn: predictSpending,
    onSuccess: (res) => setData(res.data),
    onError: (err) => toast.error(err.response?.data?.message || 'Prediction failed')
  });

  return (
    <div className="flex-1 flex flex-col overflow-y-auto p-6 custom-scrollbar bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-dark-card to-dark-bg">
      {!data && !mutation.isPending && (
        <div className="flex-1 flex flex-col items-center justify-center text-center max-w-lg mx-auto">
          <Sparkles size={72} className="text-accent/50 mb-6 drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
          <h2 className="text-3xl font-black text-white mb-4">Forecasting Next Month</h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Our AI analyzes your last 6 months of ledger data to mathematically predict how much you will spend per category next month.
          </p>
          <button
            onClick={() => mutation.mutate()}
            className="btn-accent px-8 py-4 text-lg font-bold flex items-center gap-3 shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:shadow-[0_0_40px_rgba(99,102,241,0.5)] transition-all"
          >
            <Sparkles size={20} /> Generate Predictions
          </button>
        </div>
      )}

      {mutation.isPending && <LoadingView message="Synthesizing historical ledger data..." />}

      {data && !mutation.isPending && (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
          <div className="flex justify-between items-center border-b border-dark-border pb-4">
            <h2 className="text-2xl font-bold text-white tracking-wide">Next Month Predictions</h2>
            <button onClick={() => mutation.mutate()} className="text-sm text-accent hover:text-accent-hover font-bold bg-accent/10 px-4 py-2 rounded-lg transition-colors">
              Recalculate
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.predictions?.map((item, idx) => (
              <div key={idx} className="bg-dark-bg border border-dark-border/50 rounded-xl p-6 hover:border-accent/50 transition-colors shadow-lg hover:shadow-[0_0_20px_rgba(99,102,241,0.1)]">
                <div className="flex justify-between items-start mb-4">
                  <span className="font-bold text-white text-lg tracking-wide">{item.category}</span>
                  <span className="px-2.5 py-1 bg-accent/20 text-accent text-[10px] font-black uppercase tracking-wider rounded-full border border-accent/30">
                    {item.confidenceLevel || 'High'} Confidence
                  </span>
                </div>
                <div className="flex items-center gap-3 bg-dark-card p-3 rounded-lg border border-dark-border/30">
                  <span className="text-3xl font-black text-white">PKR {item.predictedAmount.toLocaleString()}</span>
                  <TrendingUp size={24} className="text-gray-500 ml-auto" />
                </div>
                <p className="text-sm text-gray-400 mt-4 leading-relaxed font-medium">{item.reasoning || 'Based on historical expenditure velocity.'}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const AnomaliesTab = () => {
  const [data, setData] = useState(null);

  const mutation = useMutation({
    mutationFn: detectAnomalies,
    onSuccess: (res) => setData(res.data),
    onError: (err) => toast.error(err.response?.data?.message || 'Anomaly scan failed')
  });

  return (
    <div className="flex-1 flex flex-col overflow-y-auto p-6 custom-scrollbar bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-dark-card to-dark-bg">
      {!data && !mutation.isPending && (
        <div className="flex-1 flex flex-col items-center justify-center text-center max-w-lg mx-auto">
          <Search size={72} className="text-red-500/50 mb-6 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
          <h2 className="text-3xl font-black text-white mb-4">Fraud & Anomaly Detection</h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Instantly scan thousands of blockchain records to uncover suspicious spending, duplicate payments, or highly irregular transaction amounts.
          </p>
          <button
            onClick={() => mutation.mutate()}
            className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-xl text-lg font-bold flex items-center gap-3 shadow-[0_0_30px_rgba(239,68,68,0.3)] hover:shadow-[0_0_40px_rgba(239,68,68,0.5)] transition-all"
          >
            <Search size={20} /> Initiate Ledger Scan
          </button>
        </div>
      )}

      {mutation.isPending && <LoadingView message="Scanning blockchain transactions for irregularities..." />}

      {data && !mutation.isPending && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-center border-b border-dark-border pb-4">
            <h2 className="text-2xl font-bold text-white tracking-wide">Scan Results</h2>
            <button onClick={() => mutation.mutate()} className="text-sm text-red-400 hover:text-red-300 font-bold bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-lg transition-colors">
              Re-scan Ledger
            </button>
          </div>

          {data.anomalies?.length === 0 ? (
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-12 flex flex-col items-center justify-center text-center shadow-[inset_0_0_50px_rgba(16,185,129,0.05)]">
              <div className="p-4 bg-emerald-500/10 rounded-full mb-6">
                <CheckCircle2 size={56} className="text-emerald-400" />
              </div>
              <h3 className="text-2xl font-black text-emerald-400 mb-2 tracking-wide">Clean Ledger!</h3>
              <p className="text-emerald-500/80 text-lg font-medium">No anomalies detected. Your financial records exhibit normal behavior patterns.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-red-400 font-black tracking-widest uppercase bg-red-500/10 inline-block px-4 py-2 rounded-md border border-red-500/20">
                Found {data.anomalies?.length} Suspicious Record(s)
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.anomalies?.map((item, idx) => (
                  <div key={idx} className="bg-dark-bg border border-red-500/30 rounded-xl p-6 shadow-[0_0_15px_rgba(239,68,68,0.05)] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/10 rounded-bl-full -mr-4 -mt-4 pointer-events-none"></div>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                      <div>
                        <h4 className="font-bold text-white text-lg">{item.title || 'Unknown Transaction'}</h4>
                        <p className="text-xs font-mono text-gray-500 mt-1 bg-dark-card inline-block px-2 py-0.5 rounded border border-dark-border">
                          {new Date(item.date).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="text-2xl font-black text-white">PKR {item.amount?.toLocaleString()}</span>
                    </div>
                    <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg flex items-start gap-3 mt-4 relative z-10">
                      <AlertTriangle size={20} className="text-red-400 mt-0.5 shrink-0" />
                      <p className="text-sm text-red-200 font-medium leading-relaxed">{item.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const ReportTab = () => {
  const [data, setData] = useState(null);

  const mutation = useMutation({
    mutationFn: generateReport,
    onSuccess: (res) => setData(res.data),
    onError: (err) => toast.error(err.response?.data?.message || 'Report generation failed')
  });

  const copyReport = () => {
    navigator.clipboard.writeText(data.report);
    toast.success('Report copied to clipboard!');
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto p-6 custom-scrollbar bg-dark-bg">
      {!data && !mutation.isPending && (
        <div className="flex-1 flex flex-col items-center justify-center text-center max-w-lg mx-auto">
          <FileText size={72} className="text-accent/50 mb-6 drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
          <h2 className="text-3xl font-black text-white mb-4">Comprehensive Executive Summary</h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Generate a detailed, human-readable financial analysis report covering income, expenses, budget limits, and general financial health via Gemini 1.5.
          </p>
          <button
            onClick={() => mutation.mutate()}
            className="btn-accent px-8 py-4 text-lg font-bold flex items-center gap-3 shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:shadow-[0_0_40px_rgba(99,102,241,0.5)] transition-all"
          >
            <FileText size={20} /> Generate Report
          </button>
        </div>
      )}

      {mutation.isPending && <LoadingView message="Composing your financial executive summary..." />}

      {data && !mutation.isPending && (
        <div className="h-full flex flex-col animate-in fade-in duration-500">
          <div className="flex justify-between items-center border-b border-dark-border pb-4 mb-6">
            <h2 className="text-2xl font-bold text-white tracking-wide">AI Financial Report</h2>
            <div className="flex gap-3">
              <button onClick={copyReport} className="btn-accent px-4 py-2 font-bold text-sm flex items-center gap-2 shadow-lg shadow-accent/20">
                <Copy size={16} /> Copy
              </button>
              <button onClick={() => mutation.mutate()} className="px-4 py-2 text-sm font-bold text-gray-300 hover:text-white transition-colors border border-dark-border rounded-lg bg-dark-card hover:bg-dark-border/50">
                Regenerate
              </button>
            </div>
          </div>

          <div className="flex-1 bg-dark-card border border-dark-border rounded-xl p-8 overflow-y-auto custom-scrollbar shadow-inner text-[15px]">
            <div className="prose prose-invert max-w-none">
              {data.report.split('\n').map((line, i) => {
                if (line.startsWith('##')) return <h2 key={i} className="text-2xl font-bold text-white mt-8 mb-4 border-l-4 border-accent pl-4">{line.replace(/##/g, '')}</h2>;
                if (line.startsWith('#')) return <h1 key={i} className="text-3xl font-black text-accent mt-8 mb-6 pb-4 border-b border-dark-border">{line.replace(/#/g, '')}</h1>;
                if (line.startsWith('-') || line.startsWith('*')) return <li key={i} className="text-gray-300 ml-6 mb-2 pl-2">{line.substring(1)}</li>;
                if (line.trim() === '') return <br key={i} />;

                // Handle bolding text **text**
                const boldedLine = line.split(/(\*\*.*?\*\*)/g).map((part, index) => {
                  if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={index} className="text-white font-black">{part.slice(2, -2)}</strong>;
                  }
                  return part;
                });

                return <p key={i} className="text-gray-400 leading-relaxed mb-4">{boldedLine}</p>;
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ChatTab = () => {
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Hello! I am your FinLedger AI Assistant. You can ask me anything about your recorded transactions, budgets, or general financial health.' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const mutation = useMutation({
    mutationFn: askQuestion,
    onSuccess: (res) => {
      setMessages(prev => [...prev, { role: 'ai', content: res.data.answer }]);
    },
    onError: (err) => {
      setMessages(prev => [...prev, { role: 'ai', content: 'Sorry, I encountered an error communicating with Gemini. ' + (err.response?.data?.message || '') }]);
    }
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, mutation.isPending]);

  const handleSend = (text = input) => {
    if (!text.trim() || mutation.isPending) return;
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setInput('');
    mutation.mutate(text);
  };

  const suggestions = [
    "How can I reduce expenses?",
    "Which category costs the most?",
    "Am I on track with my budget?"
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-dark-card to-dark-bg relative">
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar pb-32">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-4 max-w-[85%] animate-in fade-in slide-in-from-bottom-2 ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-lg border ${msg.role === 'user' ? 'bg-primary text-white border-primary/50 shadow-primary/20' : 'bg-dark-card border-accent/50 text-accent shadow-accent/20'
              }`}>
              {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
            </div>
            <div className={`p-4 rounded-2xl ${msg.role === 'user'
                ? 'bg-primary text-white rounded-tr-sm shadow-lg shadow-primary/10'
                : 'bg-dark-bg border border-dark-border text-gray-200 rounded-tl-sm shadow-xl'
              }`}>
              <div className="prose prose-invert max-w-none text-[15px] leading-relaxed font-medium">
                {msg.content.split('\n').map((line, i) => {
                  const boldedLine = line.split(/(\*\*.*?\*\*)/g).map((part, index) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                      return <strong key={index} className="text-white font-bold">{part.slice(2, -2)}</strong>;
                    }
                    return part;
                  });
                  return <p key={i} className="mb-2 last:mb-0">{boldedLine}</p>;
                })}
              </div>
            </div>
          </div>
        ))}

        {mutation.isPending && (
          <div className="flex gap-4 max-w-[85%] animate-in fade-in">
            <div className="w-10 h-10 rounded-full bg-dark-card border border-accent/50 text-accent flex items-center justify-center shrink-0 shadow-lg shadow-accent/20">
              <Bot size={20} />
            </div>
            <div className="p-4 rounded-2xl bg-dark-bg border border-dark-border rounded-tl-sm flex items-center gap-2 shadow-xl">
              <span className="w-2.5 h-2.5 bg-accent rounded-full animate-bounce"></span>
              <span className="w-2.5 h-2.5 bg-accent rounded-full animate-bounce delay-100"></span>
              <span className="w-2.5 h-2.5 bg-accent rounded-full animate-bounce delay-200"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 pt-12 bg-gradient-to-t from-dark-bg via-dark-bg to-transparent">
        {messages.length === 1 && (
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => handleSend(s)}
                className="px-4 py-2 text-sm font-bold bg-dark-card border border-dark-border text-gray-300 hover:text-white hover:border-accent hover:bg-accent/10 hover:shadow-[0_0_15px_rgba(99,102,241,0.15)] rounded-full transition-all"
              >
                {s}
              </button>
            ))}
          </div>
        )}
        <div className="relative flex items-center max-w-4xl mx-auto shadow-2xl">
          <input
            type="text"
            className="w-full bg-dark-card border border-dark-border rounded-2xl pl-6 pr-16 py-4 text-white text-lg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
            placeholder="Ask anything about your finances..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={mutation.isPending}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || mutation.isPending}
            className="absolute right-3 p-3 bg-accent hover:bg-accent-hover disabled:bg-dark-border disabled:text-gray-500 text-white rounded-xl transition-all shadow-lg"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIPage;
