import { toast } from 'react-toastify';

export const handleError = (error) => {
  const message = error.response?.data?.message || error.message || 'Something went wrong';
  toast.error(message);
  return message;
};

export const handleSuccess = (message) => {
  toast.success(message);
};