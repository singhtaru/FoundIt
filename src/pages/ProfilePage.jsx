import { Navigate, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Navbar from '../components/Navbar';
import { clearSession, getStoredUser, hasAuthToken, isGuestUser } from '../services/session';

function ProfilePage() {
  const navigate = useNavigate();
  const user = getStoredUser();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const roleLabel = user.role === 'admin' ? 'Administrator' : user.role === 'guest' ? 'Guest' : 'Student Member';

  return (
    <main className={user.role === 'admin' ? 'admin-page' : 'page-shell'}>
      <Navbar admin={user.role === 'admin'} />

      <section className="form-page">
        <div className="section-heading centered">
          <div>
            <span className="eyebrow">Account</span>
            <h1>Profile Details</h1>
            <p>This page shows the currently signed-in user details.</p>
          </div>
        </div>

        <article className="review-card item-detail-card">
          <div className="review-meta">
            <div className="meta-box">
              <span>Full Name</span>
              <strong>{user.name || 'Unknown User'}</strong>
            </div>
            <div className="meta-box">
              <span>Email</span>
              <strong>{user.email || 'Not available for guest account'}</strong>
            </div>
            <div className="meta-box">
              <span>Role</span>
              <strong>{roleLabel}</strong>
            </div>
            <div className="meta-box">
              <span>Session Type</span>
              <strong>{hasAuthToken() ? 'Authenticated' : isGuestUser() ? 'Guest Session' : 'Unknown'}</strong>
            </div>
          </div>

          <div className="review-actions left-actions">
            <Button
              variant="danger"
              onClick={() => {
                clearSession();
                navigate('/auth');
              }}
            >
              Logout
            </Button>
          </div>
        </article>
      </section>
    </main>
  );
}

export default ProfilePage;
