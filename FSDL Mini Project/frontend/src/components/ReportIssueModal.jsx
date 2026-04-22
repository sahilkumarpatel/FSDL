import { useState } from 'react';

function ReportIssueModal({ onClose, onReported, token }) {
  const [formData, setFormData] = useState({ title: '', description: '', category: 'Infrastructure', photo: null });
  const [submitting, setSubmitting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('category', formData.category);
    if (formData.photo) data.append('photo', formData.photo);

    try {
      const res = await fetch('http://localhost:5000/api/issues', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: data
      });
      if (res.ok) onReported();
    } catch (err) {
      console.error(err);
    }
    setSubmitting(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, photo: file });
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="glass-panel" style={{ width: '90%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
        <h2 style={{ marginBottom: '20px' }}>Report Campus Issue</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Issue Title</label>
            <input type="text" className="form-input" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
          </div>
          
          <div className="form-group">
            <label>Category</label>
            <select className="form-input" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Parking">Parking</option>
              <option value="Sanitation">Sanitation</option>
              <option value="Electrical">Electrical</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <textarea className="form-input" rows="4" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required></textarea>
          </div>
          
          <div className="form-group">
            <label>Upload Photo Evidence</label>
            <input type="file" className="form-input" accept="image/*" onChange={handleFileChange} />
            {photoPreview && <img src={photoPreview} alt="Preview" style={{ width: '100%', marginTop: '10px', borderRadius: '8px', border: '1px solid var(--glass-border)' }} />}
          </div>
          
          <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
            <button type="button" className="btn-secondary" onClick={onClose} disabled={submitting}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit Report'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReportIssueModal;
