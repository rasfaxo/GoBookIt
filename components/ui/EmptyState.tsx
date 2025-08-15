import React from 'react';

interface EmptyStateProps {
  title?: string;
  message: string;
  action?: React.ReactNode;
}

const EmptyState = ({ title = 'Nothing here', message, action }: EmptyStateProps) => {
  return (
    <div className="text-center py-16 border-2 border-dashed border-blue-200 rounded-xl bg-white/60">
      <h3 className="text-lg font-semibold text-blue-800 mb-2 tracking-tight">{title}</h3>
      <p className="text-sm text-blue-600 max-w-sm mx-auto mb-4">{message}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
};

export default EmptyState;
