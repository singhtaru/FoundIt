import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import FileUpload from '../components/FileUpload';
import { categories, locations } from '../assets/mockData';
import { itemsApi } from '../services/api';
import { hasMemberAccess } from '../services/session';

function ReportItemPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    category: '',
    date: '',
    image: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const memberAccess = hasMemberAccess();
  const selectedFileName = useMemo(() => formData.image?.name || '', [formData.image]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    if (!memberAccess) {
      setError('Sign in with a member account to report a found item.');
      setSubmitting(false);
      return;
    }

    try {
      const payload = new FormData();
      payload.append('name', formData.name);
      payload.append('description', formData.description);
      payload.append('location', formData.location);
      payload.append('category', formData.category);
      payload.append('date', formData.date);
      if (formData.image) {
        payload.append('image', formData.image);
      }

      await itemsApi.createItem(payload);
      setSuccess('Item reported successfully.');
      setFormData({ name: '', description: '', location: '', category: '', date: '', image: null });
      navigate('/search', { state: { message: 'Your report has been added to the listings.' } });
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Could not submit report.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!memberAccess) {
    return (
      <main className="page-shell">
        <Navbar />

        <section className="form-page">
          <div className="section-heading centered">
            <div>
              <span className="eyebrow">Members only</span>
              <h1>Sign in to report items</h1>
            </div>
          </div>

          <article className="review-card member-gate centered-card">
            <p>Guest users can browse listings, but only signed-in members can report found items.</p>
            <div className="review-actions">
              <Link to="/auth">
                <Button>Sign in</Button>
              </Link>
              <Link to="/search">
                <Button variant="secondary">Browse listings</Button>
              </Link>
            </div>
          </article>
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <Navbar />

      <section className="form-page">
        <div className="section-heading centered">
          <div>
            <span className="eyebrow">New listing</span>
            <h1>Report a Found Item</h1>
          </div>
        </div>

        <form className="report-card" onSubmit={handleSubmit}>
          {error && <p>{error}</p>}
          {success && <p className="feedback-banner success">{success}</p>}
          <FormInput
            label="Item Name"
            placeholder="Enter the item name..."
            name="name"
            value={formData.name}
            onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
          />
          <FormInput
            label="Description"
            as="textarea"
            rows="4"
            placeholder="Provide a description of the found item..."
            name="description"
            value={formData.description}
            onChange={(event) => setFormData((prev) => ({ ...prev, description: event.target.value }))}
          />

          <div className="split-fields">
            <FormInput
              label="Location Found"
              as="select"
              placeholder="Select location"
              options={locations}
              name="location"
              value={formData.location}
              onChange={(event) => setFormData((prev) => ({ ...prev, location: event.target.value }))}
            />
            <FormInput
              label="Category"
              as="select"
              placeholder="Select category"
              options={categories}
              name="category"
              value={formData.category}
              onChange={(event) => setFormData((prev) => ({ ...prev, category: event.target.value }))}
            />
          </div>

          <FormInput
            label="Date Found"
            type="date"
            name="date"
            value={formData.date}
            onChange={(event) => setFormData((prev) => ({ ...prev, date: event.target.value }))}
          />

          <FileUpload
            fileName={selectedFileName}
            onChange={(event) => setFormData((prev) => ({ ...prev, image: event.target.files?.[0] || null }))}
          />

          <div className="form-actions">
            <Button type="submit">{submitting ? 'Submitting...' : 'Submit Report'}</Button>
            <Link to="/search">
              <Button variant="secondary" type="button">Cancel</Button>
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}

export default ReportItemPage;
