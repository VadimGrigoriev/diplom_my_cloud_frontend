/* eslint-disable react/prop-types */
import { Toaster, toast } from 'sonner';

export const showNotification = {
  success: (message) => toast.success(message, {
    className: 'bg-green-500 text-white',
    duration: 3000,
  }),
  error: (message) => toast.error(message, {
    className: 'bg-red-500 text-white',
    duration: 4000,
  }),
  info: (message) => toast.info(message, {
    className: 'bg-blue-500 text-white',
    duration: 3000,
  }),
  warning: (message) => toast.warning(message, {
    className: 'bg-yellow-500 text-white',
    duration: 3000,
  })
};

export const ToastProvider = ({ children }) => {
  return (
    <>
      {children}
      <Toaster 
        position="top-right" 
        richColors 
        expand={false}
        className="toaster"
        toastOptions={{
          style: { 
            background: 'white', 
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
          }
        }}
      />
    </>
  );
};
