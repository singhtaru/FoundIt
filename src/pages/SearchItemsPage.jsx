import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ItemCard from '../components/ItemCard';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import Button from '../components/Button';
import FormInput from '../components/FormInput';
import { categories, items as mockItems, locations } from '../assets/mockData';
import { itemsApi } from '../services/api';
import { formatItemDate, normalizeMockItem } from '../services/itemUtils';

const fallbackItems = mockItems
  .map(normalizeMockItem)
  .filter((item) => String(item.status || '').toLowerCase() === 'approved');

function buildSearchItems(items, params = {}) {
  const liveItems = Array.isArray(items) ? items : [];
  const seenNames = new Set(liveItems.map((item) => item.name));
  const filteredFallback = fallbackItems.filter((item) => {
    const matchesLocation = !params.location || item.location === params.location;
    const matchesCategory = !params.category || item.category === params.category;
    const term = String(params.search || '').trim().toLowerCase();
    const matchesSearch = !term
      || item.name.toLowerCase().includes(term)
      || item.description.toLowerCase().includes(term);
    const itemDate = new Date(item.date || item.createdAt);
    const matchesStartDate = !params.startDate || itemDate >= new Date(params.startDate);
    const matchesEndDate = !params.endDate || itemDate <= new Date(`${params.endDate}T23:59:59`);

    return matchesLocation && matchesCategory && matchesSearch && matchesStartDate && matchesEndDate;
  });

  const extraItems = filteredFallback.filter((item) => !seenNames.has(item.name));
  return [...liveItems, ...extraItems];
}

function SearchItemsPage() {
  const locationState = useLocation();
  const initialSearch = locationState.state?.initialSearch || '';
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState({ location: '', category: '', search: initialSearch, startDate: '', endDate: '' });

  const loadItems = async (params = {}) => {
    const approvedOnlyParams = { ...params, status: 'Approved' };

    try {
      const response = await itemsApi.getItems(approvedOnlyParams);
      const nextItems = buildSearchItems(response.data, approvedOnlyParams);

      setItems(nextItems);
    } catch (error) {
      console.error('Failed to load search items:', error);
      setItems(buildSearchItems([], approvedOnlyParams));
    }
  };

  useEffect(() => {
    loadItems({ location: '', category: '', search: initialSearch, startDate: '', endDate: '' });
  }, [initialSearch]);

  const reportedMessage = locationState.state?.message;

  const applyFilters = () => {
    loadItems(filters);
  };

  const clearFilters = () => {
    const reset = { location: '', category: '', search: '', startDate: '', endDate: '' };
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
          <FormInput
            label="Date Found From"
            type="date"
            value={filters.startDate}
            onChange={(event) => setFilters((prev) => ({ ...prev, startDate: event.target.value }))}
          />
          <FormInput
            label="Date Found To"
            type="date"
            value={filters.endDate}
            onChange={(event) => setFilters((prev) => ({ ...prev, endDate: event.target.value }))}
          />

          <Button onClick={applyFilters}>Apply Filters</Button>
          <Button variant="ghost" onClick={clearFilters}>Clear Filters</Button>
        </aside>

        <div className="search-results">
          {reportedMessage && <p className="feedback-banner success">{reportedMessage}</p>}
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
