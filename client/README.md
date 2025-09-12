# PDF Management System

A comprehensive web application for PDF generation and email automation, built with React and Node.js.

## Features

### System 1: PDF Proposal Generator
- Create professional security service proposals using pre-made templates
- Dynamic form with client information, services, pricing, and terms
- Auto-calculated totals and professional PDF output
- Instant PDF download functionality

### System 2: Invoice Email System  
- Send invoices via email with custom HTML templates
- File upload for PDF invoices
- Professional email formatting with invoice details
- Automatic email delivery with attachments

### System 3: Proposal Email System
- Send business proposals via email with persuasive templates
- File upload for proposal PDFs
- Professional email templates with call-to-action content
- Customizable proposal details and validity periods

## Technology Stack

**Frontend:**
- React 18 with TypeScript
- React Router for navigation
- Tailwind CSS for styling
- Lucide React for icons

**Backend:**
- Node.js with Express
- pdf-lib for PDF manipulation
- Nodemailer for email sending
- Multer for file uploads
- CORS for cross-origin requests

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository and install frontend dependencies:**
   ```bash
   npm install
   ```

2. **Install backend dependencies:**
   ```bash
   cd server
   npm install
   cd ..
   ```

3. **Set up environment variables:**
   Create a `.env` file in the server directory with your email configuration:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

### Running the Application

1. **Start the backend server:**
   ```bash
   cd server
   npm start
   ```
   The server will run on `http://localhost:3001`

2. **Start the frontend development server:**
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

## Project Structure

```
├── src/
│   ├── components/
│   │   └── Navbar.tsx
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── ProposalGenerator.tsx
│   │   ├── InvoiceEmails.tsx
│   │   └── ProposalEmails.tsx
│   ├── App.tsx
│   └── main.tsx
├── server/
│   ├── server.js
│   ├── package.json
│   └── uploads/ (created automatically)
└── README.md
```

## API Endpoints

- `POST /api/generate-proposal` - Generate and download PDF proposal
- `POST /api/send-invoice` - Send invoice via email
- `POST /api/send-proposal` - Send proposal via email
- `GET /health` - Health check endpoint

## Email Configuration

The system uses Nodemailer for sending emails. Configure your SMTP settings in the server environment variables:

- For Gmail: Use App Passwords instead of regular passwords
- For other providers: Update the SMTP configuration in `server/server.js`

## Features Overview

### Dashboard
- Clean, modern interface with gradient design
- Quick access to all three systems
- Feature highlights and navigation

### PDF Generation
- Dynamic form with real-time calculations
- Professional PDF templates
- Multiple service rows with add/remove functionality
- Instant download capability

### Email Systems
- Rich HTML email templates
- File upload with validation
- Professional email formatting
- Error handling and user feedback

## Deployment

### Frontend Deployment
Build the React app for production:
```bash
npm run build
```

### Backend Deployment
The Node.js server can be deployed to any hosting service that supports Node.js:
- Set environment variables for production
- Configure SMTP settings
- Ensure file upload directory permissions
- Set up process management (PM2 recommended)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please create an issue in the repository or contact the development team.