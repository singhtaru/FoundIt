import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';
import Button from '../components/Button';
import { items as mockItems } from '../assets/mockData';
import { itemsApi } from '../services/api';
import { formatItemDate, getItemImageUrl, normalizeMockItem } from '../services/itemUtils';
import { getStoredUser, hasMemberAccess, isAdminUser } from '../services/session';

const fallbackItems = mockItems.map(normalizeMockItem);

function ItemDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [error, setError] = useState('');
  const [claimMessage, setClaimMessage] = useState('');
  const [claimError, setClaimError] = useState('');
  const [claimSuccess, setClaimSuccess] = useState('');
  const [claimSubmitting, setClaimSubmitting] = useState(false);
  const memberAccess = hasMemberAccess();
  const adminUser = isAdminUser();
  const user = getStoredUser();

  const existingClaim = useMemo(() => {
    if (!item || !Array.isArray(item.claimRequests) || !user?.id) {
      return null;
    }

    return item.claimRequests.find((entry) => entry.userId === user.id);
  }, [item, user]);

  const canWithdrawClaim = Boolean(existingClaim && item && item.status !== 'Claimed');
  const isClaimableItem = item?.status === 'Approved';

  useEffect(() => {
    const loadItem = async () => {
      try {
        const response = await itemsApi.getItem(id);
        if (!adminUser && response.data?.status !== 'Approved') {
          setError('This item is not available on the user portal yet.');
          return;
        }
        setItem(response.data);
      } catch (apiError) {
        const fallbackItem = fallbackItems.find((entry) => entry._id === id);
        if (fallbackItem && (adminUser || fallbackItem.status === 'Approved')) {
          setItem(fallbackItem);
          return;
        }

        setError(apiError.response?.data?.message || 'Item details could not be loaded.');
      }
    };

    loadItem();
  }, [id]);

  const handleClaimRequest = async () => {
    setClaimError('');
    setClaimSuccess('');

    if (!memberAccess) {
      setClaimError('Log in first to raise a claim request for this item.');
      return;
    }

    if (!isClaimableItem) {
      setClaimError('Claim requests are only open for approved items.');
      return;
    }

    if (existingClaim) {
      setClaimError('You already raised a claim request for this item.');
      return;
    }

    if (!claimMessage.trim()) {
      setClaimError('Add identifying details before sending a claim request.');
      return;
    }

    setClaimSubmitting(true);
    try {
      const response = await itemsApi.createClaimRequest(id, { message: claimMessage });
      setItem(response.data);
      setClaimMessage('');
      setClaimSuccess('Your claim request has been submitted to the team for review.');
    } catch (apiError) {
      setClaimError(apiError.response?.data?.message || 'Claim request could not be submitted.');
    } finally {
      setClaimSubmitting(false);
    }
  };

  const handleClaimDelete = async () => {
    setClaimError('');
    setClaimSuccess('');
    setClaimSubmitting(true);

    try {
      const response = await itemsApi.deleteMyClaimRequest(id);
      setItem(response.data);
      setClaimMessage('');
      setClaimSuccess('Your claim request has been removed. You can submit a new one if needed.');
    } catch (apiError) {
      setClaimError(apiError.response?.data?.message || 'Claim request could not be removed.');
    } finally {
      setClaimSubmitting(false);
    }
  };

  return (
    <main className="page-shell">
      <Navbar />

      <section className="form-page">
        <div className="section-heading centered">
          <div>
            <span className="eyebrow">Listing details</span>
            <h1>Item Overview</h1>
          </div>
        </div>

        {!item && !error && (
          <article className="review-card member-gate centered-card">
            <p>Loading item details...</p>
          </article>
        )}

        {error && (
          <article className="review-card member-gate centered-card">
            <h2>Item unavailable</h2>
            <p>{error}</p>
            <Link to="/search">
              <Button>Back to search</Button>
            </Link>
          </article>
        )}

        {item && (
          <article className="review-card item-detail-card">
            <div className="review-hero">
              <div className="review-image item-detail-image">
                <img
                  src={getItemImageUrl(item.image)}
                  alt={item.name}
                  onError={(event) => {
                    event.currentTarget.src = getItemImageUrl(null);
                  }}
                />
              </div>
              <div className="review-copy">
                <div className="review-title">
                  <h2>{item.name}</h2>
                  <StatusBadge status={item.status} />
                </div>
                <div className="detail-block">
                  <span>Description</span>
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
                <span>Category</span>
                <strong>{item.category}</strong>
              </div>
              <div className="meta-box">
                <span>Reported By</span>
                <strong>{item.reporter?.name || item.reporter || 'Campus community'}</strong>
                {item.reporterEmail && <p>{item.reporterEmail}</p>}
              </div>
              <div className="meta-box">
                <span>Current Status</span>
                <strong>{item.status}</strong>
              </div>
            </div>

            <section className="claim-panel">
              <div className="section-heading small no-margin">
                <div>
                  <h2>Claim Request</h2>
                  <p>
                    {memberAccess
                      ? isClaimableItem
                        ? 'If this item is yours, send a short claim note so the admin team can verify it.'
                        : 'Claim requests are closed for this item until it is approved by admin.'
                      : 'Guests can browse details, but only signed-in members can raise a claim request.'}
                  </p>
                </div>
              </div>

              {!memberAccess && (
                <div className="member-gate-card">
                  <p>Log in first to raise a claim request for this item.</p>
                  <div className="review-actions left-actions">
                    <Button onClick={() => navigate('/auth', { state: { reason: 'members-only', message: 'Log in first to raise a claim request.' } })}>
                      Open Login Page
                    </Button>
                    <Link to="/search">
                      <Button variant="secondary">Keep Browsing</Button>
                    </Link>
                  </div>
                </div>
              )}

              {memberAccess && (
                <div className="claim-form">
                  {claimError && <p className="feedback-banner">{claimError}</p>}
                  {claimSuccess && <p className="feedback-banner success">{claimSuccess}</p>}
                  {!isClaimableItem && !existingClaim && (
                    <p className="feedback-banner">This item is {String(item.status || '').toLowerCase()}, so new claim requests are disabled for now.</p>
                  )}
                  {existingClaim ? (
                    <div className="claim-summary-card">
                      <p className="feedback-banner success">You already raised a claim request for this item.</p>
                      <div className="detail-block compact">
                        <span>Your submitted details</span>
                        <p>{existingClaim.message || 'No supporting note was added.'}</p>
                      </div>
                      <div className="review-actions left-actions">
                        <Button variant="secondary" onClick={handleClaimDelete} disabled={claimSubmitting || !canWithdrawClaim}>
                          {claimSubmitting ? 'Removing...' : canWithdrawClaim ? 'Delete My Request' : 'Request Locked'}
                        </Button>
                      </div>
                    </div>
                  ) : isClaimableItem ? (
                    <>
                      <textarea
                        className="form-control textarea"
                        rows="4"
                        placeholder="Add identifying details that prove this item belongs to you."
                        value={claimMessage}
                        onChange={(event) => setClaimMessage(event.target.value)}
                      />
                      <div className="review-actions left-actions">
                        <Button onClick={handleClaimRequest} disabled={claimSubmitting}>
                          {claimSubmitting ? 'Submitting...' : 'Raise Claim Request'}
                        </Button>
                      </div>
                    </>
                  ) : null}
                </div>
              )}
            </section>

            <div className="review-actions left-actions">
              <Link to="/search">
                <Button variant="secondary">Back to search</Button>
              </Link>
              <Link to="/report">
                <Button>Report another item</Button>
              </Link>
            </div>
          </article>
        )}
      </section>
    </main>
  );
}

export default ItemDetailsPage;