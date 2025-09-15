import { useMutation } from '@tanstack/react-query';
import { invoiceAPI } from '../utils/api';

export const useGenerateInvoice = () => {
  return useMutation({
    mutationFn: async (invoiceData) => {
      const response = await invoiceAPI.generate(invoiceData);
      // Get filename from Content-Disposition header
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'Invoice - BlueWolf Security.pdf';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="([^"]+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
      return { blob: await response.blob(), filename };
    },
    onSuccess: ({ blob, filename }) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    },
  });
};
