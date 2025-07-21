import React from 'react';
import { Alert } from 'antd';

interface ErrorAlertProps {
  message?: string;
  description?: string;
  type?: 'success' | 'info' | 'warning' | 'error';
  showIcon?: boolean;
  className?: string;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ 
  message = "Error", 
  description, 
  type = "error", 
  showIcon = true,
  className = "mb-4" 
}) => {
  return (
    <Alert
      message={message}
      description={description}
      type={type}
      showIcon={showIcon}
      className={className}
    />
  );
};

export default ErrorAlert;
