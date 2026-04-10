import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import FormInput from '../components/FormInput';

function AuthPage() {
  const [mode, setMode] = useState('signin');

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

          <form className="auth-form">
            {mode === 'signup' && <FormInput label="Full Name" placeholder="Enter your full name" />}
            <FormInput label="VIT Email Address" type="email" placeholder="name@vit.ac.in" />
            <FormInput label="Password" type="password" placeholder="Enter your password" />
            {mode === 'signup' && (
              <FormInput label="Confirm Password" type="password" placeholder="Re-enter password" />
            )}
            <Button type="submit">{mode === 'signin' ? 'Sign In' : 'Create Account'}</Button>
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
