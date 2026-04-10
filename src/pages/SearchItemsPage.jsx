import ItemCard from '../components/ItemCard';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import Button from '../components/Button';
import FormInput from '../components/FormInput';
import { categories, items, locations } from '../assets/mockData';

function SearchItemsPage() {
  return (
    <main className="page-shell">
      <Navbar />

      <section className="search-layout">
        <aside className="filter-card">
          <div className="section-heading small">
            <h2>Filters</h2>
          </div>

          <FormInput label="Location" as="select" placeholder="Select location" options={locations} />
          <FormInput label="Category" as="select" placeholder="Select category" options={categories} />
          <FormInput label="Date Range" type="date" placeholder="Start date" />
          <FormInput type="date" placeholder="End date" />

          <Button>Apply Filters</Button>
          <Button variant="ghost">Clear Filters</Button>
        </aside>

        <div className="search-results">
          <div className="section-heading">
            <div>
              <h2>Search Results</h2>
              <p>Showing {items.length} mock results</p>
            </div>
          </div>

          <SearchBar placeholder="Search found items..." />

          <div className="items-grid two-column">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} compact />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default SearchItemsPage;
