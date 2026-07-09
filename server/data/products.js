const generateSKU = (category) => {
  const prefix = category.substring(0, 2).toUpperCase();
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `VLR-${prefix}-${timestamp}${random}`;
};


const productsData = [
  {
    name: 'Ergonomic Office Chair',
    description: 'Experience ultimate comfort with our ergonomic office chair. Designed to support your posture during long work hours, this chair features adjustable height, lumbar support, and premium leather upholstery.',
    price: 450.00,
    originalPrice: 550.00,
    stock: 32,
    category: 'Chairs',
    color: 'Black',
    material: 'Leather',
    images: [
      '/assets/images/Chair.jpg',
      '/assets/images/Office1.jpg'
    ],
    coverImage: '/assets/images/Chair.jpg',
    specifications: {
      material: 'Leather, Aluminum',
      color: 'Black, Gray',
      style: 'Modern, Ergonomic',
      assembly: 'Minimal assembly required',
      weightCapacity: '300 lbs',
      warranty: '3 years limited'
    },
    isFeatured: true,
    isSpecial: false
  },
  {
    name: 'Solid Wood Dining Table',
    description: 'Crafted from premium solid wood, this dining table brings warmth and elegance to your dining space. The natural wood grain adds character while the sturdy construction ensures years of use.',
    price: 850.00,
    originalPrice: 1050.00,
    stock: 12,
    category: 'Dining',
    color: 'Wood',
    material: 'Wood',
    images: [
      '/assets/images/p6.jpg',
      '/assets/images/p5.jpg'
    ],
    coverImage: '/assets/images/p6.jpg',
    specifications: {
      material: 'Solid Oak Wood',
      color: 'Natural Wood, Walnut',
      style: 'Rustic, Modern',
      assembly: 'Required (tools included)',
      weightCapacity: '400 lbs',
      warranty: '2 years limited'
    },
    isFeatured: true,
    isSpecial: false
  },
  {
    name: 'Minimalist Bookshelf',
    description: 'A sleek and modern bookshelf that combines functionality with minimalist design. Perfect for displaying your favorite books and decorative items.',
    price: 350.00,
    originalPrice: 450.00,
    stock: 0,
    category: 'Storage',
    color: 'Wood',
    material: 'Wood',
    images: [
      '/assets/images/Shelves.jpg'
    ],
    coverImage: '/assets/images/Shelves.jpg',
    specifications: {
      material: 'Engineered Wood',
      color: 'Natural Wood',
      style: 'Minimalist',
      assembly: 'Required (tools included)',
      weightCapacity: '200 lbs',
      warranty: '1 year limited'
    },
    isFeatured: false,
    isSpecial: false
  },
  {
    name: 'Leather Recliner',
    description: 'Premium leather recliner with adjustable positions for ultimate relaxation. Features plush cushioning and a sturdy frame for long-lasting comfort.',
    price: 720.00,
    originalPrice: 890.00,
    stock: 18,
    category: 'Living Room',
    color: 'Black',
    material: 'Leather',
    images: [
      '/assets/images/p4.jpg',
      '/assets/images/p3.jpg'
    ],
    coverImage: '/assets/images/p4.jpg',
    specifications: {
      material: 'Premium Leather',
      color: 'Black, Brown',
      style: 'Classic',
      assembly: 'Minimal assembly required',
      weightCapacity: '350 lbs',
      warranty: '3 years limited'
    },
    isFeatured: true,
    isSpecial: false
  },
  {
    name: 'Executive Desk',
    description: 'A sophisticated executive desk that combines elegance with functionality. Features a spacious work surface, cable management, and premium wood finish.',
    price: 850.00,
    originalPrice: 1050.00,
    stock: 8,
    category: 'Office',
    color: 'Wood',
    material: 'Wood',
    images: [
      '/assets/images/Office1.jpg',
      '/assets/images/Office2.jpg'
    ],
    coverImage: '/assets/images/Office1.jpg',
    specifications: {
      material: 'Solid Wood with Veneer',
      color: 'Mahogany',
      style: 'Executive, Classic',
      assembly: 'Required (tools included)',
      weightCapacity: '500 lbs',
      warranty: '3 years limited'
    },
    isFeatured: true,
    isSpecial: false
  },
  {
    name: 'Modern Nightstand',
    description: 'A sleek and stylish nightstand featuring a minimalist design with a natural wood finish and integrated USB charging port.',
    price: 180.00,
    originalPrice: 220.00,
    stock: 25,
    category: 'Bedroom',
    color: 'Wood',
    material: 'Wood',
    images: [
      '/assets/images/p2.jpg'
    ],
    coverImage: '/assets/images/p2.jpg',
    specifications: {
      material: 'Solid Wood',
      color: 'Natural, Walnut',
      style: 'Modern, Minimalist',
      assembly: 'Minimal assembly required',
      weightCapacity: '100 lbs',
      warranty: '1 year limited'
    },
    isFeatured: false,
    isSpecial: false
  },
  {
    name: 'Outdoor Lounge Set',
    description: 'Create the perfect outdoor retreat with this premium lounge set. Features weather-resistant materials and plush cushions for ultimate comfort.',
    price: 1200.00,
    originalPrice: 1500.00,
    stock: 5,
    category: 'Outdoor',
    color: 'Gray',
    material: 'Metal',
    images: [
      '/assets/images/Kids_furniture.jpg',
      '/assets/images/bx3.jpg'
    ],
    coverImage: '/assets/images/Kids_furniture.jpg',
    specifications: {
      material: 'Powder-coated Aluminum',
      color: 'Gray, Beige',
      style: 'Modern, Outdoor',
      assembly: 'Required (tools included)',
      weightCapacity: '400 lbs per seat',
      warranty: '2 years limited'
    },
    isFeatured: false,
    isSpecial: true
  },
  {
    name: 'Artisan Oak Dining Table',
    description: 'Handcrafted from 200-year-old oak, this masterpiece combines rustic charm with modern elegance. Each piece tells a unique story through its natural grain patterns.',
    price: 2500.00,
    originalPrice: 3000.00,
    stock: 3,
    category: 'Dining',
    color: 'Wood',
    material: 'Wood',
    images: [
      '/assets/images/p6.jpg',
      '/assets/images/p5.jpg'
    ],
    coverImage: '/assets/images/p6.jpg',
    specifications: {
      material: 'Solid Oak',
      color: 'Natural, Walnut',
      style: 'Rustic, Modern',
      assembly: 'Minimal assembly required',
      weightCapacity: '600 lbs',
      warranty: '5 years limited'
    },
    isFeatured: false,
    isSpecial: true
  },
  {
    name: 'Velvet Royal Lounge Chair',
    description: 'Inspired by 18th-century French design, this chair features hand-tufted velvet and solid mahogany legs. A true statement piece for the discerning collector.',
    price: 1800.00,
    originalPrice: 2200.00,
    stock: 2,
    category: 'Living Room',
    color: 'Blue',
    material: 'Fabric',
    images: [
      '/assets/images/p3.jpg',
      '/assets/images/p4.jpg'
    ],
    coverImage: '/assets/images/p3.jpg',
    specifications: {
      material: 'Velvet, Solid Mahogany',
      color: 'Royal Blue, Emerald',
      style: 'Classic, French',
      assembly: 'Minimal assembly required',
      weightCapacity: '250 lbs',
      warranty: '3 years limited'
    },
    isFeatured: false,
    isSpecial: true
  },
  {
    name: 'Minimalist Marble Coffee Table',
    description: 'A perfect fusion of form and function. The Carrara marble top sits on a geometric brass base, creating a sculpture that doubles as furniture.',
    price: 950.00,
    originalPrice: 1200.00,
    stock: 6,
    category: 'Living Room',
    color: 'White',
    material: 'Marble',
    images: [
      '/assets/images/p5.jpg',
      '/assets/images/p1.jpg'
    ],
    coverImage: '/assets/images/p5.jpg',
    specifications: {
      material: 'Carrara Marble, Brass',
      color: 'White, Gold',
      style: 'Modern, Minimalist',
      assembly: 'Minimal assembly required',
      weightCapacity: '150 lbs',
      warranty: '2 years limited'
    },
    isFeatured: true,
    isSpecial: true
  },
  {
    name: 'Bamboo Zen Bookshelf',
    description: 'Sustainable bamboo construction meets minimalist design. This bookshelf features an asymmetrical design that creates visual interest while maintaining perfect balance.',
    price: 650.00,
    originalPrice: 780.00,
    stock: 10,
    category: 'Storage',
    color: 'Wood',
    material: 'Bamboo',
    images: [
      '/assets/images/Shelves.jpg'
    ],
    coverImage: '/assets/images/Shelves.jpg',
    specifications: {
      material: 'Sustainable Bamboo',
      color: 'Natural Bamboo',
      style: 'Minimalist, Zen',
      assembly: 'Required (tools included)',
      weightCapacity: '300 lbs',
      warranty: '2 years limited'
    },
    isFeatured: false,
    isSpecial: true
  },
  {
    name: 'Industrial Loft Desk',
    description: 'Raw steel and reclaimed wood combine to create a workspace that\'s both rugged and refined. Each piece is hand-finished with a protective matte coating.',
    price: 750.00,
    originalPrice: 900.00,
    stock: 4,
    category: 'Office',
    color: 'Brown',
    material: 'Metal',
    images: [
      '/assets/images/Office5.jpg',
      '/assets/images/Office1.jpg'
    ],
    coverImage: '/assets/images/Office5.jpg',
    specifications: {
      material: 'Reclaimed Wood, Steel',
      color: 'Weathered Brown, Black',
      style: 'Industrial, Loft',
      assembly: 'Required (tools included)',
      weightCapacity: '400 lbs',
      warranty: '3 years limited'
    },
    isFeatured: false,
    isSpecial: true
  },
  {
    name: 'Sculptural Floor Lamp',
    description: 'More than just lighting—this is a sculptural piece that casts beautiful shadows. The hand-blown glass shade creates a warm, ambient glow.',
    price: 420.00,
    originalPrice: 520.00,
    stock: 8,
    category: 'Accessories',
    color: 'Gold',
    material: 'Glass',
    images: [
      '/assets/images/p4.jpg'
    ],
    coverImage: '/assets/images/p4.jpg',
    specifications: {
      material: 'Hand-blown Glass, Brass',
      color: 'Gold, Clear',
      style: 'Sculptural, Modern',
      assembly: 'Minimal assembly required',
      weightCapacity: 'N/A',
      warranty: '1 year limited'
    },
    isFeatured: false,
    isSpecial: true
  }
];

module.exports = productsData;