import { useMutation } from '@tanstack/react-query';
import { emailAPI } from '../utils/api';

export const useSendInvoiceEmail = () => {
  return useMutation({
    mutationFn: async (emailData) => {
      const response = await emailAPI.sendInvoice(emailData);
      return response;
    },
    onSuccess: (data) => {
      console.log('Email sent successfully:', data);
    },
    onError: (error) => {
      console.error('Error sending email:', error);
    }
  });
};
