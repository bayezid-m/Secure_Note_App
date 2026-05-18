import { useEffect, useState } from 'react';
import { Button, Card, Form, Modal } from 'react-bootstrap';
import AlertMessage from './AlertMessage';
import { normalizeNotePayload, validateNote } from '../utils/validation';

const initialState = {
  title: '',
  content: '',
};

function NoteForm({ show, onHide, onSubmit, loading, initialData, mode = 'create' }) {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ variant: 'danger', message: '' });

  useEffect(() => {
    if (show) {
      setFormData({
        title: initialData?.title || '',
        content: initialData?.content || '',
      });
      setErrors({});
      setAlert({ variant: 'danger', message: '' });
    }
  }, [show, initialData]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateNote(formData.title, formData.content);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setAlert({ variant: 'danger', message: 'Please fix the highlighted note fields.' });
      return;
    }

    const payload = normalizeNotePayload(formData.title, formData.content);
    await onSubmit(payload, setAlert);
  };

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{mode === 'edit' ? 'Edit Note' : 'Create Note'}</Modal.Title>
      </Modal.Header>
      <Form noValidate onSubmit={handleSubmit}>
        <Modal.Body>
          <AlertMessage variant={alert.variant} message={alert.message} />
          <Card className="border-0">
            <Card.Body className="p-0">
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  isInvalid={Boolean(errors.title)}
                  maxLength={255}
                  required
                />
                <div className="small text-muted mt-1">{formData.title.trim().length}/255</div>
                <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group>
                <Form.Label>Content</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={8}
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  isInvalid={Boolean(errors.content)}
                  maxLength={5000}
                  required
                />
                <div className="small text-muted mt-1">{formData.content.trim().length}/5000</div>
                <Form.Control.Feedback type="invalid">{errors.content}</Form.Control.Feedback>
              </Form.Group>
            </Card.Body>
          </Card>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={onHide} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : mode === 'edit' ? 'Update Note' : 'Create Note'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default NoteForm;
