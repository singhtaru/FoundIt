export const fallbackItemImage = 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80';

export function normalizeMockItem(item) {
  return {
    ...item,
    _id: String(item.id),
    reporter: item.reporter
      ? {
          _id: `mock-reporter-${item.id}`,
          name: item.reporter,
          email: item.reporterEmail,
        }
      : null,
    claimRequests: [],
  };
}

export function getItemImageUrl(image) {
  if (!image) {
    return fallbackItemImage;
  }

  return image.startsWith('http') ? image : `http://localhost:5000/${image}`;
}

export function getItemDateValue(item) {
  return item?.date || item?.createdAt || null;
}

export function formatItemDate(item) {
  const dateValue = getItemDateValue(item);

  if (!dateValue) {
    return 'Date not available';
  }

  return new Date(dateValue).toLocaleDateString();
}