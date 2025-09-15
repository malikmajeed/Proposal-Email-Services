import React, { useState } from 'react';
import LoadingModal from '../LoadingModal';
import { ArrowLeft, Plus, Trash2, Download, Loader } from 'lucide-react';
import { useGenerateInvoice } from '../../hooks/useInvoice';

const getCurrentUSTimeDate = () => {
  const now = new Date();
  return now.toISOString().split('T')[0]; // yyyy-mm-dd for input type="date"
};

const InvoiceForm = ({ onBack }) => {
  const [formData, setFormData] = useState({
    clientName: '',
    company: '',
    address: '',
    email: '',
    phone: '',
    invoiceNo: '',
    invoiceDate: '', // allow user to edit, default to blank
    paymentTerms: '', // numbers only
    invoiceTimeFrame: '', // string for invoice timeframe
  });

  const [rows, setRows] = useState([
    { id: 1, description: 'Unarmed Guard', rate: 0, hours: 1, guards: 1, cost: 0 }
  ]);

  const generateInvoice = useGenerateInvoice();

  const updateRow = (id, field, value) => {
    setRows(rows => rows.map(row => {
      if (row.id === id) {
        const updated = { ...row, [field]: value };
        const rate = parseFloat(updated.rate) || 0;
        const hrs = parseFloat(updated.hours) || 0;
        const numGuards = parseInt(updated.guards) || 0;
        updated.rate = rate;
        updated.cost = parseFloat((rate * hrs * numGuards).toFixed(2));
        return updated;
      }
      return row;
    }));
  };

  const addRow = () => {
    const newId = Math.max(...rows.map(r => r.id)) + 1;
    setRows([...rows, {
      id: newId,
      description: 'Unarmed Guard',
      rate: 0,
      hours: 1,
      guards: 1,
      cost: 0
    }]);
  };

  const removeRow = (id) => {
    if (rows.length > 1) {
      setRows(rows.filter(row => row.id !== id));
    }
  };

  const subtotal = rows.reduce((sum, row) => sum + row.cost, 0);

  // Calculate due date based on invoice date and payment terms (days)
  const getDueDate = () => {
    const dateStr = formData.invoiceDate || getCurrentUSTimeDate();
    const date = new Date(dateStr);
    const days = parseInt(formData.paymentTerms) || 0;
    date.setDate(date.getDate() + days);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // If invoiceDate is blank, use today's date
    const invoiceDate = formData.invoiceDate || getCurrentUSTimeDate();
    generateInvoice.mutate({
      ...formData,
      invoiceDate,
      rows,
      subtotal,
      dueDate: getDueDate(),
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <LoadingModal open={generateInvoice.isPending} message={
        <span>
          <span className="block text-blue-600 font-bold text-lg mb-2 animate-pulse">Generating Invoice PDF...</span>
          <span className="block text-gray-500 text-sm">This may take a few seconds. Please wait!</span>
        </span>
      } />
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={onBack}
            className="mr-4 p-2 rounded-lg bg-white shadow-sm hover:bg-gray-50"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">Create Invoice</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Client Info */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Client Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  value={formData.clientName}
                  onChange={e => setFormData({ ...formData, clientName: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm"
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
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={e => setFormData({ ...formData, company: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg text-sm h-16"
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Invoice No *</label>
                <input
                  type="text"
                  value={formData.invoiceNo}
                  onChange={e => setFormData({ ...formData, invoiceNo: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Date *</label>
                <input
                  type="date"
                  value={formData.invoiceDate || getCurrentUSTimeDate()}
                  onChange={e => setFormData({ ...formData, invoiceDate: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Terms (days)</label>
                <input
                  type="number"
                  value={formData.paymentTerms}
                  onChange={e => setFormData({ ...formData, paymentTerms: e.target.value.replace(/[^0-9]/g, '') })}
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input
                  type="text"
                  value={getDueDate()}
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-gray-100"
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="bg-white rounded-xl p-3 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Services</h2>
              <button
                type="button"
                onClick={addRow}
                className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded-lg text-sm"
              >
                <Plus className="h-4 w-4" />
                <span>Add</span>
              </button>
            </div>
            <div className="space-y-2">
              {rows.map((row, index) => (
                <div key={row.id} className="space-y-2 border-b border-gray-400 pb-2">
                  <div className="grid grid-cols-12 gap-1 p-2 rounded-lg">
                    <div className="col-span-2 flex flex-col items-start justify-between">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Sr.</label>
                      <p className="text-sm font-medium text-gray-600">{index + 1}</p>
                    </div>
                    <div className="col-span-7">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Service(s)</label>
                      <input
                        type="text"
                        value={row.description}
                        onChange={e => updateRow(row.id, 'description', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="Service type"
                      />
                    </div>
                    <div className="col-span-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rate/hr</label>
                      <input
                        type="number"
                        value={row.rate}
                        onChange={e => updateRow(row.id, 'rate', parseFloat(e.target.value) || 0)}
                        className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="Rate"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-3 p-2 rounded-lg">
                    <div className="col-span-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Hours</label>
                      <input
                        type="number"
                        value={row.hours}
                        onChange={e => updateRow(row.id, 'hours', parseFloat(e.target.value) || 0)}
                        className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="Hours"
                        min="0"
                        step="0.1"
                      />
                    </div>
                    <div className="col-span-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Guards</label>
                      <input
                        type="number"
                        value={row.guards}
                        onChange={e => updateRow(row.id, 'guards', parseInt(e.target.value) || 0)}
                        className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="Guards"
                        min="1"
                      />
                    </div>
                    <div className="col-span-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Cost</label>
                      <input
                        type="text"
                        value={`$${row.cost.toFixed(2)}`}
                        readOnly
                        className="w-full p-1 border border-gray-300 rounded text-sm text-green-600 font-medium bg-gray-50 text-right"
                      />
                    </div>
                    <div className="col-span-2 flex flex-col items-end justify-end">
                      {rows.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeRow(row.id)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded-lg border border-red-200 hover:border-red-300 transition-colors"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-4">
              <div className="text-[12px] font-normal text-black">Subtotal: <span className="font-bold">${subtotal.toFixed(2)}</span></div>
            </div>
          </div>

          {/* Invoice Time Frame */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Invoice Details</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Time Frame</label>
              <input
                type="text"
                value={formData.invoiceTimeFrame}
                onChange={e => setFormData({ ...formData, invoiceTimeFrame: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                placeholder="e.g: Aug 23, 6am - Sep 3, 5pm"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={generateInvoice.isPending}
            className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {generateInvoice.isPending ? (
              <>
                <Loader className="h-5 w-5 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Download className="h-5 w-5" />
                <span>Create Invoice</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default InvoiceForm;
