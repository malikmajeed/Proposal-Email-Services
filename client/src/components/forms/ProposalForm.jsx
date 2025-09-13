import React, { useState } from 'react';
import { useGenerateProposal } from '../../hooks/useProposal';
import { ArrowLeft, Plus, Trash2, Download, Loader } from 'lucide-react';

const ProposalForm = ({ onBack }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    company: '',
    address: '',
    paymentTerms: '',
    termination: '',
    serviceStartDate: '',
    note: '',
  });

  const [serviceRows, setServiceRows] = useState([
    { id: 1, service: 'Unarmed Guard', hourlyRate: 0, hours: 1, guards: 1, totalCost: 0 }
  ]);

  const generateProposal = useGenerateProposal();

  const updateServiceRow = (id, field, value) => {
    setServiceRows(rows => rows.map(row => {
      if (row.id === id) {
        const updated = { ...row, [field]: value };
        const rate = parseFloat(updated.hourlyRate) || 0;
        const hrs = parseFloat(updated.hours) || 0;
        const numGuards = parseInt(updated.guards) || 0;
        updated.hourlyRate = rate;
        updated.totalCost = parseFloat((rate * hrs * numGuards).toFixed(2));
        return updated;
      }
      return row;
    }));
  };

  const addServiceRow = () => {
    const newId = Math.max(...serviceRows.map(r => r.id)) + 1;
    setServiceRows([...serviceRows, {
      id: newId,
      service: 'Unarmed Guard',
      hourlyRate: 0,
      hours: 1,
      guards: 1,
      totalCost: 0
    }]);
  };

  const removeServiceRow = (id) => {
    if (serviceRows.length > 1) {
      setServiceRows(serviceRows.filter(row => row.id !== id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    generateProposal.mutate({
      ...formData,
      services: serviceRows,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={onBack}
            className="mr-4 p-2 rounded-lg bg-white shadow-sm hover:bg-gray-50"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">Create Proposal</h1>
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
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
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
                  value={formData.contact}
                  onChange={e => setFormData({ ...formData, contact: e.target.value })}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Terms *</label>
                <input
                  type="text"
                  value={formData.paymentTerms}
                  onChange={e => setFormData({ ...formData, paymentTerms: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Termination *</label>
                <input
                  type="text"
                  value={formData.termination}
                  onChange={e => setFormData({ ...formData, termination: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                  required
                />
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="bg-white rounded-xl p-1 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Services</h2>
              <button
                type="button"
                onClick={addServiceRow}
                className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded-lg text-sm"
              >
                <Plus className="h-4 w-4" />
                <span>Add</span>
              </button>
            </div>
            
            {/* Table Headers */}
            <div className="grid grid-cols-12 gap-1 mb-2 p-2 bg-gray-100 rounded-lg font-medium text-xs text-gray-700">
              <div className="col-span-1 text-center">#</div>
              <div className="col-span-3 text-left">Service(s)</div>
              <div className="col-span-2 text-center">Rate</div>
              <div className="col-span-2 text-center">Hours</div>
              <div className="col-span-2 text-center">Guards</div>
              <div className="col-span-2 text-center">Cost</div>
            </div>
            
            <div className="space-y-2">
              {serviceRows.map((row, index) => (
                <div key={row.id} className="grid grid-cols-12 gap-1 p-2 bg-gray-50 rounded-lg">
                  <div className="col-span-1 flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-600">{index + 1}</span>
                  </div>
                  <div className="col-span-3">
                    <input
                      type="text"
                      value={row.service}
                      onChange={e => updateServiceRow(row.id, 'service', e.target.value)}
                      className="w-full p-1 border border-gray-300 rounded text-xs"
                      placeholder="Service type"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      value={row.hourlyRate}
                      onChange={e => updateServiceRow(row.id, 'hourlyRate', parseFloat(e.target.value) || 0)}
                      className="w-full p-1 border border-gray-300 rounded text-xs"
                      placeholder="Rate"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      value={row.hours}
                      onChange={e => updateServiceRow(row.id, 'hours', parseFloat(e.target.value) || 0)}
                      className="w-full p-1 border border-gray-300 rounded text-xs"
                      placeholder="Hours"
                      min="0"
                      step="0.1"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      value={row.guards}
                      onChange={e => updateServiceRow(row.id, 'guards', parseInt(e.target.value) || 0)}
                      className="w-full p-1 border border-gray-300 rounded text-xs"
                      placeholder="Guards"
                      min="1"
                    />
                  </div>
                  <div className="col-span-2 flex items-center justify-between">
                    <span className="text-xs font-medium text-green-600">
                      ${row.totalCost.toFixed(2)}
                    </span>
                    {serviceRows.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeServiceRow(row.id)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Terms */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="grid grid-cols-2 gap-4">
             
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={formData.serviceStartDate}
                  onChange={e => setFormData({ ...formData, serviceStartDate: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>
           
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                value={formData.note}
                onChange={e => setFormData({ ...formData, note: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg text-sm h-20"
                placeholder="Additional terms or conditions..."
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={generateProposal.isPending}
            className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {generateProposal.isPending ? (
              <>
                <Loader className="h-5 w-5 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Download className="h-5 w-5" />
                <span>Generate PDF</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProposalForm;
