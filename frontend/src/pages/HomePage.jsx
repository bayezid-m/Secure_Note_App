import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={10}>
          <Card className="border-0 shadow-sm hero-card">
            <Card.Body className="p-4 p-md-5">
              <Row className="align-items-center g-4">
                <Col md={7}>
                  <h1 className="display-5 fw-bold mb-3">Secure Notes Application</h1>
                  <p className="lead text-muted mb-4">
                    Simple application for storing your secure notes. It covers common web based vulneribilities mentioned by OWASP top 10.
                  </p>
                  <div className="d-flex flex-wrap gap-2">
                    <Button as={Link} to="/register">Get Started</Button>
                    <Button as={Link} to="/login" variant="outline-secondary">Login</Button>
                  </div>
                </Col>
                <Col md={5}>
                  <div className="feature-box">
                    <h5 className="fw-bold">Implemented security features (OWASP-based)</h5>
                    <ul className="mb-0 ps-3 text-muted">
                      <li>Strong input validation on both client and server</li>
                      <li>Secure password hashing using Argon2id</li>
                      <li>JWT-based authentication and protected routes</li>
                      <li>Access control to ensure users only access their own notes</li>
                      <li>Centralized error handling without sensitive data exposure</li>
                      <li>Protection against XSS through safe rendering</li>
                      <li>Prevention of injection attacks via parameterized queries</li>
                      <li>Token handling with controlled session storage</li>
                      <li>Consistent validation and sanitization across the application</li>
                    </ul>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default HomePage;
