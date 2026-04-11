import StatusBadge from './StatusBadge';

function ItemCard({ item, compact = false }) {
  const fallbackImage = 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80';
  const imageUrl = item?.image
    ? (item.image.startsWith('http') ? item.image : `http://localhost:5000/${item.image}`)
    : fallbackImage;

  const handleImageError = (event) => {
    event.currentTarget.src = fallbackImage;
  };

  return (
    <article className={`item-card ${compact ? 'compact' : ''}`}>
      <div className="item-thumb">
        <img src={imageUrl} alt={item.name} onError={handleImageError} />
      </div>
      <div className="item-copy">
        <h3>{item.name}</h3>
        <p>Found at: {item.location}</p>
        <StatusBadge status={item.status} />
      </div>
    </article>
  );
}

export default ItemCard;
