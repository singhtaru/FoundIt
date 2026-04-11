import { useState } from 'react';
import Navbar from '../components/Navbar';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import FileUpload from '../components/FileUpload';
import { categories, locations } from '../assets/mockData';
import { itemsApi } from '../services/api';

function ReportItemPage() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    category: '',
    image: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const payload = new FormData();
      payload.append('name', formData.name);
      payload.append('description', formData.description);
      payload.append('location', formData.location);
      payload.append('category', formData.category);
      if (formData.image) {
        payload.append('image', formData.image);
      }

      await itemsApi.createItem(payload);
      setFormData({ name: '', description: '', location: '', category: '', image: null });
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Could not submit report.');
    } finally {
      setSubmitting(false);
    }
  };

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

          <FileUpload onChange={(event) => setFormData((prev) => ({ ...prev, image: event.target.files?.[0] || null }))} />

          <div className="form-actions">
            <Button type="submit">{submitting ? 'Submitting...' : 'Submit Report'}</Button>
            <Button variant="secondary" type="button">
              Cancel
            </Button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default ReportItemPage;
