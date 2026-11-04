import React from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { useBooking } from '../context/BookingContext';

export const NotificationToast = () => {
  const { toastMessage } = useBooking();

  if (!toastMessage) return null;

  const getIcon = () => {
    switch (toastMessage.type) {
      case 'info':
        return <Info size={18} color="#38bdf8" />;
      case 'warning':
        return <AlertCircle size={18} color="#f59e0b" />;
      default:
        return <CheckCircle size={18} color="#10b981" />;
    }
  };

  return (
    <div className="toast-notification">
      {getIcon()}
      <span style={{ fontSize: '0.92rem', fontWeight: 600 }}>{toastMessage.message}</span>
    </div>
  );
};
