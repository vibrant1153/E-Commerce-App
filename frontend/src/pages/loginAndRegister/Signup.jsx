// SignUp.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './signup.css';
 
// ── Helpers ────────────────────────────────────────
function getStrength(pw) {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8)          score++;
  if (/[A-Z]/.test(pw))        score++;
  if (/[0-9]/.test(pw))        score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}
const strengthLabels  = ['', 'Weak', 'Fair', 'Strong', 'Great'];
const strengthClasses = ['', 'active-weak', 'active-fair', 'active-strong', 'active-great'];
const strengthColors  = ['', '#d85a30', '#ef9f27', '#3b6d11', '#1d9e75'];
 
// ── Icons ──────────────────────────────────────────
const IconMail = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);
 
const IconLock = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
 
const IconUser = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="5"/>
    <path d="M3 21c0-4.418 4.03-8 9-8s9 3.582 9 8"/>
  </svg>
);
 
const IconGoogle = () => (
  <svg width="15" height="15" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);
 
// ── Component ──────────────────────────────────────
export default function SignUp() {
  const navigate = useNavigate();
 
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName]   = useState('');
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [agreed, setAgreed]       = useState(false);
  const [showPass, setShowPass]   = useState(false);
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);
 
  const strength = getStrength(password);
 
  // ── Submit handler ──────────────────────────────
  async function handleSignUp() {
    setError('');
 
    // Basic client-side validation
    if (!firstName || !lastName || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (strength < 2) {
      setError('Please choose a stronger password.');
      return;
    }
    if (!agreed) {
      setError('You must agree to the Terms of Service to continue.');
      return;
    }
 
    setLoading(true);
 
    try {
      const res = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`,
          email,
          password
        })      
      });
 
      const data = await res.json();
 
      if (!res.ok) {
        setError(data.message || 'Sign up failed. Please try again.');
        return;
      }
 
      // Auto-login after signup: store token and redirect
      localStorage.setItem('token', data.token);
      navigate('/');
 
    } catch (err) {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }
 
  // ── Render ──────────────────────────────────────
  return (
    <div className="auth-root">
 
      {/* ── Left decorative panel ── */}
      <div className="auth-panel-left">
        <div className="panel-bg-orb orb1" />
        <div className="panel-bg-orb orb2" />
 
        <div className="panel-brand">
          <div className="brand-mark">M</div>
          <div className="brand-name">Maison</div>
        </div>
 
        <div className="panel-center">
          <p className="panel-tagline">
            Join a world of<br />
            <em>refined taste.</em>
          </p>
          <p className="panel-sub">
            Become a member and unlock access to exclusive collections,
            early releases, and curated recommendations.
          </p>
        </div>
 
        <div className="panel-testimonial">
          <p className="testimonial-text">
            "Signing up was the best decision. The exclusives alone are worth it."
          </p>
          <p className="testimonial-author">— James R., Member since 2023</p>
        </div>
      </div>
 
      {/* ── Right form panel ── */}
      <div className="auth-panel-right">
        <div className="auth-form-container slide-enter">
 
          {/* Header */}
          <div className="form-header">
            <h1 className="form-title">Join Maison</h1>
            <p className="form-subtitle">
              Already a member?{' '}
              <a onClick={() => navigate('/login')}>Sign in</a>
            </p>
          </div>
 
          {/* Error message */}
          {error && (
            <p style={{ color: '#d85a30', fontSize: 13, marginBottom: '1rem' }}>
              {error}
            </p>
          )}
 
          {/* Name row */}
          <div className="field-row">
            <div className="field-group">
              <label className="field-label">First name</label>
              <div className="field-input-wrap">
                <span className="field-icon"><IconUser /></span>
                <input
                  className="field-input"
                  type="text"
                  placeholder="Jane"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                />
              </div>
            </div>
            <div className="field-group">
              <label className="field-label">Last name</label>
              <div className="field-input-wrap">
                <span className="field-icon"><IconUser /></span>
                <input
                  className="field-input"
                  type="text"
                  placeholder="Doe"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                />
              </div>
            </div>
          </div>
 
          {/* Email */}
          <div className="field-group">
            <label className="field-label">Email address</label>
            <div className="field-input-wrap">
              <span className="field-icon"><IconMail /></span>
              <input
                className="field-input"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
          </div>
 
          {/* Password + strength */}
          <div className="field-group">
            <label className="field-label">
              Password
              {password && (
                <span style={{
                  marginLeft: 8,
                  color: strengthColors[strength],
                  fontSize: 10,
                  letterSpacing: 1.5,
                }}>
                  — {strengthLabels[strength]}
                </span>
              )}
            </label>
            <div className="field-input-wrap">
              <span className="field-icon"><IconLock /></span>
              <input
                className="field-input"
                type={showPass ? 'text' : 'password'}
                placeholder="Min. 8 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ paddingRight: '56px' }}
              />
              <button className="show-pass-btn" onClick={() => setShowPass(p => !p)}>
                {showPass ? 'hide' : 'show'}
              </button>
            </div>
            {password && (
              <div className="strength-bar">
                {[1, 2, 3, 4].map(i => (
                  <div
                    key={i}
                    className={`strength-segment${strength >= i ? ` ${strengthClasses[strength]}` : ''}`}
                  />
                ))}
              </div>
            )}
          </div>
 
          {/* Terms */}
          <label className="terms-label">
            <input
              type="checkbox"
              checked={agreed}
              onChange={e => setAgreed(e.target.checked)}
            />
            I agree to the{' '}
            <a onClick={() => navigate('/terms')}>&nbsp;Terms of Service</a>
            &nbsp;and&nbsp;
            <a onClick={() => navigate('/privacy')}>Privacy Policy</a>
          </label>
 
          {/* CTA */}
          <button className="cta-btn" onClick={handleSignUp} disabled={loading}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
 
          {/* Divider */}
          <div className="divider">or sign up with</div>
 
          {/* Social */}
          <div className="social-btns">
            <button className="social-btn">
              <IconGoogle /> Google
            </button>
            <button className="social-btn">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83"/>
                <path d="M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              Apple
            </button>
          </div>
 
          {/* Trust badges */}
          <div className="trust-row">
            <div className="trust-item">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              SSL Secured
            </div>
            <div className="trust-item">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                <line x1="1" y1="10" x2="23" y2="10"/>
              </svg>
              Safe Checkout
            </div>
            <div className="trust-item">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
                <circle cx="12" cy="12" r="2"/>
              </svg>
              GDPR Compliant
            </div>
          </div>
 
        </div>
      </div>
    </div>
  );
}
 