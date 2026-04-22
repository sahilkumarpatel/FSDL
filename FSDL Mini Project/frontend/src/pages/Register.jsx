import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (res.ok) {
        setSuccess('Account created successfully! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
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
      <h2 style={{ marginBottom: '20px', fontSize: '1.8rem', textAlign: 'center' }}>Join CampusFix</h2>
      <p style={{ opacity: 0.7, marginBottom: '20px', textAlign: 'center' }}>Register to start tracking campus issues.</p>
      
      {error && <div style={{ color: 'var(--warning-color)', marginBottom: '15px', textAlign: 'center' }}>{error}</div>}
      {success && <div style={{ color: 'var(--success-color)', marginBottom: '15px', textAlign: 'center' }}>{success}</div>}
      
      <form onSubmit={handleRegister}>
        <div className="form-group">
          <label>Full Name</label>
          <input type="text" placeholder="John Doe" className="form-input" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
        </div>
        <div className="form-group">
          <label>Email Address</label>
          <input type="email" placeholder="student@college.edu" className="form-input" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" placeholder="••••••••" className="form-input" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required />
        </div>
        <div className="form-group">
          <label>Account Role</label>
          <select className="form-input" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
            <option value="user">Student/Staff (User)</option>
            <option value="admin">Authority (Admin)</option>
          </select>
        </div>
        <button type="submit" className="btn-primary">Register Account</button>
      </form>
      <div className="toggle-link" onClick={() => navigate('/login')}>
        Already have an account? <b>Login</b>
      </div>
    </div>
  );
}

export default Register;
