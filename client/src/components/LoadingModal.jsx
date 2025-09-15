import * as Dialog from '@radix-ui/react-dialog';

const LoadingModal = ({ open = false, message = 'Loading...' }) => (
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
          Loading
        </Dialog.Title>
        <div className="animate-spin mb-4" style={{ width: 40, height: 40, border: '4px solid #e5e7eb', borderTop: '4px solid #3b82f6', borderRadius: '50%' }} />
        <span id="loading-modal-desc" style={{ fontSize: 18, color: '#222' }}>{message}</span>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);

export default LoadingModal;
