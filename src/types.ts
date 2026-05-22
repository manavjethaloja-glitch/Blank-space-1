export type Category = 'Oversized Tees' | 'Shirts' | 'Cargo' | 'Caps' | 'Accessories' | 'Limited';

export type Vibe = 'Y2K' | 'Vintage' | 'Retro' | 'Graphic' | 'Limited';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: Category;
  vibes: Vibe[];
  imagePrimary: string;
  imageHover: string;
  stock: number;
  sizes: string[];
  rating: number;
  reviewCount: number;
  story: string;
  materials: string[];
  isLimited?: boolean;
  isComingSoon?: boolean;
}

export interface CartItem {
  product: Product;
  size: string;
  quantity: number;
}

export interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export type OrderStatus = 'Order Placed' | 'Manual Review' | 'Approved' | 'Shipped' | 'Delivered';

export interface Order {
  id: string;
  items: {
    product: Product;
    size: string;
    quantity: number;
    priceAtPurchase: number;
  }[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  paymentScreenshot?: string;
  upiTxnId?: string;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  trackingNumber?: string;
  createdAt: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone?: string;
  wishlist: string[]; // Product ids
  addresses: Address[];
}
