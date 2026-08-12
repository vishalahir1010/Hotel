import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Mail, Lock, User as UserIcon, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

export const AuthModal = ({ isOpen, onClose, auth }) => {
  const {
    authStep,
    setAuthStep,
    error,
    setError,
    login,
    signup,
    sendPasswordReset
  } = auth;

  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');

  // Clear inputs and errors on close/open
  useEffect(() => {
    if (isOpen) {
      setError(null);
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setName('');
    }
  }, [isOpen, authStep, setError]);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);
    if (result && result.success) {
      onClose();
      if (result.role === 'admin') {
        navigate('/admin');
      }
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    const success = await signup(name, email, password);
    setSubmitting(false);
    if (success) {
      onClose();
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await sendPasswordReset(email);
    setSubmitting(false);
  };

  return (
    <div className="modal-overlay" style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div 
        className="glass-panel animate-fade-in" 
        style={{
          width: '90%',
          maxWidth: '460px',
          padding: '40px',
          borderRadius: 'var(--border-radius-lg)',
          boxShadow: 'var(--shadow-dark), var(--shadow-gold)',
          position: 'relative',
          textAlign: 'center'
        }}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '5px'
          }}
        >
          <X size={20} />
        </button>

        {/* Title & Brand Icon */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', marginBottom: '30px' }}>
          <Sparkles className="animate-float" style={{ color: 'var(--gold-primary)', width: '30px', height: '30px' }} />
          <h2 style={{ fontSize: '1.8rem', fontWeight: 300 }}>
            {authStep === 'login' && <>Welcome <span className="gold-text">Back</span></>}
            {authStep === 'signup' && <>Join <span className="gold-text">Aurelia</span></>}
            {authStep === 'forgot' && <>Reset <span className="gold-text">Password</span></>}
            {authStep === 'reset-sent' && <>Instructions <span className="gold-text">Sent</span></>}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            {authStep === 'login' && 'Unlock private suites & VIP reservation perks.'}
            {authStep === 'signup' && 'Create your sanctuary account for personalized luxury stays.'}
            {authStep === 'forgot' && 'Enter your email to request recovery details.'}
            {authStep === 'reset-sent' && 'We have dispatched recovery instructions.'}
          </p>
        </div>

        {/* Errors Display */}
        {error && (
          <div 
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              padding: '12px 16px',
              borderRadius: 'var(--border-radius-sm)',
              fontSize: '0.8rem',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              textAlign: 'left'
            }}
          >
            <ShieldAlert size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Render View Forms */}
        {authStep === 'login' && (
          <form onSubmit={handleLoginSubmit} className="checkout-form-grid" style={{ gridTemplateColumns: '1fr', gap: '20px', margin: 0 }}>
            <div className="form-group full-width">
              <label>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gold-primary)' }} />
                <input 
                  type="email" 
                  required 
                  placeholder="concierge@aurelia.com" 
                  style={{ paddingLeft: '44px', width: '100%' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            
            <div className="form-group full-width">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                <label>Password</label>
                <button 
                  type="button" 
                  onClick={() => setAuthStep('forgot')}
                  style={{ background: 'none', border: 'none', color: 'var(--gold-primary)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer', outline: 'none' }}
                >
                  Forgot Password?
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gold-primary)' }} />
                <input 
                  type="password" 
                  required 
                  placeholder="••••••••" 
                  style={{ paddingLeft: '44px', width: '100%' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="gold-button" 
              style={{ width: '100%', justifyContent: 'center', padding: '14px', marginTop: '10px' }}
              disabled={submitting}
            >
              {submitting ? 'Authenticating...' : 'Sign In to Account'}
            </button>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '15px' }}>
              Don't have an account yet?{' '}
              <button 
                type="button"
                onClick={() => setAuthStep('signup')}
                style={{ background: 'none', border: 'none', color: 'var(--gold-primary)', fontWeight: 600, cursor: 'pointer', padding: 0 }}
              >
                Create Account
              </button>
            </p>
          </form>
        )}

        {authStep === 'signup' && (
          <form onSubmit={handleSignupSubmit} className="checkout-form-grid" style={{ gridTemplateColumns: '1fr', gap: '20px', margin: 0 }}>
            <div className="form-group full-width">
              <label>Full Name</label>
              <div style={{ position: 'relative' }}>
                <UserIcon size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gold-primary)' }} />
                <input 
                  type="text" 
                  required 
                  placeholder="Lord Alexander Mercer" 
                  style={{ paddingLeft: '44px', width: '100%' }}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group full-width">
              <label>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gold-primary)' }} />
                <input 
                  type="email" 
                  required 
                  placeholder="alex@luxury.com" 
                  style={{ paddingLeft: '44px', width: '100%' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            
            <div className="form-group full-width">
              <label>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gold-primary)' }} />
                <input 
                  type="password" 
                  required 
                  placeholder="••••••••" 
                  style={{ paddingLeft: '44px', width: '100%' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group full-width">
              <label>Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gold-primary)' }} />
                <input 
                  type="password" 
                  required 
                  placeholder="••••••••" 
                  style={{ paddingLeft: '44px', width: '100%' }}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="gold-button" 
              style={{ width: '100%', justifyContent: 'center', padding: '14px', marginTop: '10px' }}
              disabled={submitting}
            >
              {submitting ? 'Registering...' : 'Create Account'}
            </button>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '15px' }}>
              Already registered?{' '}
              <button 
                type="button"
                onClick={() => setAuthStep('login')}
                style={{ background: 'none', border: 'none', color: 'var(--gold-primary)', fontWeight: 600, cursor: 'pointer', padding: 0 }}
              >
                Sign In
              </button>
            </p>
          </form>
        )}

        {authStep === 'forgot' && (
          <form onSubmit={handleForgotSubmit} className="checkout-form-grid" style={{ gridTemplateColumns: '1fr', gap: '20px', margin: 0 }}>
            <div className="form-group full-width">
              <label>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gold-primary)' }} />
                <input 
                  type="email" 
                  required 
                  placeholder="your@email.com" 
                  style={{ paddingLeft: '44px', width: '100%' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="gold-button" 
              style={{ width: '100%', justifyContent: 'center', padding: '14px', marginTop: '10px' }}
              disabled={submitting}
            >
              {submitting ? 'Sending...' : 'Send Reset Link'}
            </button>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '15px' }}>
              Back to{' '}
              <button 
                type="button"
                onClick={() => setAuthStep('login')}
                style={{ background: 'none', border: 'none', color: 'var(--gold-primary)', fontWeight: 600, cursor: 'pointer', padding: 0 }}
              >
                Sign In
              </button>
            </p>
          </form>
        )}

        {authStep === 'reset-sent' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', marginTop: '10px' }}>
            <CheckCircle2 size={48} style={{ color: 'var(--gold-primary)' }} />
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              An email containing password reset instructions has been sent to <strong>{email}</strong>.
            </p>
            <button 
              type="button" 
              className="gold-button"
              style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
              onClick={() => setAuthStep('login')}
            >
              Return to Login
            </button>
          </div>
        )}



      </div>
    </div>
  );
};
export default AuthModal;
