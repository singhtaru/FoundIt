import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import FormInput from '../components/FormInput';

function AdminSettingsPage() {
  return (
    <main className="admin-page">
      <Navbar admin />

      <div className="admin-layout">
        <Sidebar />

        <section className="admin-content">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Admin panel</span>
              <h1>Settings</h1>
            </div>
          </div>

          <div className="report-card" style={{ marginLeft: 0 }}>
            <div className="section-heading small">
              <h2>Account Settings</h2>
            </div>
            
            <div className="form-field" style={{ marginBottom: '1rem' }}>
              <FormInput label="Display Name" placeholder="Admin" />
            </div>
            
            <div className="form-field" style={{ marginBottom: '1rem' }}>
              <FormInput label="Email Address" type="email" placeholder="admin@vit.ac.in" />
            </div>

            <div className="section-heading small" style={{ marginTop: '2rem' }}>
              <h2>Notification Preferences</h2>
            </div>

            <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <input type="checkbox" defaultChecked />
                Email me when a new item is reported
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <input type="checkbox" defaultChecked />
                Email me when an item is claimed
              </label>
            </div>

            <Button>Save Preferences</Button>
          </div>
        </section>
      </div>
    </main>
  );
}

export default AdminSettingsPage;
