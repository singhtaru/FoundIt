import { Link, useLocation } from 'react-router-dom';
import { useMemo } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import StatusBadge from '../components/StatusBadge';
import { adminStats, items } from '../assets/mockData';

function AdminDashboardPage() {
  const location = useLocation();

  const title = useMemo(() => {
    if (location.pathname.includes('/pending')) return 'Pending Approvals';
    if (location.pathname.includes('/approved')) return 'Approved Items';
    if (location.pathname.includes('/claimed')) return 'Claimed Items';
    return 'Admin Dashboard';
  }, [location.pathname]);

  const filteredItems = useMemo(() => {
    if (location.pathname.includes('/pending')) {
      return items.filter(item => item.status === 'Pending');
    }
    if (location.pathname.includes('/approved')) {
      return items.filter(item => item.status === 'Approved');
    }
    if (location.pathname.includes('/claimed')) {
      return items.filter(item => item.status === 'Claimed');
    }
    return items; // Dashboard shows all
  }, [location.pathname]);

  return (
    <main className="admin-page">
      <Navbar admin />

      <div className="admin-layout">
        <Sidebar />

        <section className="admin-content">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Admin panel</span>
              <h1>{title}</h1>
            </div>
          </div>

          {title === 'Admin Dashboard' && (
            <div className="stats-grid">
              {adminStats.map((stat) => (
                <article key={stat.label} className={`stat-card ${stat.tone}`}>
                  <div className="stat-icon" />
                  <div>
                    <span>{stat.label}</span>
                    <strong>{stat.value}</strong>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="table-card">
            <div className="section-heading small">
              <h2>{title === 'Admin Dashboard' ? 'Recent Item Reports' : title}</h2>
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Item Name</th>
                    <th>Date Reported</th>
                    <th>Location Found</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <img src={item.image} alt={item.name} className="table-thumb" />
                      </td>
                      <td>
                        <Link to={`/admin/review/${item.id}`} className="table-link">
                          {item.name}
                        </Link>
                        <span>Found at {item.location}</span>
                      </td>
                      <td>{item.date}</td>
                      <td>{item.location}</td>
                      <td>
                        <StatusBadge status={item.status} />
                      </td>
                    </tr>
                  ))}
                  {filteredItems.length === 0 && (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>
                        No items found in this section.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default AdminDashboardPage;
