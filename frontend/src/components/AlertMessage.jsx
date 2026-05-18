import { Alert } from 'react-bootstrap';

function AlertMessage({ variant = 'info', message, onClose }) {
  if (!message) return null;

  return (
    <Alert variant={variant} dismissible={Boolean(onClose)} onClose={onClose} className="mb-3">
      {message}
    </Alert>
  );
}

export default AlertMessage;
