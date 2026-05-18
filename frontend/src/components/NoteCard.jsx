import { Button, Card, Stack } from 'react-bootstrap';

function formatDate(value) {
  if (!value) return 'N/A';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'N/A';
  return date.toLocaleString();
}

function NoteCard({ note, onEdit, onDelete }) {
  return (
    <Card className="h-100 shadow-sm border-0 note-card">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start gap-3">
          <div>
            <Card.Title className="fw-bold mb-2 text-break">{note.title}</Card.Title>
            <Card.Subtitle className="mb-3 text-muted small">
              Updated: {formatDate(note.updated_at || note.updatedAt || note.created_at)}
            </Card.Subtitle>
          </div>
        </div>
        <Card.Text className="note-preview preserve-line-breaks">
          {note.content}
        </Card.Text>
      </Card.Body>
      <Card.Footer className="bg-white border-0 pt-0 pb-3">
        <Stack direction="horizontal" gap={2}>
          <Button variant="outline-primary" size="sm" onClick={() => onEdit(note)}>
            Edit
          </Button>
          <Button variant="outline-danger" size="sm" onClick={() => onDelete(note.id)}>
            Delete
          </Button>
        </Stack>
      </Card.Footer>
    </Card>
  );
}

export default NoteCard;
