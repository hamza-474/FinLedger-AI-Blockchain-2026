import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, ArrowLeft } from 'lucide-react';
import useTitle from '../hooks/useTitle';

const NotFoundPage = () => {
  useTitle('Page Not Found');

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg p-4 relative overflow-hidden w-full">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-dark-card to-dark-bg opacity-50"></div>
      <div className="card text-center max-w-md w-full relative z-10 border-dark-border p-12 shadow-2xl">
        <div className="flex justify-center mb-8">
          <div className="p-5 bg-accent/10 border border-accent/20 text-accent rounded-full shadow-[0_0_30px_rgba(99,102,241,0.2)]">
            <FileQuestion size={64} />
          </div>
        </div>
        <h1 className="text-6xl font-black text-white mb-2 tracking-wide text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-500">404</h1>
        <h2 className="text-2xl font-bold text-gray-300 mb-4 tracking-wide">Page Not Found</h2>
        <p className="text-gray-500 mb-10 leading-relaxed font-medium">
          The node you are looking for does not exist in the ledger. It might have been moved or deleted.
        </p>
        <Link to="/dashboard" className="btn-primary inline-flex items-center gap-3 px-8 py-4 font-bold shadow-lg shadow-accent/20 w-full justify-center text-lg">
          <ArrowLeft size={20} /> Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
