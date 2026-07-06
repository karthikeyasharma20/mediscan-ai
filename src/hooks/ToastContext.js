import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast Portal Container */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          maxWidth: '380px',
          width: 'calc(100% - 48px)',
        }}
      >
        <AnimatePresence>
          {toasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onClose }) {
  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <FiCheckCircle size={20} color="#22c55e" />;
      case 'error':
        return <FiAlertCircle size={20} color="#ef4444" />;
      case 'warning':
        return <FiAlertCircle size={20} color="#f59e0b" />;
      default:
        return <FiInfo size={20} color="#3b82f6" />;
    }
  };

  const getBorderColor = () => {
    switch (toast.type) {
      case 'success':
        return 'rgba(34, 197, 94, 0.3)';
      case 'error':
        return 'rgba(239, 68, 68, 0.3)';
      case 'warning':
        return 'rgba(245, 158, 11, 0.3)';
      default:
        return 'rgba(59, 130, 246, 0.3)';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '16px',
        borderRadius: '12px',
        background: 'var(--card-bg)',
        border: `1px solid ${getBorderColor()}`,
        boxShadow: 'var(--shadow-lg)',
        color: 'var(--text-main)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>{getIcon()}</div>
      <div style={{ flexGrow: 1, fontSize: '14px', fontWeight: 500, lineHeight: 1.4 }}>
        {toast.message}
      </div>
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '4px',
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <FiX size={16} />
      </button>
    </motion.div>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
