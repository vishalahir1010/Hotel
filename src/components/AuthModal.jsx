import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Mail, Lock, User as UserIcon, ShieldAlert, CheckCircle2, Eye, EyeOff } from 'lucide-react';


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
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // Lock body & html scroll completely when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100vh';
      document.documentElement.style.overflow = 'hidden';
      document.documentElement.style.height = '100vh';
    } else {
      document.body.style.overflow = '';
      document.body.style.height = '';
      document.documentElement.style.overflow = '';
      document.documentElement.style.height = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.height = '';
      document.documentElement.style.overflow = '';
      document.documentElement.style.height = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setName('');
      setShowPass(false);
      setShowConfirmPass(false);
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
      if (result.role === 'admin') navigate('/admin');
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
    if (success) onClose();
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await sendPasswordReset(email);
    setSubmitting(false);
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 14px 12px 42px',
    border: '1px solid var(--gold-border)',
    borderRadius: 'var(--border-radius-sm)',
    background: '#FDFBF7',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-sans)',
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.72rem',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: 'var(--text-muted)',
    fontWeight: '600',
    marginBottom: '6px',
    textAlign: 'left',
  };

  const IconWrap = ({ children }) => (
    <span style={{
      position: 'absolute', left: '13px', top: '50%',
      transform: 'translateY(-50%)', color: 'var(--gold-primary)',
      display: 'flex', pointerEvents: 'none'
    }}>
      {children}
    </span>
  );

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#FDFBF7',
        zIndex: 999999,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflowY: 'auto',
        padding: '20px',
        boxSizing: 'border-box'
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="animate-fade-in"
        style={{
          width: '90%',
          maxWidth: '460px',
          display: 'flex',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 30px 80px rgba(0,0,0,0.15)',
          background: '#FFFFFF',
          position: 'relative',
          maxHeight: '90vh',
        }}
      >


        {/* ── RIGHT: Form Panel ── */}
        <div style={{
          flex: 1,
          padding: '40px 36px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {/* Close Button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: '18px', right: '18px',
              background: 'rgba(0,0,0,0.06)', border: 'none',
              borderRadius: '50%', width: '32px', height: '32px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'var(--text-muted)', transition: 'background 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.12)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.06)'}
          >
            <X size={16} />
          </button>

          {/* Title */}
          <div style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 300, color: 'var(--text-primary)', marginBottom: '6px' }}>
              {authStep === 'login' && <><span style={{ color: 'var(--text-primary)' }}>Welcome </span><span className="gold-text">Back</span></>}
              {authStep === 'signup' && <><span>Join </span><span className="gold-text">Aurelia</span></>}
              {authStep === 'forgot' && <><span>Reset </span><span className="gold-text">Password</span></>}
              {authStep === 'reset-sent' && <><span>Check Your </span><span className="gold-text">Email</span></>}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              {authStep === 'login' && 'Unlock private suites & VIP reservation perks.'}
              {authStep === 'signup' && 'Create your sanctuary account for personalized luxury stays.'}
              {authStep === 'forgot' && 'Enter your email to receive reset instructions.'}
              {authStep === 'reset-sent' && 'We have sent recovery instructions to your email.'}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.25)',
              color: '#b91c1c',
              padding: '10px 14px',
              borderRadius: 'var(--border-radius-sm)',
              fontSize: '0.82rem',
              marginBottom: '18px',
              display: 'flex', alignItems: 'center', gap: '8px',
              textAlign: 'left',
            }}>
              <ShieldAlert size={15} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {/* ── LOGIN FORM ── */}
          {authStep === 'login' && (
            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <IconWrap><Mail size={15} /></IconWrap>
                  <input type="email" required placeholder="you@example.com" style={inputStyle}
                    value={email} onChange={e => setEmail(e.target.value)} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ ...labelStyle, marginBottom: 0 }}>Password</label>
                  <button type="button" onClick={() => setAuthStep('forgot')}
                    style={{ background: 'none', border: 'none', color: 'var(--gold-primary)', fontSize: '0.72rem', cursor: 'pointer', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Forgot?
                  </button>
                </div>
                <div style={{ position: 'relative' }}>
                  <IconWrap><Lock size={15} /></IconWrap>
                  <input type={showPass ? 'text' : 'password'} required placeholder="••••••••" style={{ ...inputStyle, paddingRight: '40px' }}
                    value={password} onChange={e => setPassword(e.target.value)} />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="gold-button"
                style={{ width: '100%', justifyContent: 'center', padding: '13px', marginTop: '4px', fontSize: '0.85rem' }}
                disabled={submitting}>
                {submitting ? 'Signing in...' : 'Sign In to Account'}
              </button>

              <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                Don't have an account?{' '}
                <button type="button" onClick={() => setAuthStep('signup')}
                  style={{ background: 'none', border: 'none', color: 'var(--gold-primary)', fontWeight: 600, cursor: 'pointer', padding: 0, fontSize: '0.82rem' }}>
                  Create Account
                </button>
              </p>
            </form>
          )}

          {/* ── SIGNUP FORM ── */}
          {authStep === 'signup' && (
            <form onSubmit={handleSignupSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <IconWrap><UserIcon size={15} /></IconWrap>
                  <input type="text" required placeholder="Your Full Name" style={inputStyle}
                    value={name} onChange={e => setName(e.target.value)} />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <IconWrap><Mail size={15} /></IconWrap>
                  <input type="email" required placeholder="you@example.com" style={inputStyle}
                    value={email} onChange={e => setEmail(e.target.value)} />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Password</label>
                <div style={{ position: 'relative' }}>
                  <IconWrap><Lock size={15} /></IconWrap>
                  <input type={showPass ? 'text' : 'password'} required placeholder="Min. 6 characters" style={{ ...inputStyle, paddingRight: '40px' }}
                    value={password} onChange={e => setPassword(e.target.value)} />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div>
                <label style={labelStyle}>Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <IconWrap><Lock size={15} /></IconWrap>
                  <input type={showConfirmPass ? 'text' : 'password'} required placeholder="Re-enter password" style={{ ...inputStyle, paddingRight: '40px' }}
                    value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                  <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                    {showConfirmPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="gold-button"
                style={{ width: '100%', justifyContent: 'center', padding: '13px', marginTop: '4px', fontSize: '0.85rem' }}
                disabled={submitting}>
                {submitting ? 'Creating Account...' : 'Create My Account'}
              </button>

              <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                Already registered?{' '}
                <button type="button" onClick={() => setAuthStep('login')}
                  style={{ background: 'none', border: 'none', color: 'var(--gold-primary)', fontWeight: 600, cursor: 'pointer', padding: 0, fontSize: '0.82rem' }}>
                  Sign In
                </button>
              </p>
            </form>
          )}

          {/* ── FORGOT PASSWORD ── */}
          {authStep === 'forgot' && (
            <form onSubmit={handleForgotSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <IconWrap><Mail size={15} /></IconWrap>
                  <input type="email" required placeholder="your@email.com" style={inputStyle}
                    value={email} onChange={e => setEmail(e.target.value)} />
                </div>
              </div>

              <button type="submit" className="gold-button"
                style={{ width: '100%', justifyContent: 'center', padding: '13px', marginTop: '4px', fontSize: '0.85rem' }}
                disabled={submitting}>
                {submitting ? 'Sending...' : 'Send Reset Link'}
              </button>

              <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                <button type="button" onClick={() => setAuthStep('login')}
                  style={{ background: 'none', border: 'none', color: 'var(--gold-primary)', fontWeight: 600, cursor: 'pointer', padding: 0, fontSize: '0.82rem' }}>
                  ← Back to Sign In
                </button>
              </p>
            </form>
          )}

          {/* ── RESET SENT ── */}
          {authStep === 'reset-sent' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', textAlign: 'center' }}>
              <CheckCircle2 size={52} style={{ color: 'var(--gold-primary)' }} />
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                Instructions sent to <strong>{email}</strong>.<br />Check your inbox.
              </p>
              <button type="button" className="gold-button"
                style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
                onClick={() => setAuthStep('login')}>
                Return to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
