import { useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { loginUser } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../utils/errorHelpers';
import { normalizeAuthPayload, validateEmail, validatePasswordForLogin } from '../utils/validation';

function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ variant: 'danger', message: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = {
      email: validateEmail(formData.email),
      password: validatePasswordForLogin(formData.password),
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
      const response = await loginUser(normalizeAuthPayload(formData.email, formData.password));
      login(response.token);
      navigate(location.state?.from || '/dashboard', { replace: true });
    } catch (error) {
      setAlert({ variant: 'danger', message: getErrorMessage(error, 'Login failed') });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={5}>
          <AuthForm
            title="Login"
            buttonText="Login"
            formData={formData}
            errors={errors}
            alert={alert}
            loading={loading}
            onChange={handleChange}
            onSubmit={handleSubmit}
          />
          <p className="text-center text-muted mt-3 mb-0">
            No account yet? <Link to="/register">Create one</Link>
          </p>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginPage;
