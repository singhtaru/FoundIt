import { useMemo } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { getStoredUser } from '../services/session';

function AdminSettingsPage() {
  const user = useMemo(() => getStoredUser(), []);

  return (
    <main className="admin-page">
      <Navbar admin />

      <div className="admin-layout">
        <Sidebar />

        <section className="admin-content">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Configuration</span>
              <h1>Admin Settings</h1>
              <p>Admin account and operational controls for the moderation workspace.</p>
            </div>
          </div>

          <article className="table-card review-card">
            <div className="detail-block">
              <span>Signed-in Admin</span>
              <p>{user?.name || 'Admin'} ({user?.email || 'No email'})</p>
            </div>

            <div className="detail-block">
              <span>Access Role</span>
              <p>{user?.role || 'admin'}</p>
            </div>

            <div className="detail-block">
              <span>Moderation Scope</span>
              <p>Review incoming reports, verify claim requests, approve or reject listings, and mark completed handoffs.</p>
            </div>

            <p className="feedback-banner">Security note: change the default admin credentials through environment variables in backend deployment.</p>
          </article>
        </section>
      </div>
    </main>
  );
}

export default AdminSettingsPage;
