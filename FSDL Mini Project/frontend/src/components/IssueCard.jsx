import { useState } from 'react';

function IssueCard({ issue, userRole, onUpdate, token }) {
  const [updating, setUpdating] = useState(false);
  const [feedbackMode, setFeedbackMode] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');

  const statusMap = {
    'Pending': 'pending',
    'In Progress': 'in-progress',
    'Resolved': 'resolved'
  };

  const updateStatus = async (newStatus) => {
    setUpdating(true);
    try {
      const res = await fetch(`http://localhost:5000/api/issues/${issue._id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) onUpdate();
    } catch (err) {
      console.error(err);
    }
    setUpdating(false);
  };

  const submitFeedback = async () => {
    setUpdating(true);
    try {
      const res = await fetch(`http://localhost:5000/api/issues/${issue._id}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ feedback: feedbackText })
      });
      if (res.ok) {
        setFeedbackMode(false);
        onUpdate();
      }
    } catch (err) {
      console.error(err);
    }
    setUpdating(false);
  };

  return (
    <div className={`issue-card ${statusMap[issue.status]}`}>
      <span className={`status-badge ${statusMap[issue.status]}`}>{issue.status}</span>
      <h3>{issue.title}</h3>
      <span style={{ fontSize: '0.8rem', opacity: 0.6, display: 'block', marginBottom: '10px' }}>Category: {issue.category} &bull; Reporter: {issue.reporter?.name || 'Self'}</span>
      
      {issue.photoURL && <img src={`http://localhost:5000${issue.photoURL}`} alt="Issue Evidence" className="issue-photo" />}
      
      <p>{issue.description}</p>
      
      {issue.feedback && (
        <div style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', borderLeft: '3px solid var(--accent-color)', marginBottom: '15px' }}>
          <strong>User Feedback:</strong> {issue.feedback}
        </div>
      )}

      {userRole === 'admin' && issue.status !== 'Resolved' && (
        <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
          {issue.status === 'Pending' && (
            <button className="btn-primary" style={{ padding: '8px', fontSize: '0.9rem' }} disabled={updating} onClick={() => updateStatus('In Progress')}>Mark In Progress</button>
          )}
          {issue.status === 'In Progress' && (
            <button className="btn-primary" style={{ padding: '8px', fontSize: '0.9rem', background: 'var(--success-color)' }} disabled={updating} onClick={() => updateStatus('Resolved')}>Mark Resolved</button>
          )}
        </div>
      )}

      {userRole === 'user' && issue.status === 'Resolved' && !issue.feedback && (
        <div style={{ marginTop: '15px' }}>
          {!feedbackMode ? (
            <button className="btn-secondary" style={{ padding: '8px', fontSize: '0.9rem' }} onClick={() => setFeedbackMode(true)}>Provide Feedback</button>
          ) : (
            <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
              <textarea className="form-input" rows="2" placeholder="How was the resolution?" value={feedbackText} onChange={e => setFeedbackText(e.target.value)}></textarea>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="btn-primary" style={{ padding: '8px' }} onClick={submitFeedback} disabled={updating}>Submit</button>
                <button className="btn-secondary" style={{ padding: '8px' }} onClick={() => setFeedbackMode(false)}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default IssueCard;
