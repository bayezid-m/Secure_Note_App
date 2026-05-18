import { useState } from 'react';
import { Button, Card, Form, InputGroup } from 'react-bootstrap';
import AlertMessage from './AlertMessage';

function AuthForm({
  title,
  buttonText,
  formData,
  errors,
  alert,
  loading,
  onChange,
  onSubmit,
  showPasswordRuleHint = false,
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Card className="shadow-sm border-0 auth-card">
      <Card.Body className="p-4 p-md-5">
        <h2 className="fw-bold mb-3">{title}</h2>
        <p className="text-muted">Use your email and password to continue.</p>
        <AlertMessage variant={alert.variant} message={alert.message} />

        <Form noValidate onSubmit={onSubmit}>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={onChange}
              isInvalid={Boolean(errors.email)}
              maxLength={120}
              autoComplete="email"
              required
            />
            <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <InputGroup>
              <Form.Control
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={onChange}
                isInvalid={Boolean(errors.password)}
                autoComplete={title === 'Login' ? 'current-password' : 'new-password'}
                required
              />
              <Button
                type="button"
                variant="outline-secondary"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </Button>
              <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
            </InputGroup>
            {showPasswordRuleHint && (
              <Form.Text className="text-muted">
                12-128 characters with uppercase, lowercase, number, and special character.
              </Form.Text>
            )}
          </Form.Group>

          <Button type="submit" className="w-100" disabled={loading}>
            {loading ? 'Please wait...' : buttonText}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default AuthForm;
