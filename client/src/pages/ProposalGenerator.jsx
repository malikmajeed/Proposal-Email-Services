import React, { useState, useRef } from 'react';
import { Plus, Trash2, Download, Loader } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
// import pdfFile from './uploads/Security Service Proposal .pdf';

const FIELD_LIST = [
  { key: 'title', label: 'Title' },
  { key: 'name', label: 'Name' },
  { key: 'company', label: 'Company' },
  { key: 'address', label: 'Address' },
  { key: 'email', label: 'Email' },
  { key: 'contact', label: 'Contact' },
  { key: 'paymentTerms', label: 'Payment Terms' },
  { key: 'termination', label: 'Termination' },
  { key: 'note', label: 'Note' },
  { key: 'serviceStartDate', label: 'Services Start Date' },
];

const ProposalGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: 'Mr.',
    name: '',
    address: '',
    email: '',
    contact: '',
    company: '',
    termination: '',
    paymentTerms: '',
    serviceStartDate: '',
    note: '',
  });
  const [serviceRows, setServiceRows] = useState([
    { id: 1, service: 'Armed Guard', hourlyRate: 0.0, hours: 1, guards: 1, totalCost: 0.0 }
  ]);
  const [pdfFile, setPdfFile] = useState('/server/template/Security Service Proposal .pdf');
  const [selectedField, setSelectedField] = useState(FIELD_LIST[0].key);
  const [fieldCoords, setFieldCoords] = useState({});
  const [numPages, setNumPages] = useState(null);
  const pdfWrapperRef = useRef(null);

  const updateServiceRow = (id, field, value) => {
    setServiceRows(rows => rows.map(row => {
      if (row.id === id) {
        const updated = { ...row, [field]: value };
        const rate = parseFloat(updated.hourlyRate) || 0.0;
        const hrs = parseFloat(updated.hours) || 0.0;
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
      hourlyRate: 0.0,
      hours: 1,
      guards: 1,
      totalCost: 0.0
    }]);
  };

  const removeServiceRow = (id) => {
    if (serviceRows.length > 1) {
      setServiceRows(serviceRows.filter(row => row.id !== id));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/generate-proposal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          services: serviceRows,
        }),
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `proposal-${formData.name.replace(/\s+/g, '-').toLowerCase()}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePdfClick = (event, pageNumber) => {
    const wrapper = pdfWrapperRef.current;
    if (!wrapper) return;
    const rect = wrapper.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setFieldCoords(coords => ({
      ...coords,
      [selectedField]: { page: pageNumber, x, y }
    }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">PDF Proposal Generator</h1>
        <p className="text-gray-600">Create professional security service proposals with custom details</p>
      </div>
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
            <select
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Mr.">Mr.</option>
              <option value="Mrs.">Mrs.</option>
              <option value="Ms.">Ms.</option>
              <option value="None">None</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
          <textarea
            value={formData.address}
            onChange={e => setFormData({ ...formData, address: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-20"
            required
          />
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Contact</label>
            <input
              type="tel"
              value={formData.contact}
              onChange={e => setFormData({ ...formData, contact: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Company</label>
            <input
              type="text"
              value={formData.company}
              onChange={e => setFormData({ ...formData, company: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Termination Clause</label>
            <input
              type="text"
              value={formData.termination}
              onChange={e => setFormData({ ...formData, termination: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 30 days notice required"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Terms</label>
            <input
              type="text"
              value={formData.paymentTerms}
              onChange={e => setFormData({ ...formData, paymentTerms: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Net 30 days"
            />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Services Start Date</label>
            <input
              type="date"
              value={formData.serviceStartDate}
              onChange={e => setFormData({ ...formData, serviceStartDate: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">Services</h3>
            <button
              type="button"
              onClick={addServiceRow}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <Plus className="h-4 w-4" />
              <span>Add Service</span>
            </button>
          </div>
          <div className="space-y-3">
            {serviceRows.map((row, index) => (
              <div key={row.id} className="grid grid-cols-12 gap-3 items-end p-4 bg-gray-50 rounded-lg">
                <div className="col-span-1">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Sr. No.</label>
                  <div className="p-2 bg-white border border-gray-300 rounded text-center text-sm font-semibold">
                    {index + 1}
                  </div>
                </div>
                <div className="col-span-3">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Service Type</label>
                  <select
                    value={row.service}
                    onChange={e => updateServiceRow(row.id, 'service', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Armed Guard">Armed Guard</option>
                    <option value="Unarmed Guard">Unarmed Guard</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Hourly Rate ($)</label>
                  <input
                    type="number"
                    value={row.hourlyRate}
                    onChange={e => updateServiceRow(row.id, 'hourlyRate', parseFloat(e.target.value) || 0.0)}
                    className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Hours</label>
                  <input
                    type="number"
                    value={row.hours}
                    onChange={e => updateServiceRow(row.id, 'hours', parseFloat(e.target.value) || 0.0)}
                    className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                    min="0"
                    step="0.1"
                  />
                </div>
                <div className="col-span-1">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Guards</label>
                  <input
                    type="number"
                    value={row.guards}
                    onChange={e => updateServiceRow(row.id, 'guards', parseInt(e.target.value) || 1)}
                    className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                    min="1"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Total Cost</label>
                  <div className="p-2 bg-white border border-gray-300 rounded text-sm font-semibold text-green-600">
                    ${Number(row.totalCost).toFixed(2)}
                  </div>
                </div>
                <div className="col-span-1">
                  {serviceRows.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeServiceRow(row.id)}
                      className="w-full p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200"
                    >
                      <Trash2 className="h-4 w-4 mx-auto" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Additional Notes</label>
          <textarea
            value={formData.note}
            onChange={e => setFormData({ ...formData, note: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24"
            placeholder="Any additional terms or conditions..."
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader className="h-5 w-5 animate-spin" />
              <span>Generating PDF...</span>
            </>
          ) : (
            <>
              <Download className="h-5 w-5" />
              <span>Download PDF Proposal</span>
            </>
          )}
        </button>
      </form>
      <h2 className="text-lg font-bold mt-8 mb-2">PDF Field Placement</h2>
      <div className="flex gap-4 mb-4">
        <label>Select Field:</label>
        <select value={selectedField} onChange={e => setSelectedField(e.target.value)}>
          {FIELD_LIST.map(f => (
            <option key={f.key} value={f.key}>{f.label}</option>
          ))}
        </select>
        <span className="text-sm text-gray-500">Click on the PDF to set the position for the selected field.</span>
      </div>
      <div ref={pdfWrapperRef} style={{ position: 'relative', display: 'inline-block', border: '1px solid #ccc' }}>
        <Document
          file={pdfFile}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        >
          {Array.from(new Array(numPages), (el, idx) => (
            <div key={idx} style={{ position: 'relative' }}>
              <Page
                pageNumber={idx + 1}
                width={600}
                onClick={e => handlePdfClick(e, idx + 1)}
              />
              {Object.entries(fieldCoords).map(([field, coord]) =>
                coord.page === idx + 1 ? (
                  <div
                    key={field}
                    style={{
                      position: 'absolute',
                      left: coord.x - 8,
                      top: coord.y - 8,
                      width: 16,
                      height: 16,
                      background: 'red',
                      borderRadius: '50%',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 10,
                      pointerEvents: 'none',
                    }}
                    title={field}
                  >
                    {field}
                  </div>
                ) : null
              )}
            </div>
          ))}
        </Document>
      </div>
      <div className="mt-4">
        <h3 className="font-semibold">Field Coordinates:</h3>
        <pre className="bg-gray-100 p-2 rounded text-xs">{JSON.stringify(fieldCoords, null, 2)}</pre>
      </div>
    </div>
  );
};

export default ProposalGenerator;
