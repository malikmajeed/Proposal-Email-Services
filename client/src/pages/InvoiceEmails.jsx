import React, { useState } from 'react';
import { Upload, Send, Loader, FileText } from 'lucide-react';

const InvoiceEmails = () => {
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    clientName: '',
    invoiceNumber: '',
    amount: '',
    dueDate: '',
    clientEmail: '',
  });

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert('Please select an invoice PDF file.');
      return;
    }
    setLoading(true);
    const form = new FormData();
    form.append('pdf', selectedFile);
    form.append('clientName', formData.clientName);
    form.append('invoiceNumber', formData.invoiceNumber);
    form.append('amount', formData.amount);
    form.append('dueDate', formData.dueDate);
    form.append('clientEmail', formData.clientEmail);
    try {
      const response = await fetch('http://localhost:3001/api/send-invoice', {
        method: 'POST',
        body: form,
      });
      if (response.ok) {
        alert('Invoice sent successfully!');
        setFormData({
          clientName: '',
          invoiceNumber: '',
          amount: '',
          dueDate: '',
          clientEmail: '',
        });
        setSelectedFile(null);
      } else {
        alert('Failed to send invoice. Please try again.');
      }
    } catch (error) {
      console.error('Error sending invoice:', error);
      alert('Error sending invoice. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Invoice Email System</h1>
        <p className="text-gray-600">Send professional invoices via email with custom templates</p>
      </div>
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Client Name</label>
            <input
              type="text"
              value={formData.clientName}
              onChange={e => setFormData({ ...formData, clientName: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Invoice Number</label>
            <input
              type="text"
              value={formData.invoiceNumber}
              onChange={e => setFormData({ ...formData, invoiceNumber: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              required
            />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Amount ($)</label>
            <input
              type="number"
              value={formData.amount}
              onChange={e => setFormData({ ...formData, amount: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              min="0"
              step="0.01"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Due Date</label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Client Email</label>
          <input
            type="email"
            value={formData.clientEmail}
            onChange={e => setFormData({ ...formData, clientEmail: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Invoice PDF</label>
          <div className="relative">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
              id="pdf-upload"
              required
            />
            <label
              htmlFor="pdf-upload"
              className="flex items-center justify-center w-full p-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-all duration-200"
            >
              <div className="text-center">
                {selectedFile ? (
                  <div className="flex items-center space-x-3">
                    <FileText className="h-8 w-8 text-purple-600" />
                    <div>
                      <p className="text-sm font-semibold text-purple-600">{selectedFile.name}</p>
                      <p className="text-xs text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm font-semibold text-gray-600 mb-1">Click to upload invoice PDF</p>
                    <p className="text-xs text-gray-400">PDF files only, up to 10MB</p>
                  </div>
                )}
              </div>
            </label>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader className="h-5 w-5 animate-spin" />
              <span>Sending Invoice...</span>
            </>
          ) : (
            <>
              <Send className="h-5 w-5" />
              <span>Send Invoice Email</span>
            </>
          )}
        </button>
      </form>
      <div className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
        <h3 className="text-lg font-semibold text-purple-800 mb-3">Email Preview</h3>
        <div className="bg-white rounded-lg p-4 border border-purple-200">
          <p className="text-sm text-gray-600 mb-2">
            <strong>Subject:</strong> Invoice #{formData.invoiceNumber || '[Invoice Number]'} - ${formData.amount || '[Amount]'}
          </p>
          <div className="text-sm text-gray-700 leading-relaxed">
            <p>Dear {formData.clientName || '[Client Name]'},</p>
            <br />
            <p>I hope this email finds you well. Please find attached invoice #{formData.invoiceNumber || '[Invoice Number]'} for the amount of ${formData.amount || '[Amount]'}.</p>
            <br />
            <p>Payment is due by {formData.dueDate || '[Due Date]'}. Please don't hesitate to contact us if you have any questions.</p>
            <br />
            <p>Thank you for your business!</p>
            <br />
            <p>Best regards,<br />Your Team</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceEmails;