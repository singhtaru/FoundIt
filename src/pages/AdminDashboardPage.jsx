import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import StatusBadge from '../components/StatusBadge';
import { itemsApi } from '../services/api';

function AdminDashboardPage() {
  const fallbackImage = 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80';

  const getImageUrl = (image) => {
    if (!image) return fallbackImage;
    return image.startsWith('http') ? image : `http://localhost:5000/${image}`;
  };

  const [items, setItems] = useState([]);

  useEffect(() => {
    const loadItems = async () => {
      try {
        const response = await itemsApi.getItems();
        setItems(response.data);
      } catch (error) {
        console.error('Failed to load admin items:', error);
      }
    };

    loadItems();
  }, []);

  const adminStats = useMemo(() => ([
    { label: 'Total Reports', value: items.length, tone: 'blue' },
    { label: 'Pending', value: items.filter((item) => item.status === 'Pending').length, tone: 'gold' },
    { label: 'Approved', value: items.filter((item) => item.status === 'Approved').length, tone: 'teal' },
    { label: 'Claimed', value: items.filter((item) => item.status === 'Claimed').length, tone: 'orange' },
  ]), [items]);

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
                    <tr key={item._id}>
                      <td>
                        <img
                          src={getImageUrl(item.image)}
                          alt={item.name}
                          className="table-thumb"
                          onError={(event) => { event.currentTarget.src = fallbackImage; }}
                        />
                      </td>
                      <td>
                        <Link to={`/admin/review/${item._id}`} className="table-link">
                          {item.name}
                        </Link>
                        <span>Found at {item.location}</span>
                      </td>
                      <td>{new Date(item.createdAt).toLocaleDateString()}</td>
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
