const itemImages = {
  backpack:
    'https://images.unsplash.com/photo-1581605405669-fcdf81165afa?auto=format&fit=crop&w=800&q=80',
  phone:
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
  keys:
    'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=800&q=80',
  bottle:
    'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80',
  glasses:
    'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
  book:
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
  earbuds:
    'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?auto=format&fit=crop&w=800&q=80',
  calculator:
    'https://images.unsplash.com/photo-1591696205602-2f950c417cb9?auto=format&fit=crop&w=800&q=80',
};

export const items = [
  {
    id: 1,
    name: 'Black Backpack',
    location: 'Library',
    status: 'Found',
    category: 'Bags',
    date: '2026-04-08',
    image: itemImages.backpack,
    description: 'Black leather backpack with notebooks and a water bottle.',
    reporter: 'John Doe',
    reporterEmail: 'johndoe23@vit.ac.in',
  },
  {
    id: 2,
    name: 'Smartphone',
    location: 'Cafeteria',
    status: 'Found',
    category: 'Electronics',
    date: '2026-04-07',
    image: itemImages.phone,
    description: 'A dark smartphone found near the payment counter.',
    reporter: 'Meera Nair',
    reporterEmail: 'meera.nair@vit.ac.in',
  },
  {
    id: 3,
    name: 'Car Keys',
    location: 'Parking Lot',
    status: 'Claimed',
    category: 'Accessories',
    date: '2026-04-05',
    image: itemImages.keys,
    description: 'Car keychain with two keys and a black remote.',
    reporter: 'Akash Verma',
    reporterEmail: 'akash.v@vit.ac.in',
  },
  {
    id: 4,
    name: 'Water Bottle',
    location: 'Gym',
    status: 'Found',
    category: 'Daily Use',
    date: '2026-04-04',
    image: itemImages.bottle,
    description: 'Steel water bottle with blue strap.',
    reporter: 'Riya Shah',
    reporterEmail: 'riya.shah@vit.ac.in',
  },
  {
    id: 5,
    name: 'Eyeglasses',
    location: 'Lecture Hall',
    status: 'Pending',
    category: 'Accessories',
    date: '2026-04-09',
    image: itemImages.glasses,
    description: 'Black-frame eyeglasses found on a lecture seat.',
    reporter: 'Daniel Raj',
    reporterEmail: 'daniel.raj@vit.ac.in',
  },
  {
    id: 6,
    name: 'Book',
    location: 'Library',
    status: 'Approved',
    category: 'Stationery',
    date: '2026-04-02',
    image: itemImages.book,
    description: 'Academic notebook with highlighted pages.',
    reporter: 'Kavin Kumar',
    reporterEmail: 'kavin.k@vit.ac.in',
  },
  {
    id: 7,
    name: 'Wireless Earbuds',
    location: 'Hostel Block A',
    status: 'Pending',
    category: 'Electronics',
    date: '2026-04-06',
    image: itemImages.earbuds,
    description: 'White earbuds case found near the entrance.',
    reporter: 'Sneha Iyer',
    reporterEmail: 'sneha.iyer@vit.ac.in',
  },
  {
    id: 8,
    name: 'Calculator',
    location: 'Lab Complex',
    status: 'Approved',
    category: 'Electronics',
    date: '2026-04-01',
    image: itemImages.calculator,
    description: 'Scientific calculator found during lab cleanup.',
    reporter: 'Aditya S',
    reporterEmail: 'aditya.s@vit.ac.in',
  },
];

export const locations = [
  'Library',
  'Cafeteria',
  'Parking Lot',
  'Gym',
  'Lecture Hall',
  'Hostel Block A',
  'Lab Complex',
];

export const categories = [
  'Accessories',
  'Bags',
  'Daily Use',
  'Electronics',
  'Stationery',
];

export const adminStats = [
  { label: 'Total Items Reported', value: 124, tone: 'blue' },
  { label: 'Pending Approvals', value: 8, tone: 'gold' },
  { label: 'Claimed Items', value: 42, tone: 'teal' },
];

export const adminMenu = [
  { label: 'Dashboard', path: '/admin' },
  { label: 'Pending Approvals', path: '/admin/pending' },
  { label: 'Approved Items', path: '/admin/approved' },
  { label: 'Claimed Items', path: '/admin/claimed' },
  { label: 'Settings', path: '/admin/settings' },
];
