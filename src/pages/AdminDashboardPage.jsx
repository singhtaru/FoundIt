import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import StatusBadge from '../components/StatusBadge';
import { adminStats, items } from '../assets/mockData';

function AdminDashboardPage() {
  return (
    <main className="admin-page">
      <Navbar admin />

      <div className="admin-layout">
        <Sidebar />

        <section className="admin-content">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Admin panel</span>
              <h1>Admin Dashboard</h1>
            </div>
          </div>

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

          <div className="table-card">
            <div className="section-heading small">
              <h2>Recent Item Reports</h2>
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
                  {items.map((item) => (
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
