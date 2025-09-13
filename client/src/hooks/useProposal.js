import { useMutation } from '@tanstack/react-query';

const generateProposal = async (proposalData) => {
  const response = await fetch('http://10.255.143.89:3001/api/generate-proposal', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(proposalData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to generate proposal');
  }

  return response.blob();
};

export const useGenerateProposal = () => {
  return useMutation({
    mutationFn: generateProposal,
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'proposal.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    },
  });
};
