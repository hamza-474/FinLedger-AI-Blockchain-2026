import React from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
          <div className="card max-w-lg w-full text-center p-10 shadow-[0_0_50px_rgba(239,68,68,0.15)] border-red-500/30">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-500/10 mb-6 border-2 border-red-500/20 animate-pulse">
              <AlertTriangle size={48} className="text-red-500" />
            </div>
            <h1 className="text-4xl font-black text-white mb-4 tracking-tight">System Crash</h1>
            <p className="text-gray-400 mb-8 leading-relaxed font-medium">
              We encountered an unexpected error while rendering this page. The system has safely halted and logged the crash for our engineers.
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-8 py-4 bg-white text-dark-bg rounded-xl font-bold flex items-center justify-center gap-3 mx-auto w-full sm:w-auto hover:bg-gray-200 transition-colors shadow-xl"
            >
              <RefreshCcw size={20} /> Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
