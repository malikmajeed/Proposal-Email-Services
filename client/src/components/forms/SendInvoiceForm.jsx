import React, { useState, useEffect } from 'react';
import LoadingModal from '../LoadingModal';
import { ArrowLeft, Mail, Loader } from 'lucide-react';
import { useSendInvoiceEmail } from '../../hooks/useEmail';

const getCurrentUSTimeDate = () => {
  const now = new Date();
  return now.toISOString().split('T')[0]; // yyyy-mm-dd for input type="date"
};

const SendInvoiceForm = ({ onBack }) => {
  const [formData, setFormData] = useState({
    clientName: '',
    email: '',
    amount: '',
    description: 'Security Guard Services',
    invoiceNumber: '',
  });

  const [pdfFile, setPdfFile] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const sendEmail = useSendInvoiceEmail();

  // Handle success state with delay
  useEffect(() => {
    if (sendEmail.isSuccess && !sendEmail.isPending) {
      setShowSuccess(true);
      // Auto-hide success modal after 2 seconds
      const timer = setTimeout(() => {
        setShowSuccess(false);
        // Reset form after success
        setFormData({
          clientName: '',
          email: '',
          amount: '',
          description: 'Security Guard Services',
          invoiceNumber: '',
        });
        setPdfFile(null);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [sendEmail.isSuccess, sendEmail.isPending]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log('Form data:', formData);
    console.log('PDF file:', pdfFile);
    console.log('PDF file type:', typeof pdfFile);
    console.log('PDF file name:', pdfFile?.name);
    
    if (!formData.email) {
      alert('Client email is required');
      return;
    }

    if (!formData.clientName) {
      alert('Client name is required');
      return;
    }

    if (!formData.amount) {
      alert('Amount is required');
      return;
    }

    if (!formData.invoiceNumber) {
      alert('Invoice number is required');
      return;
    }

    if (!pdfFile) {
      alert('Please attach an invoice PDF file. Make sure to select a .pdf file.');
      return;
    }

    // Check if the file is actually a PDF
    if (pdfFile.type !== 'application/pdf') {
      alert('Please select a valid PDF file. The selected file is not a PDF.');
      return;
    }

    // Create FormData for file upload
    const formDataToSend = new FormData();
    formDataToSend.append('clientName', formData.clientName);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('amount', formData.amount);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('invoiceNumber', formData.invoiceNumber);
    formDataToSend.append('pdf', pdfFile);

    sendEmail.mutate(formDataToSend, {
      onError: (error) => {
        alert('Failed to send email. Please try again.');
        console.error('Email error:', error);
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <LoadingModal 
        open={sendEmail.isPending} 
        type="loading"
        message={
          <span>
            <span className="block text-blue-600 font-bold text-lg mb-2 animate-pulse">Sending Invoice Email...</span>
            <span className="block text-gray-500 text-sm">This may take a few seconds. Please wait!</span>
          </span>
        } 
      />
      <LoadingModal 
        open={showSuccess} 
        type="success"
        message={
          <span>
            <span className="block text-green-600 font-bold text-lg mb-2">Email Sent Successfully!</span>
            <span className="block text-gray-500 text-sm">Invoice has been delivered to the client.</span>
          </span>
        } 
      />
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-6">
          {onBack && (
            <button
              onClick={onBack}
              className="mr-4 p-2 rounded-lg bg-white shadow-sm hover:bg-gray-50"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <h1 className="text-xl font-bold text-gray-800">Send Invoice Email</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Invoice Details */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Invoice Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client Name *</label>
                <input
                  type="text"
                  value={formData.clientName}
                  onChange={e => setFormData({ ...formData, clientName: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="Enter client name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="client@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount *</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={e => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Number *</label>
                <input
                  type="text"
                  value={formData.invoiceNumber}
                  onChange={e => setFormData({ ...formData, invoiceNumber: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="INV-2024-001"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="Security Guard Services"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Invoice PDF *</label>
                <input
                  key={pdfFile ? 'file-selected' : 'no-file'}
                  type="file"
                  accept=".pdf"
                  onChange={e => {
                    console.log('File input changed:', e.target.files);
                    console.log('Selected file:', e.target.files[0]);
                    if (e.target.files[0]) {
                      console.log('File type:', e.target.files[0].type);
                      console.log('File name:', e.target.files[0].name);
                      console.log('File size:', e.target.files[0].size);
                    }
                    setPdfFile(e.target.files[0]);
                  }}
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                  required
                />
                {pdfFile && (
                  <p className="text-xs text-green-600 mt-1">✓ {pdfFile.name}</p>
                )}
                {!pdfFile && (
                  <p className="text-xs text-red-500 mt-1">Please select a PDF file</p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={sendEmail.isPending}
            className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {sendEmail.isPending ? (
              <>
                <Loader className="h-5 w-5 animate-spin" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Mail className="h-5 w-5" />
                <span>Send Invoice Email</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SendInvoiceForm;
