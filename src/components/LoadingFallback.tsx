import React from 'react';

const LoadingFallback: React.FC = () => (
  <div className="h-screen flex items-center justify-center">
    <div className="text-white text-xl">Carregando...</div>
  </div>
);

export default LoadingFallback;