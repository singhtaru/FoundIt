import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import StatusBadge from '../components/StatusBadge';
import Button from '../components/Button';
import { itemsApi } from '../services/api';

function ReviewItemPage() {
  const fallbackImage = 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80';

  const { id } = useParams();
  const [item, setItem] = useState(null);

  const getImageUrl = (image) => {
    if (!image) return fallbackImage;
    return image.startsWith('http') ? image : `http://localhost:5000/${image}`;
  };

  useEffect(() => {
    const loadItem = async () => {
      try {
        const response = await itemsApi.getItem(id);
        setItem(response.data);
      } catch (error) {
        console.error('Failed to load review item:', error);
      }
    };

    loadItem();
  }, [id]);

  const updateStatus = async (status) => {
    try {
      const response = await itemsApi.updateItem(id, { status });
      setItem(response.data);
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  if (!item) {
    return (
      <main className="admin-page">
        <Navbar admin />
        <div className="admin-layout">
          <Sidebar />
          <section className="admin-content">
            <p>Loading item...</p>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <Navbar admin />

      <div className="admin-layout">
        <Sidebar />

        <section className="admin-content">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Verification queue</span>
              <h1>Review and Verify Item</h1>
            </div>
          </div>

          <article className="review-card">
            <div className="review-hero">
              <div className="review-image">
                <img
                  src={getImageUrl(item.image)}
                  alt={item.name}
                  onError={(event) => { event.currentTarget.src = fallbackImage; }}
                />
              </div>
              <div className="review-copy">
                <div className="review-title">
                  <h2>{item.name}</h2>
                  <StatusBadge status={item.status} />
                </div>
                <div className="detail-block">
                  <span>Item Description</span>
                  <p>{item.description}</p>
                </div>
                <div className="detail-block">
                  <span>Location Found</span>
                  <p>{item.location}</p>
                </div>
              </div>
            </div>

            <div className="review-meta">
              <div className="meta-box">
                <span>Date Reported</span>
                <strong>{new Date(item.createdAt).toLocaleDateString()}</strong>
              </div>
              <div className="meta-box">
                <span>Reported By</span>
                <strong>{item.reporter?.name || 'Unknown'}</strong>
                <p>{item.reporterEmail}</p>
              </div>
              <div className="meta-box">
                <span>Category</span>
                <strong>{item.category}</strong>
              </div>
              <div className="meta-box">
                <span>Current Status</span>
                <strong>{item.status}</strong>
              </div>
            </div>

            <div className="review-actions">
              <Button onClick={() => updateStatus('Approved')}>Approve Item</Button>
              <Button variant="danger" onClick={() => updateStatus('Rejected')}>Reject Item</Button>
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}

export default ReviewItemPage;
