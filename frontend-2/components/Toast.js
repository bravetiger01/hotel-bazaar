'use client';

import { useEffect } from 'react';
import { CheckCircle, AlertCircle, XCircle, X } from 'lucide-react';

const Toast = ({ message, type = 'info', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />,
    info: <AlertCircle className="w-5 h-5" />,
  };

  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500',
  };

  return (
    <div className={`${colors[type]} text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-3 min-w-[300px] animate-in slide-in-from-right duration-300`}>
      {icons[type]}
      <span className="flex-1">{message}</span>
      <button onClick={onClose} className="text-white hover:text-gray-200">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;