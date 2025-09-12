import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Mail, Download, ArrowRight } from 'lucide-react';

const Dashboard = () => {
  const features = [
    {
      title: 'PDF Proposal Generator',
      description: 'Create professional proposals using pre-made templates with custom form data',
      icon: FileText,
      path: '/proposal-generator',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      title: 'Invoice Emails',
      description: 'Send invoices via email with custom templates and file attachments',
      icon: Mail,
      path: '/invoice-emails',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
    {
      title: 'Proposal Emails',
      description: 'Send professional proposal emails with custom content and attachments',
      icon: Download,
      path: '/proposal-emails',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">PDF Pro Suite</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Your all-in-one solution for PDF generation, email automation, and document management. 
          Choose from our powerful tools below to get started.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Link
              key={index}
              to={feature.path}
              className="group block"
            >
              <div className={`${feature.bgColor} rounded-2xl p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border border-white/50`}>
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {feature.description}
                </p>
                
                <div className={`flex items-center space-x-2 ${feature.textColor} font-semibold group-hover:translate-x-1 transition-transform duration-300`}>
                  <span>Get Started</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Need Help Getting Started?</h2>
        <p className="text-blue-100 text-lg mb-6 max-w-2xl mx-auto">
          Our system is designed to be intuitive and powerful. Each tool has been crafted to handle 
          professional document workflows with ease.
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <div className="flex items-center space-x-2 bg-white/20 rounded-lg px-4 py-2">
            <FileText className="h-4 w-4" />
            <span>Professional Templates</span>
          </div>
          <div className="flex items-center space-x-2 bg-white/20 rounded-lg px-4 py-2">
            <Mail className="h-4 w-4" />
            <span>Email Automation</span>
          </div>
          <div className="flex items-center space-x-2 bg-white/20 rounded-lg px-4 py-2">
            <Download className="h-4 w-4" />
            <span>Instant Downloads</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;