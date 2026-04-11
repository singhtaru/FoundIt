import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import { formatItemDate, getItemImageUrl, fallbackItemImage } from '../services/itemUtils';

function ItemCard({ item, compact = false }) {
  const handleImageError = (event) => {
    event.currentTarget.src = fallbackItemImage;
  };

  return (
    <Link to={`/items/${item._id}`} className="item-card-link">
      <article className={`item-card ${compact ? 'compact' : ''}`}>
        <div className="item-thumb">
          <img src={getItemImageUrl(item.image)} alt={item.name} onError={handleImageError} />
        </div>
        <div className="item-copy">
          <h3>{item.name}</h3>
          <p>Found at: {item.location}</p>
          <p className="item-meta">Date: {formatItemDate(item)}</p>
          <StatusBadge status={item.status} />
        </div>
      </article>
    </Link>
  );
}

export default ItemCard;
