// hooks/useNotification.ts
import { useState } from 'react';

type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface Notification {
  message: string;
  type: NotificationType;
  visible: boolean;
}

export const useNotification = () => {
  const [notification, setNotification] = useState<Notification>({
    message: '',
    type: 'info',
    visible: false
  });

  const showNotification = (message: string, type: NotificationType = 'info') => {
    setNotification({ message, type, visible: true });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, visible: false }));
    }, 5000);
  };

  const NotificationComponent = () => {
    if (!notification.visible) return null;

    const bgColor = {
      success: 'bg-green-100 border-green-400 text-green-700',
      error: 'bg-red-100 border-red-400 text-red-700',
      info: 'bg-blue-100 border-blue-400 text-blue-700',
      warning: 'bg-yellow-100 border-yellow-400 text-yellow-700'
    }[notification.type];

    return (

      <div className={`fixed top-4 right-4 border ${bgColor} px-4 py-3 rounded z-50 max-w-sm`}>
        <div className="flex items-center">
          <span className="block sm:inline">{notification.message}</span>
          <button
            onClick={() => setNotification(prev => ({ ...prev, visible: false }))}
            className="ml-2"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    );
  };

  return { showNotification, NotificationComponent };
};