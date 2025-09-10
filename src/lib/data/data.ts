
import { Order, Product, Review, StoreInfo, ChartData } from '@/types';

// Mock Products Data
export const products: Product[] = [
  {
    id: '1',
    name: 'Paracetamol 500mg',
    description: 'Pain reliever and fever reducer',
    price: 9.99,
    stock: 100,
    image: '/placeholder.svg',
    category: 'Pain Relief',
    active: true,
  },
  {
    id: '2',
    name: 'Vitamin C 1000mg',
    description: 'Immune system support',
    price: 12.99,
    stock: 80,
    image: '/placeholder.svg',
    category: 'Vitamins',
    active: true,
  },
  {
    id: '3',
    name: 'Elastic Bandage',
    description: 'For sprains and injuries',
    price: 5.99,
    stock: 50,
    image: '/placeholder.svg',
    category: 'First Aid',
    active: true,
  },
  {
    id: '4',
    name: 'Blood Pressure Monitor',
    description: 'Digital blood pressure monitor',
    price: 79.99,
    stock: 20,
    image: '/placeholder.svg',
    category: 'Devices',
    active: true,
  },
  {
    id: '5',
    name: 'Antihistamine 10mg',
    description: 'Allergy relief medication',
    price: 14.99,
    stock: 60,
    image: '/placeholder.svg',
    category: 'Allergy',
    active: true,
  },
];

// Mock Orders Data
export const orders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2023-001',
    customer: {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '555-123-4567',
      address: '123 Main St, Anytown',
    },
    items: [
      {
        product: products[0],
        quantity: 2,
        unitPrice: products[0].price,
      },
      {
        product: products[2],
        quantity: 1,
        unitPrice: products[2].price,
      },
    ],
    total: 25.97,
    status: 'pending',
    date: '2023-04-08T14:30:00',
    deliveryAddress: '123 Main St, Anytown',
    paymentMethod: 'Credit Card',
  },
  {
    id: '2',
    orderNumber: 'ORD-2023-002',
    customer: {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '555-987-6543',
      address: '456 Elm St, Othertown',
    },
    items: [
      {
        product: products[1],
        quantity: 1,
        unitPrice: products[1].price,
      },
    ],
    total: 12.99,
    status: 'with_delivery',
    date: '2023-04-08T15:45:00',
    deliveryAddress: '456 Elm St, Othertown',
    paymentMethod: 'PayPal',
  },
  {
    id: '3',
    orderNumber: 'ORD-2023-003',
    customer: {
      id: '3',
      name: 'Robert Johnson',
      email: 'robert@example.com',
      phone: '555-789-0123',
      address: '789 Oak St, Somewhere',
    },
    items: [
      {
        product: products[3],
        quantity: 1,
        unitPrice: products[3].price,
      },
      {
        product: products[4],
        quantity: 2,
        unitPrice: products[4].price,
      },
    ],
    total: 109.97,
    status: 'delivered',
    date: '2023-04-07T10:15:00',
    deliveryAddress: '789 Oak St, Somewhere',
    paymentMethod: 'Cash on Delivery',
  },
  {
    id: '4',
    orderNumber: 'ORD-2023-004',
    customer: {
      id: '4',
      name: 'Emily Davis',
      email: 'emily@example.com',
      phone: '555-456-7890',
      address: '101 Pine St, Elsewhere',
    },
    items: [
      {
        product: products[0],
        quantity: 3,
        unitPrice: products[0].price,
      },
    ],
    total: 29.97,
    status: 'accepted',
    date: '2023-04-08T09:20:00',
    deliveryAddress: '101 Pine St, Elsewhere',
    paymentMethod: 'Credit Card',
  },
  {
    id: '5',
    orderNumber: 'ORD-2023-005',
    customer: {
      id: '5',
      name: 'Michael Wilson',
      email: 'michael@example.com',
      phone: '555-321-6547',
      address: '202 Maple St, Nowhere',
    },
    items: [
      {
        product: products[2],
        quantity: 2,
        unitPrice: products[2].price,
      },
      {
        product: products[4],
        quantity: 1,
        unitPrice: products[4].price,
      },
    ],
    total: 26.97,
    status: 'rejected',
    date: '2023-04-07T16:50:00',
    deliveryAddress: '202 Maple St, Nowhere',
    paymentMethod: 'PayPal',
  },
];

// Mock Reviews Data
export const reviews: Review[] = [
  {
    id: '1',
    customer: orders[0].customer,
    rating: 5,
    comment: 'Great service! The delivery was fast and the products were exactly as described.',
    date: '2023-04-09T10:00:00',
    orderNumber: orders[0].orderNumber,
  },
  {
    id: '2',
    customer: orders[1].customer,
    rating: 4,
    comment: 'Good products and fast delivery. Would order again.',
    date: '2023-04-09T11:30:00',
    orderNumber: orders[1].orderNumber,
  },
  {
    id: '3',
    customer: orders[2].customer,
    rating: 5,
    comment: 'Excellent service! The delivery person was very polite.',
    date: '2023-04-08T14:15:00',
    orderNumber: orders[2].orderNumber,
  },
  {
    id: '4',
    customer: orders[3].customer,
    rating: 3,
    comment: 'Products were good but delivery took longer than expected.',
    date: '2023-04-08T16:45:00',
    orderNumber: orders[3].orderNumber,
  },
  {
    id: '5',
    customer: orders[4].customer,
    rating: 4,
    comment: 'Great products and reasonable prices. The app is easy to use too.',
    date: '2023-04-07T13:20:00',
    orderNumber: orders[4].orderNumber,
  },
];

// Store Information
export const storeInfo: StoreInfo = {
  name: 'MedExpress Pharmacy',
  address: '123 Health Street, Medicine City',
  phone: '555-PHARMACY',
  email: 'contact@medexpress.com',
  openingHours: {
    open: '08:00',
    close: '20:00',
  },
  isOpen: true,
  logo: '/placeholder.svg',
};

// Chart Data for Dashboard
export const salesChartData: ChartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Sales ($)',
      data: [1200, 1900, 1500, 2500, 2200, 3000],
      backgroundColor: ['rgba(13, 110, 253, 0.2)'],
      borderColor: ['rgba(13, 110, 253, 1)'],
      borderWidth: 2,
    },
  ],
};

export const ordersChartData: ChartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Orders',
      data: [45, 65, 50, 80, 75, 95],
      backgroundColor: ['rgba(32, 201, 151, 0.2)'],
      borderColor: ['rgba(32, 201, 151, 1)'],
      borderWidth: 2,
    },
  ],
};

export const productsChartData: ChartData = {
  labels: ['Pain Relief', 'Vitamins', 'First Aid', 'Devices', 'Allergy'],
  datasets: [
    {
      label: 'Products by Category',
      data: [30, 25, 15, 10, 20],
      backgroundColor: [
        'rgba(13, 110, 253, 0.6)',
        'rgba(32, 201, 151, 0.6)',
        'rgba(255, 193, 7, 0.6)',
        'rgba(220, 53, 69, 0.6)',
        'rgba(13, 202, 240, 0.6)',
      ],
      borderColor: [
        'rgba(13, 110, 253, 1)',
        'rgba(32, 201, 151, 1)',
        'rgba(255, 193, 7, 1)',
        'rgba(220, 53, 69, 1)',
        'rgba(13, 202, 240, 1)',
      ],
      borderWidth: 1,
    },
  ],
};
