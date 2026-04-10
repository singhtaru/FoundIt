import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import StatusBadge from '../components/StatusBadge';
import Button from '../components/Button';
import { items } from '../assets/mockData';

function ReviewItemPage() {
  const { id } = useParams();

  const item = useMemo(
    () => items.find((entry) => entry.id === Number(id)) || items[0],
    [id]
  );

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
                <img src={item.image} alt={item.name} />
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
                <strong>{item.date}</strong>
              </div>
              <div className="meta-box">
                <span>Reported By</span>
                <strong>{item.reporter}</strong>
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
              <Button>Approve Item</Button>
              <Button variant="danger">Reject Item</Button>
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}

export default ReviewItemPage;
