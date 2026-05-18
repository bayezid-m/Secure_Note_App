import { Button, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <Container className="py-5 text-center">
      <h1 className="display-6 fw-bold">Page not found</h1>
      <p className="text-muted">The page you requested does not exist.</p>
      <Button as={Link} to="/">Go Home</Button>
    </Container>
  );
}

export default NotFoundPage;
