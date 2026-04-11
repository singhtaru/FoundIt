import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import StatusBadge from '../components/StatusBadge';
import { itemsApi } from '../services/api';
import { formatItemDate, getItemImageUrl, fallbackItemImage } from '../services/itemUtils';

const pageConfig = {
  pending: {
    title: 'Pending Approvals',
    eyebrow: 'Review queue',
    description: 'Items waiting for admin verification before public claim approval.',
    status: 'Pending',
  },
  approved: {
    title: 'Approved Items',
    eyebrow: 'Verified items',
    description: 'Items verified by admin and ready for claim workflows.',
    status: 'Approved',
  },
  claimed: {
    title: 'Claimed Items',
    eyebrow: 'Completed handoffs',
    description: 'Items successfully handed over to verified owners.',
    status: 'Claimed',
  },
};

function AdminItemsStatusPage({ type }) {
  const config = pageConfig[type] || pageConfig.pending;
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadItems = async () => {
      setLoading(true);
      try {
        const response = await itemsApi.getItems({ status: config.status });
        setItems(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Failed to load filtered admin items:', error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, [config.status]);

  const totalClaims = useMemo(
    () => items.reduce((count, item) => count + (item.claimRequests?.length || 0), 0),
    [items]
  );

  return (
    <main className="admin-page">
      <Navbar admin />

      <div className="admin-layout">
        <Sidebar />

        <section className="admin-content">
          <div className="section-heading">
            <div>
              <span className="eyebrow">{config.eyebrow}</span>
              <h1>{config.title}</h1>
              <p>{config.description}</p>
            </div>
          </div>

          <div className="stats-grid">
            <article className="stat-card gold">
              <div className="stat-icon" />
              <div>
                <span>{config.status} Items</span>
                <strong>{items.length}</strong>
              </div>
            </article>
            <article className="stat-card teal">
              <div className="stat-icon" />
              <div>
                <span>Claim Requests</span>
                <strong>{totalClaims}</strong>
              </div>
            </article>
          </div>

          <div className="table-card">
            <div className="section-heading small">
              <h2>{config.title} List</h2>
            </div>

            {loading ? (
              <p>Loading items...</p>
            ) : items.length === 0 ? (
              <p className="feedback-banner">No items found in this section.</p>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Item Name</th>
                      <th>Date Found</th>
                      <th>Location</th>
                      <th>Claims</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item._id}>
                        <td>
                          <img
                            src={getItemImageUrl(item.image)}
                            alt={item.name}
                            className="table-thumb"
                            onError={(event) => {
                              event.currentTarget.src = fallbackItemImage;
                            }}
                          />
                        </td>
                        <td>
                          <Link to={`/admin/review/${item._id}`} className="table-link">
                            {item.name}
                          </Link>
                          <span>Found at {item.location}</span>
                        </td>
                        <td>{formatItemDate(item)}</td>
                        <td>{item.location}</td>
                        <td>{item.claimRequests?.length || 0}</td>
                        <td>
                          <StatusBadge status={item.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default AdminItemsStatusPage;
