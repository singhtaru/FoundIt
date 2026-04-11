import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';
import Button from '../components/Button';
import { items } from '../assets/mockData';

function ItemDetailsPage() {
  const { id } = useParams();

  const item = useMemo(
    () => items.find((entry) => entry.id === Number(id)),
    [id]
  );

  if (!item) {
    return (
      <main className="page-shell">
        <Navbar />
        <section className="form-page" style={{ textAlign: 'center' }}>
          <h2>Item not found</h2>
          <Link to="/home">
            <Button>Return Home</Button>
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <Navbar />

      <section className="form-page" style={{ width: 'min(800px, 92vw)', margin: '0 auto' }}>
        <div className="section-heading">
          <h2>Item Details</h2>
          <Link to={-1}>
            <Button variant="ghost">Go Back</Button>
          </Link>
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

          {item.status === 'Found' && (
            <div className="review-actions">
              <Button>Claim this Item</Button>
            </div>
          )}
        </article>
      </section>
    </main>
  );
}

export default ItemDetailsPage;
