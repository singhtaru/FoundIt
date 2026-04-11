import StatusBadge from './StatusBadge';
import { Link } from 'react-router-dom';


function ItemCard({ item, compact = false }) {
  return (
    <Link to={`/item/${item.id}`} className={`item-card ${compact ? 'compact' : ''}`}>
      <div className="item-thumb">
        <img src={item.image} alt={item.name} />
      </div>
      <div className="item-copy">
        <h3>{item.name}</h3>
        <p>Found at: {item.location}</p>
        <p>Found on: {item.date}</p>
        <StatusBadge status={item.status} />
      </div>
    </Link>
  );
}

export default ItemCard;
