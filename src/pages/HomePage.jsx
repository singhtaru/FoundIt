import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import ItemCard from '../components/ItemCard';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import { itemsApi } from '../services/api';
import { items as mockItems } from '../assets/mockData';
import { normalizeMockItem } from '../services/itemUtils';

const fallbackItems = mockItems.map(normalizeMockItem);

function buildFeaturedItems(items) {
  const liveItems = Array.isArray(items) ? items : [];
  const seenNames = new Set(liveItems.map((item) => item.name));
  const extraItems = fallbackItems.filter((item) => !seenNames.has(item.name));

  return [...liveItems, ...extraItems].slice(0, 4);
}

function HomePage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  useEffect(() => {
    const loadItems = async () => {
      try {
        const response = await itemsApi.getItems();
        setItems(buildFeaturedItems(response.data));
      } catch (error) {
        console.error('Failed to load items:', error);
        setItems(buildFeaturedItems([]));
      }
    };

    loadItems();
  }, []);

  return (
    <main className="page-shell">
      <Navbar />

      <section className="hero-section">
        <div className="hero-copy">
          <span className="eyebrow">Trusted by VIT students</span>
          <h1>Lost something on campus? FoundIt can help.</h1>
          <p>
            Search recent listings, report what you found, and make recoveries simpler for
            everyone.
          </p>
        </div>

        <SearchBar
          placeholder="Search for lost items..."
          className="hero-search"
          onSearch={(value) => navigate('/search', { state: { initialSearch: value } })}
        />

        <div className="hero-actions">
          <Link to="/report">
            <Button>Report a Found Item</Button>
          </Link>
          <Link to="/search">
            <Button variant="secondary">Search All Listings</Button>
          </Link>
        </div>

        <div className="items-grid home-items-grid">
          {items.map((item) => (
            <ItemCard key={item._id} item={item} />
          ))}
        </div>
      </section>
    </main>
  );
}

export default HomePage;
