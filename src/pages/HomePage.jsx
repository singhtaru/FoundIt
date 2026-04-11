import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import ItemCard from '../components/ItemCard';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import { itemsApi } from '../services/api';

function HomePage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const loadItems = async () => {
      try {
        const response = await itemsApi.getItems();
        setItems(response.data.slice(0, 4));
      } catch (error) {
        console.error('Failed to load items:', error);
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

        <SearchBar placeholder="Search for lost items..." className="hero-search" />

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
