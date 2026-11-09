import React from 'react';
import { ArrowRight, ArrowDown } from 'lucide-react';

const ChainConnector = () => {
  return (
    <>
      {/* Desktop horizontal arrow */}
      <div className="hidden lg:flex items-center justify-center min-w-[50px] text-accent opacity-50">
        <ArrowRight size={32} className="animate-pulse" />
      </div>

      {/* Mobile vertical arrow */}
      <div className="flex lg:hidden items-center justify-center py-4 text-accent opacity-50">
        <ArrowDown size={32} className="animate-pulse" />
      </div>
    </>
  );
};

export default ChainConnector;
