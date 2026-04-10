function StatusBadge({ status }) {
  const tone = {
    Found: 'green',
    Claimed: 'orange',
    Pending: 'gold',
    Approved: 'teal',
    Rejected: 'red',
  }[status] || 'blue';

  return <span className={`status-badge ${tone}`}>{status}</span>;
}

export default StatusBadge;
