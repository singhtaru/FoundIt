import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import StatusBadge from '../components/StatusBadge';
import Button from '../components/Button';
import { itemsApi } from '../services/api';
import { formatItemDate, getItemImageUrl, fallbackItemImage } from '../services/itemUtils';

function ReviewItemPage() {
  const { id } = useParams();
  const [item, setItem] = useState(null);

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
                  src={getItemImageUrl(item.image)}
                  alt={item.name}
                  onError={(event) => { event.currentTarget.src = fallbackItemImage; }}
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
                <span>Date Found</span>
                <strong>{formatItemDate(item)}</strong>
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
              <Button variant="secondary" onClick={() => updateStatus('Claimed')}>Mark Claimed</Button>
              <Button variant="danger" onClick={() => updateStatus('Rejected')}>Reject Item</Button>
            </div>

            <section className="claim-panel">
              <div className="section-heading small no-margin">
                <div>
                  <h2>Claim Requests</h2>
                  <p>Review member-submitted ownership notes before approving a handoff.</p>
                </div>
              </div>

              {item.claimRequests?.length ? (
                <div className="claim-list">
                  {item.claimRequests.map((claim) => (
                    <article key={`${claim.userId}-${claim.createdAt}`} className="claim-list-item">
                      <strong>{claim.userName}</strong>
                      {claim.userEmail && <span>{claim.userEmail}</span>}
                      <p>{claim.message || 'No supporting note was added.'}</p>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="feedback-banner">No claim requests have been raised for this item yet.</p>
              )}
            </section>
          </article>
        </section>
      </div>
    </main>
  );
}

export default ReviewItemPage;
