"use client";
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import Button from './Button';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
};

const Modal: React.FC<ModalProps> = ({ open, onClose, title, children, actions, size = 'md' }) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (typeof document === 'undefined') return null;
  const container = document.body;
  if (!open) return null;
  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`relative w-full ${sizeMap[size]} bg-white rounded-xl shadow-lg border border-blue-100 p-6 animate-fadeIn`}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start justify-between mb-4">
          {title && (
            <h2 className="text-lg font-bold text-blue-800 tracking-tight flex items-center gap-2">
              <span className="inline-block w-1.5 h-6 bg-gradient-to-b from-blue-500 to-blue-300 rounded" />
              {title}
            </h2>
          )}
          <Button variant="ghost" size="sm" aria-label="Close" onClick={onClose}>
            ✕
          </Button>
        </div>
        <div className="text-sm text-blue-700 leading-relaxed">{children}</div>
        {actions && <div className="mt-6 flex justify-end gap-3">{actions}</div>}
      </div>
    </div>,
    container
  );
};

export default Modal;
