import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Col, Container, Form, Row, Spinner } from 'react-bootstrap';
import AlertMessage from '../components/AlertMessage';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import NoteCard from '../components/NoteCard';
import NoteForm from '../components/NoteForm';
import { createNote, deleteNote, fetchNotes, updateNote } from '../api/noteApi';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../utils/errorHelpers';

function DashboardPage() {
  const { token, logout } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState({ variant: 'info', message: '' });
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [noteIdToDelete, setNoteIdToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleUnauthorized = useCallback(() => {
    logout();
    setAlert({ variant: 'danger', message: 'Your session expired. Please log in again.' });
  }, [logout]);

  const loadNotes = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchNotes(token);
      setNotes(Array.isArray(response.notes) ? response.notes : []);
    } catch (error) {
      if (error.status === 401) {
        handleUnauthorized();
      } else {
        setAlert({ variant: 'danger', message: getErrorMessage(error, 'Could not load notes') });
      }
    } finally {
      setLoading(false);
    }
  }, [token, handleUnauthorized]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  const filteredNotes = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return notes;
    return notes.filter(
      (note) =>
        note.title?.toLowerCase().includes(term) ||
        note.content?.toLowerCase().includes(term)
    );
  }, [notes, searchTerm]);

  const openCreateModal = () => {
    setSelectedNote(null);
    setShowNoteModal(true);
  };

  const openEditModal = (note) => {
    setSelectedNote(note);
    setShowNoteModal(true);
  };

  const closeNoteModal = () => {
    if (!submitting) {
      setShowNoteModal(false);
      setSelectedNote(null);
    }
  };

  const askDelete = (id) => {
    setNoteIdToDelete(id);
    setShowDeleteModal(true);
  };

  const handleNoteSubmit = async (payload, setFormAlert) => {
    try {
      setSubmitting(true);
      if (selectedNote?.id) {
        const response = await updateNote(token, selectedNote.id, payload);
        setNotes((prev) => prev.map((note) => (note.id === selectedNote.id ? response.note : note)));
        setAlert({ variant: 'success', message: response.message || 'Note updated successfully' });
      } else {
        const response = await createNote(token, payload);
        setNotes((prev) => [response.note, ...prev]);
        setAlert({ variant: 'success', message: response.message || 'Note created successfully' });
      }
      setShowNoteModal(false);
      setSelectedNote(null);
    } catch (error) {
      if (error.status === 401) {
        handleUnauthorized();
      } else {
        setFormAlert({ variant: 'danger', message: getErrorMessage(error, 'Could not save note') });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!noteIdToDelete) return;

    try {
      setSubmitting(true);
      const response = await deleteNote(token, noteIdToDelete);
      setNotes((prev) => prev.filter((note) => note.id !== noteIdToDelete));
      setAlert({ variant: 'success', message: response.message || 'Note deleted successfully' });
      setShowDeleteModal(false);
      setNoteIdToDelete(null);
    } catch (error) {
      if (error.status === 401) {
        handleUnauthorized();
      } else {
        setAlert({ variant: 'danger', message: getErrorMessage(error, 'Could not delete note') });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="py-4">
      <Row className="align-items-center mb-3 g-3">
        <Col md={8}>
          <h2 className="fw-bold mb-1">My Notes</h2>
          <p className="text-muted mb-0">Create, update, search, and delete your personal notes.</p>
        </Col>
        <Col md={4} className="text-md-end">
          <Button onClick={openCreateModal}>Create Note</Button>
        </Col>
      </Row>

      <AlertMessage
        variant={alert.variant}
        message={alert.message}
        onClose={() => setAlert((prev) => ({ ...prev, message: '' }))}
      />

      <Row className="mb-4 g-3">
        <Col md={6} lg={5}>
          <Form.Control
            type="search"
            placeholder="Search notes by title or content"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            maxLength={120}
          />
        </Col>
      </Row>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status" />
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="empty-state text-center py-5 bg-white rounded-4 shadow-sm">
          <h5 className="fw-bold">No notes found</h5>
          <p className="text-muted mb-3">
            {notes.length === 0
              ? 'Start by creating your first secure note.'
              : 'No notes match your current search.'}
          </p>
          {notes.length === 0 && <Button onClick={openCreateModal}>Create First Note</Button>}
        </div>
      ) : (
        <Row className="g-4">
          {filteredNotes.map((note) => (
            <Col md={6} lg={4} key={note.id}>
              <NoteCard note={note} onEdit={openEditModal} onDelete={askDelete} />
            </Col>
          ))}
        </Row>
      )}

      <NoteForm
        show={showNoteModal}
        onHide={closeNoteModal}
        onSubmit={handleNoteSubmit}
        loading={submitting}
        initialData={selectedNote}
        mode={selectedNote ? 'edit' : 'create'}
      />

      <DeleteConfirmModal
        show={showDeleteModal}
        onHide={() => !submitting && setShowDeleteModal(false)}
        onConfirm={handleDelete}
        loading={submitting}
      />
    </Container>
  );
}

export default DashboardPage;
