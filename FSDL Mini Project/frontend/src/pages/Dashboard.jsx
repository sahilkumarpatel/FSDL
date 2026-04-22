import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import IssueCard from '../components/IssueCard';
import ReportIssueModal from '../components/ReportIssueModal';
import { LogOut, PlusCircle } from 'lucide-react';

function Dashboard() {
  const { user, logoutContext } = useAuth();
  const [issues, setIssues] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchIssues();
  }, [user]);

  const fetchIssues = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/issues', {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setIssues(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleIssueUpdated = () => {
    fetchIssues();
  };

  return (
    <>
      <div className="dashboard-header">
        <h2>{user.role === 'admin' ? 'Campus Overview' : 'My Reported Issues'}</h2>
        <div className="auth-controls">
          {user.role !== 'admin' && (
            <button className="btn-primary" style={{ padding: '8px 16px', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => setIsModalOpen(true)}>
              <PlusCircle size={20} /> Report Issue
            </button>
          )}
          <button className="btn-secondary" style={{ padding: '8px 16px', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }} onClick={logoutContext}>
            <LogOut size={20} /> Logout
          </button>
        </div>
      </div>

      {issues.length === 0 ? (
        <p style={{ opacity: 0.6, fontSize: '1.2rem', marginTop: '40px' }}>No issues found. {user.role !== 'admin' && 'You can report an issue using the button above.'}</p>
      ) : (
        <div className="dashboard-grid">
          {issues.map(issue => (
            <IssueCard key={issue._id} issue={issue} userRole={user.role} onUpdate={handleIssueUpdated} token={user.token} />
          ))}
        </div>
      )}

      {isModalOpen && <ReportIssueModal onClose={() => setIsModalOpen(false)} onReported={() => { setIsModalOpen(false); fetchIssues(); }} token={user.token} />}
    </>
  );
}

export default Dashboard;
