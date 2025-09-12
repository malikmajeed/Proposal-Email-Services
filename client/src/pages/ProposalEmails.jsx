import React, { useState } from 'react';
import { Upload, Send, Loader, FileText } from 'lucide-react';

const ProposalEmails = () => {
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    clientName: '',
    proposalTitle: '',
    validUntil: '',
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
      alert('Please select a proposal PDF file.');
      return;
    }
    setLoading(true);
    const form = new FormData();
    form.append('pdf', selectedFile);
    form.append('clientName', formData.clientName);
    form.append('proposalTitle', formData.proposalTitle);
    form.append('validUntil', formData.validUntil);
    form.append('clientEmail', formData.clientEmail);
    try {
      const response = await fetch('http://localhost:3001/api/send-proposal', {
        method: 'POST',
        body: form,
      });
      if (response.ok) {
        alert('Proposal sent successfully!');
        setFormData({
          clientName: '',
          proposalTitle: '',
          validUntil: '',
          clientEmail: '',
        });
        setSelectedFile(null);
      } else {
        alert('Failed to send proposal. Please try again.');
      }
    } catch (error) {
      console.error('Error sending proposal:', error);
      alert('Error sending proposal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Proposal Email System</h1>
        <p className="text-gray-600">Send professional proposals via email with persuasive templates</p>
      </div>
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Client Name</label>
            <input
              type="text"
              value={formData.clientName}
              onChange={e => setFormData({ ...formData, clientName: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Client Email</label>
            <input
              type="email"
              value={formData.clientEmail}
              onChange={e => setFormData({ ...formData, clientEmail: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Proposal Title</label>
            <input
              type="text"
              value={formData.proposalTitle}
              onChange={e => setFormData({ ...formData, proposalTitle: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="e.g., Security Services Proposal"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Valid Until</label>
            <input
              type="date"
              value={formData.validUntil}
              onChange={e => setFormData({ ...formData, validUntil: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Proposal PDF</label>
          <div className="relative">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
              id="proposal-upload"
              required
            />
            <label
              htmlFor="proposal-upload"
              className="flex items-center justify-center w-full p-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-500 hover:bg-green-50 transition-all duration-200"
            >
              <div className="text-center">
                {selectedFile ? (
                  <div className="flex items-center space-x-3">
                    <FileText className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="text-sm font-semibold text-green-600">{selectedFile.name}</p>
                      <p className="text-xs text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm font-semibold text-gray-600 mb-1">Click to upload proposal PDF</p>
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
          className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-teal-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader className="h-5 w-5 animate-spin" />
              <span>Sending Proposal...</span>
            </>
          ) : (
            <>
              <Send className="h-5 w-5" />
              <span>Send Proposal Email</span>
            </>
          )}
        </button>
      </form>
      <div className="mt-8 bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl p-6 border border-green-100">
        <h3 className="text-lg font-semibold text-green-800 mb-3">Email Preview</h3>
        <div className="bg-white rounded-lg p-4 border border-green-200">
          <p className="text-sm text-gray-600 mb-2">
            <strong>Subject:</strong> {formData.proposalTitle || '[Proposal Title]'} - Exclusive Opportunity
          </p>
          <div className="text-sm text-gray-700 leading-relaxed">
            <p>Dear {formData.clientName || '[Client Name]'},</p>
            <br />
            <p>I hope this message finds you well. I'm excited to present you with an exclusive opportunity that I believe will add tremendous value to your organization.</p>
            <br />
            <p>Please find attached our detailed proposal: "{formData.proposalTitle || '[Proposal Title]'}". This comprehensive solution has been carefully crafted to address your specific needs and objectives.</p>
            <br />
            <p>Key highlights of our proposal include:</p>
            <ul className="list-disc ml-6 my-2">
              <li>Customized solutions tailored to your requirements</li>
              <li>Competitive pricing with exceptional value</li>
              <li>Proven track record of successful implementations</li>
              <li>Dedicated support throughout the engagement</li>
            </ul>
            <br />
            <p>This proposal is valid until {formData.validUntil || '[Valid Until Date]'}. I would love to discuss this opportunity with you further and answer any questions you may have.</p>
            <br />
            <p>Thank you for considering our services. I look forward to the possibility of working together.</p>
            <br />
            <p>Best regards,<br />Your Business Development Team</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalEmails;