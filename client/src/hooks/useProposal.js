import { useMutation } from '@tanstack/react-query';
import { proposalAPI } from '../utils/api';

export const useGenerateProposal = () => {
  return useMutation({
    mutationFn: async (proposalData) => {
      const response = await proposalAPI.generate(proposalData);

      // Get filename from Content-Disposition header
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'Security Guards, Proposal - BlueWolf Security.pdf'; // fallback
      
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
