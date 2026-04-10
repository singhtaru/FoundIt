import StatusBadge from './StatusBadge';

function ItemCard({ item, compact = false }) {
  return (
    <article className={`item-card ${compact ? 'compact' : ''}`}>
      <div className="item-thumb">
        <img src={item.image} alt={item.name} />
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
