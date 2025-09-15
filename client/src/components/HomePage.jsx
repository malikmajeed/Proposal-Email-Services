import React from 'react';
import { FileText, Send, Receipt, LogOut } from 'lucide-react';

const HomePage = ({ onNavigate, onLogout }) => {

  const actions = [
    {
      id: 'create-proposal',
      title: 'Create Proposal',
      icon: FileText,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      id: 'create-invoice',
      title: 'Create Invoice',
      icon: Receipt,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
    {
      id: 'send-proposal',
      title: 'Send Proposal',
      icon: Send,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      id: 'send-invoice',
      title: 'Send Invoice',
      icon: Receipt,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">

          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            BlueWolf Int'l Security
          </h1>
          <p className="text-gray-600 text-sm">
            proposals & Invoices managment
          </p>
          <button
            onClick={onLogout}
            className="mt-4 flex items-center justify-center mx-auto px-4 py-2 text-sm text-gray-600 hover:text-red-600 transition-colors border border-red-300 rounded-lg"
          >
            <LogOut className="h-4 w-4 mr-2 " />
            Logout
          </button>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={() => onNavigate(action.id)}
                className={`w-full ${action.bgColor} rounded-2xl border-2 border-blue-400 p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 active:scale-95`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {action.title}
                    </h3>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-xs text-gray-500">
            For Private Use Only
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
