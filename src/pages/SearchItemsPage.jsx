import { useEffect, useState } from 'react';
import ItemCard from '../components/ItemCard';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import Button from '../components/Button';
import FormInput from '../components/FormInput';
import { categories, locations } from '../assets/mockData';
import { itemsApi } from '../services/api';

function SearchItemsPage() {
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState({ location: '', category: '', search: '' });

  const loadItems = async (params = {}) => {
    try {
      const response = await itemsApi.getItems(params);
      setItems(response.data);
    } catch (error) {
      console.error('Failed to load search items:', error);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const applyFilters = () => {
    loadItems(filters);
  };

  const clearFilters = () => {
    const reset = { location: '', category: '', search: '' };
    setFilters(reset);
    loadItems(reset);
  };

  return (
    <main className="page-shell">
      <Navbar />

      <section className="search-layout">
        <aside className="filter-card">
          <div className="section-heading small">
            <h2>Filters</h2>
          </div>

          <FormInput
            label="Location"
            as="select"
            placeholder="Select location"
            options={locations}
            value={filters.location}
            onChange={(event) => setFilters((prev) => ({ ...prev, location: event.target.value }))}
          />
          <FormInput
            label="Category"
            as="select"
            placeholder="Select category"
            options={categories}
            value={filters.category}
            onChange={(event) => setFilters((prev) => ({ ...prev, category: event.target.value }))}
          />
          <FormInput label="Date Range" type="date" placeholder="Start date" />
          <FormInput type="date" placeholder="End date" />

          <Button onClick={applyFilters}>Apply Filters</Button>
          <Button variant="ghost" onClick={clearFilters}>Clear Filters</Button>
        </aside>

        <div className="search-results">
          <div className="section-heading">
            <div>
              <h2>Search Results</h2>
              <p>Showing {items.length} results</p>
            </div>
          </div>

          <SearchBar
            placeholder="Search found items..."
            onSearch={(value) => {
              const nextFilters = { ...filters, search: value };
              setFilters(nextFilters);
              loadItems(nextFilters);
            }}
          />

          <div className="items-grid two-column">
            {items.map((item) => (
              <ItemCard key={item._id} item={item} compact />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default SearchItemsPage;
