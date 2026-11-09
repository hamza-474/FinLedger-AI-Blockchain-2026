import React, { useState, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getChain, verifyChain, tamperChain } from '../api/blockchainApi';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import BlockCard from '../components/blockchain/BlockCard';
import ChainConnector from '../components/blockchain/ChainConnector';
import EmptyState from '../components/common/EmptyState';
import useTitle from '../hooks/useTitle';
import { ShieldCheck, ShieldAlert, RefreshCcw, Box, Flame } from 'lucide-react';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';

const BlockchainPage = () => {
  useTitle('Blockchain Explorer');
  const { user } = useContext(AuthContext);

  const [isVerifying, setIsVerifying] = useState(false);
  const [isTampering, setIsTampering] = useState(false);

  const { data: chainResponse, isLoading, error, refetch } = useQuery({
    queryKey: ['blockchain'],
    queryFn: getChain
  });

  const { data: verifyResponse, refetch: reVerify } = useQuery({
    queryKey: ['blockchain-verify'],
    queryFn: verifyChain,
    refetchOnWindowFocus: false
  });

  const handleVerify = async () => {
    setIsVerifying(true);
    try {
      const { data } = await reVerify();
      if (data?.isValid) {
        toast.success('Blockchain integrity verified');
      } else {
        toast.error('Blockchain tampering detected!');
      }
    } catch (err) {
      toast.error('Failed to verify blockchain');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleTamper = async () => {
    setIsTampering(true);
    try {
      const res = await tamperChain();
      toast.success(res.message || 'Block database modified!');
      await refetch();
      await reVerify();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to simulate database tampering');
    } finally {
      setIsTampering(false);
    }
  };

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState message={error.message} onRetry={refetch} />;

  const blocks = chainResponse?.chain || [];
  const isValid = verifyResponse?.isValid ?? true;

  return (
    <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Blockchain Explorer</h1>
      </div>

      {/* Status Banner */}
      <div className={`p-6 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-6 transition-all duration-500 ${isValid
          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
          : 'bg-red-500/10 border-red-500/50 text-red-400 shadow-[0_0_30px_rgba(239,68,68,0.2)]'
        }`}>
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className={`p-4 rounded-full shadow-inner ${isValid ? 'bg-emerald-500/20' : 'bg-red-500/20 animate-pulse'}`}>
            {isValid ? <ShieldCheck size={36} /> : <ShieldAlert size={36} />}
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-wide mb-1 uppercase">
              {isValid ? '✅ Integrity Verified' : '🚨 TAMPERING DETECTED'}
            </h2>
            <p className={`text-sm ${isValid ? 'text-emerald-500 font-medium' : 'text-red-500 font-bold'}`}>
              {isValid
                ? 'All block hashes align mathematically. No unauthorized modifications found.'
                : 'Chain sequence is broken! An unauthorized modification was made to the ledger.'}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <div className="hidden md:flex flex-col items-center justify-center px-6 border-r border-current/20">
            <span className="text-3xl font-black">{blocks.length}</span>
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-80 mt-1">Total Blocks</span>
          </div>

          {user?.role === 'admin' && (
            <button
              onClick={handleTamper}
              disabled={isTampering || blocks.length <= 1}
              className="w-full sm:w-auto px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30 disabled:opacity-40 disabled:cursor-not-allowed"
              title="Simulate database hack to verify blockchain tampering checks"
            >
              <Flame size={18} className={isTampering ? 'animate-bounce' : ''} />
              {isTampering ? 'Tampering...' : 'Simulate Hack'}
            </button>
          )}

          <button
            onClick={handleVerify}
            disabled={isVerifying}
            className={`w-full sm:w-auto px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${isValid
                ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30'
                : 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/30'
              }`}
          >
            <RefreshCcw size={18} className={isVerifying ? 'animate-spin' : ''} />
            {isVerifying ? 'Verifying Core...' : 'Verify Now'}
          </button>
        </div>
      </div>

      {/* Blockchain Visualizer */}
      <div className="flex-1 card overflow-hidden flex flex-col p-0 border-dark-border">
        <div className="p-4 border-b border-dark-border flex items-center justify-between text-gray-400 bg-dark-bg/80">
          <div className="flex items-center gap-2">
            <Box size={18} className="text-accent" />
            <h3 className="font-bold text-white tracking-wide">Distributed Ledger Network</h3>
          </div>
          <div className="text-xs font-mono">Running custom JS consensus</div>
        </div>

        {blocks.length === 0 ? (
          <div className="flex-1 p-6">
            <EmptyState
              icon={Box}
              title="No blocks in the chain"
              message="No records on chain yet. Once transactions are created, they will be sealed into blocks here."
            />
          </div>
        ) : (
          <div className="flex-1 overflow-x-auto overflow-y-auto p-8 custom-scrollbar bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-dark-card to-dark-bg">
            <div className="flex flex-col lg:flex-row items-center lg:items-start min-h-full pb-4">
              {blocks.map((block, index) => (
                <React.Fragment key={block.hash}>
                  <BlockCard block={block} />
                  {index < blocks.length - 1 && <ChainConnector />}
                </React.Fragment>
              ))}

              {/* Future Block Placeholder */}
              {isValid && (
                <>
                  <ChainConnector />
                  <div className="min-w-[200px] h-full flex flex-col items-center justify-center border-2 border-dashed border-dark-border rounded-xl opacity-30 p-8">
                    <Box size={32} className="mb-2" />
                    <span className="text-sm font-bold">Awaiting Next Block</span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlockchainPage;
