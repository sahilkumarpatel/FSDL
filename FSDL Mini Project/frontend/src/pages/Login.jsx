import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { loginContext } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Hardcoded local backend integration example if real backend running
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (res.ok) {
        loginContext(data);
        navigate('/dashboard');
      } else {
        setError(data.error);
      }
    } catch (err) {
      console.error(err);
      setError('Cannot connect to server. Ensure backend is running.');
    }
  };

  return (
    <div className="glass-panel">
      <h2 style={{ marginBottom: '20px', fontSize: '1.8rem', textAlign: 'center' }}>Welcome Back</h2>
      <p style={{ opacity: 0.7, marginBottom: '20px', textAlign: 'center' }}>Login to access your CampusFix dashboard.</p>
      
      {error && <div style={{ color: 'var(--warning-color)', marginBottom: '15px', textAlign: 'center' }}>{error}</div>}
      
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Email Address</label>
          <input type="email" placeholder="student@college.edu" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" placeholder="••••••••" className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="btn-primary">Login Now</button>
      </form>
      <div className="toggle-link" onClick={() => navigate('/register')}>
        Don't have an account? <b>Register</b>
      </div>
    </div>
  );
}

export default Login;
