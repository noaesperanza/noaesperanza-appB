import React from 'react'

const PremiumFrame: React.FC<{ children?: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <div className={`premium-card min-h-[120px] flex items-center justify-center ${className || ''}`}>
    {children}
  </div>
)

export default PremiumFrame
