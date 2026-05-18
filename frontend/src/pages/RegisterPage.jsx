import { useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { registerUser } from '../api/authApi';
import { getErrorMessage } from '../utils/errorHelpers';
import {
  normalizeAuthPayload,
  validateEmail,
  validatePasswordForRegister,
} from '../utils/validation';

function RegisterPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ variant: 'danger', message: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = {
      email: validateEmail(formData.email),
      password: validatePasswordForRegister(formData.password),
    };

    const filteredErrors = Object.fromEntries(
      Object.entries(nextErrors).filter(([, value]) => value)
    );

    setErrors(filteredErrors);

    if (Object.keys(filteredErrors).length > 0) {
      setAlert({ variant: 'danger', message: 'Please correct the form errors.' });
      return;
    }

    try {
      setLoading(true);
      setAlert({ variant: 'danger', message: '' });
      const response = await registerUser(normalizeAuthPayload(formData.email, formData.password));
      setAlert({ variant: 'success', message: response.message || 'Registration successful. You can log in now.' });
      setTimeout(() => navigate('/login'), 900);
    } catch (error) {
      setAlert({ variant: 'danger', message: getErrorMessage(error, 'Registration failed') });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={5}>
          <AuthForm
            title="Register"
            buttonText="Register"
            formData={formData}
            errors={errors}
            alert={alert}
            loading={loading}
            onChange={handleChange}
            onSubmit={handleSubmit}
            showPasswordRuleHint
          />
          <p className="text-center text-muted mt-3 mb-0">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </Col>
      </Row>
    </Container>
  );
}

export default RegisterPage;
