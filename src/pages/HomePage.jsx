import { Link } from 'react-router-dom';
import Button from '../components/Button';
import ItemCard from '../components/ItemCard';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import { items } from '../assets/mockData';

function HomePage() {
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

        <div className="items-grid">
          {items.slice(0, 4).map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </main>
  );
}

export default HomePage;
