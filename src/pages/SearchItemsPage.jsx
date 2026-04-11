import { useState, useMemo } from 'react';
import ItemCard from '../components/ItemCard';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import Button from '../components/Button';
import FormInput from '../components/FormInput';
import { categories, items, locations } from '../assets/mockData';

function SearchItemsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarFilters, setSidebarFilters] = useState({ location: '', category: '', startDate: '', endDate: '' });
  const [appliedFilters, setAppliedFilters] = useState({ location: '', category: '', startDate: '', endDate: '' });

  const handleApply = () => setAppliedFilters(sidebarFilters);
  
  const handleClear = () => {
    const empty = { location: '', category: '', startDate: '', endDate: '' };
    setSidebarFilters(empty);
    setAppliedFilters(empty);
    setSearchQuery('');
  };

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase()) && !item.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (appliedFilters.location && item.location !== appliedFilters.location) return false;
      if (appliedFilters.category && item.category !== appliedFilters.category) return false;
      if (appliedFilters.startDate && (!item.date || item.date < appliedFilters.startDate)) return false;
      if (appliedFilters.endDate && (!item.date || item.date > appliedFilters.endDate)) return false;
      return true;
    });
  }, [searchQuery, appliedFilters]);

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
            value={sidebarFilters.location}
            onChange={(e) => setSidebarFilters({ ...sidebarFilters, location: e.target.value })}
          />
          <FormInput 
            label="Category" 
            as="select" 
            placeholder="Select category" 
            options={categories} 
            value={sidebarFilters.category}
            onChange={(e) => setSidebarFilters({ ...sidebarFilters, category: e.target.value })}
          />
          <FormInput 
            label="Date Range" 
            type="date" 
            placeholder="Start date" 
            value={sidebarFilters.startDate}
            onChange={(e) => setSidebarFilters({ ...sidebarFilters, startDate: e.target.value })}
          />
          <FormInput 
            type="date" 
            placeholder="End date" 
            value={sidebarFilters.endDate}
            onChange={(e) => setSidebarFilters({ ...sidebarFilters, endDate: e.target.value })}
          />

          <Button onClick={handleApply}>Apply Filters</Button>
          <Button variant="ghost" onClick={handleClear}>Clear Filters</Button>
        </aside>

        <div className="search-results">
          <div className="section-heading">
            <div>
              <h2>Search Results</h2>
              <p>Showing {filteredItems.length} results</p>
            </div>
          </div>

          <SearchBar 
            placeholder="Search found items..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className="items-grid two-column">
            {filteredItems.map((item) => (
              <ItemCard key={item.id} item={item} compact />
            ))}
          </div>
          
          {filteredItems.length === 0 && (
             <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>
               <p>No items found matching your filters.</p>
             </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default SearchItemsPage;
