import React from 'react';

const LoadingState = () => {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="card h-28 bg-dark-border/30 border-dark-border/50"></div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card lg:col-span-2 h-80 bg-dark-border/30 border-dark-border/50"></div>
        <div className="card h-80 bg-dark-border/30 border-dark-border/50"></div>
      </div>
    </div>
  );
};

export default LoadingState;
