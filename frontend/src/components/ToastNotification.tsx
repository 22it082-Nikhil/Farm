import { useState, useEffect } from 'react';
import { X, Bell } from 'lucide-react';

interface ToastProps {
    message: string;
    type?: 'success' | 'info' | 'warning';
    onClose: () => void;
}

const ToastNotification = ({ message, type = 'info', onClose }: ToastProps) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000); // Auto close after 5s

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`
      fixed top-4 right-4 z-50 flex items-center p-4 mb-4 rounded-lg shadow-lg border animate-slideIn
      ${type === 'success' ? 'bg-green-100 border-green-200 text-green-800' :
                type === 'warning' ? 'bg-yellow-100 border-yellow-200 text-yellow-800' :
                    'bg-blue-100 border-blue-200 text-blue-800'}
    `}>
            <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg mr-3 bg-white/50">
                <Bell className="w-5 h-5" />
            </div>
            <div className="ml-3 text-sm font-medium">{message}</div>
            <button
                onClick={onClose}
                className="ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex items-center justify-center h-8 w-8 text-gray-500 hover:text-gray-900 focus:ring-2 focus:ring-gray-300"
            >
                <X className="w-5 h-5" />
            </button>
        </div>
    );
};

export default ToastNotification;
