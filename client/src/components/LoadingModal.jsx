import * as Dialog from '@radix-ui/react-dialog';
import { CheckCircle } from 'lucide-react';

const LoadingModal = ({ open = false, message = 'Loading...', type = 'loading' }) => {
  // Don't render if not open to prevent multiple instances
  if (!open) return null;
  
  const renderIcon = () => {
    if (type === 'success') {
      return (
        <div className="mb-4" style={{ 
          width: 40, 
          height: 40, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          animation: 'successPulse 0.6s ease-in-out'
        }}>
          <CheckCircle 
            size={40} 
            color="#10b981" 
            style={{ 
              filter: 'drop-shadow(0 2px 4px rgba(16, 185, 129, 0.3))'
            }} 
          />
        </div>
      );
    }
    
    return (
      <div className="animate-spin mb-4" style={{ 
        width: 40, 
        height: 40, 
        border: '4px solid #e5e7eb', 
        borderTop: '4px solid #3b82f6', 
        borderRadius: '50%' 
      }} />
    );
  };

  const getMessageStyle = () => {
    if (type === 'success') {
      return { fontSize: 18, color: '#10b981', fontWeight: '600' };
    }
    return { fontSize: 18, color: '#222' };
  };
  
  return (
    <Dialog.Root open={open}>
      <Dialog.Portal>
        <Dialog.Overlay style={{
          background: 'rgba(0,0,0,0.4)',
          position: 'fixed',
          inset: 0,
          zIndex: 1000
        }} />
        <Dialog.Content
          aria-describedby="loading-modal-desc"
          aria-labelledby="loading-modal-title"
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'white',
            borderRadius: 8,
            padding: 32,
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 1001
          }}
        >
          <Dialog.Title id="loading-modal-title" style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', border: 0 }}>
            {type === 'success' ? 'Success' : 'Loading'}
          </Dialog.Title>
          <Dialog.Description id="loading-modal-desc" style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', border: 0 }}>
            {type === 'success' ? 'Success modal' : 'Loading modal'}
          </Dialog.Description>
          {renderIcon()}
          <span style={getMessageStyle()}>{message}</span>
        </Dialog.Content>
        <style jsx>{`
          @keyframes successPulse {
            0% { transform: scale(0.8); opacity: 0; }
            50% { transform: scale(1.1); opacity: 0.8; }
            100% { transform: scale(1); opacity: 1; }
          }
        `}</style>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default LoadingModal;
