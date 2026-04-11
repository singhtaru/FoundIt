import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import FormInput from '../components/FormInput';
import { authApi } from '../services/api';

function AuthPage() {
  const [mode, setMode] = useState('signin');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (mode === 'signup' && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const payload = mode === 'signup'
        ? { name: formData.name, email: formData.email, password: formData.password }
        : { email: formData.email, password: formData.password };

      const response = mode === 'signup'
        ? await authApi.signup(payload)
        : await authApi.signin(payload);

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/home');
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-shell">
        <div className="auth-intro">
          <span className="eyebrow">Campus lost and found</span>
          <h1>
            <span>FoundIt</span> VIT
          </h1>
          <p>One place for students to report, search, and recover lost belongings faster.</p>
        </div>

        <section className="auth-card">
          <div className="auth-avatar">
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M20 21C20 18.2386 16.4183 16 12 16C7.58172 16 4 18.2386 4 21M16 8C16 10.2091 14.2091 12 12 12C9.79086 12 8 10.2091 8 8C8 5.79086 9.79086 4 12 4C14.2091 4 16 5.79086 16 8Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2>{mode === 'signin' ? 'Sign In' : 'Create Account'}</h2>

          <div className="auth-toggle">
            <button
              className={mode === 'signin' ? 'active' : ''}
              onClick={() => setMode('signin')}
            >
              Login
            </button>
            <button
              className={mode === 'signup' ? 'active' : ''}
              onClick={() => setMode('signup')}
            >
              Sign Up
            </button>
          </div>

          {error && <p>{error}</p>}

          <form className="auth-form" onSubmit={handleSubmit}>
            {mode === 'signup' && (
              <FormInput
                label="Full Name"
                placeholder="Enter your full name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            )}
            <FormInput
              label="VIT Email Address"
              type="email"
              placeholder="name@vit.ac.in"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            <FormInput
              label="Password"
              type="password"
              placeholder="Enter your password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            {mode === 'signup' && (
              <FormInput
                label="Confirm Password"
                type="password"
                placeholder="Re-enter password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            )}
            <Button type="submit">{loading ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Create Account'}</Button>
          </form>

          <div className="auth-links">
            <button onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}>
              {mode === 'signin' ? 'Need an account?' : 'Already registered?'}
            </button>
            <Link to="/home">Continue to app</Link>
          </div>
        </section>
      </div>
    </main>
  );
}

export default AuthPage;
