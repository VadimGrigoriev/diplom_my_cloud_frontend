/* eslint-disable react/prop-types */
import { AlertCircle } from 'lucide-react';

const CustomAlert = ({ children, variant = 'error' }) => {
  const bgColor = variant === 'error' ? 'bg-red-50' : 'bg-blue-50';
  const textColor = variant === 'error' ? 'text-red-800' : 'text-blue-800';
  const borderColor = variant === 'error' ? 'border-red-200' : 'border-blue-200';

  return (
    <div className={`flex items-center gap-2 p-4 rounded-lg border ${bgColor} ${textColor} ${borderColor}`}>
      <AlertCircle className="h-4 w-4 flex-shrink-0" />
      <div className="text-sm">{children}</div>
    </div>
  );
};

export default CustomAlert;
