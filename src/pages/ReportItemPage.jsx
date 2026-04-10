import Navbar from '../components/Navbar';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import FileUpload from '../components/FileUpload';
import { locations } from '../assets/mockData';

function ReportItemPage() {
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

        <form className="report-card">
          <FormInput label="Item Name" placeholder="Enter the item name..." />
          <FormInput
            label="Description"
            as="textarea"
            rows="4"
            placeholder="Provide a description of the found item..."
          />

          <div className="split-fields">
            <FormInput
              label="Location Found"
              as="select"
              placeholder="Select location"
              options={locations}
            />
            <FormInput label="Date Found" type="date" />
          </div>

          <FileUpload />

          <div className="form-actions">
            <Button type="submit">Submit Report</Button>
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
