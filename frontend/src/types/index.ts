export type Role = 'admin' | 'seller' | 'buyer' | 'driver';

export interface User {
  id: number;
  username: string;
  email: string;
  roles: Role[];
  activeRole: Role | null;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: Pick<User, 'id' | 'username' | 'email'>;
}

export interface Review {
  id: number;
  reviewerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Store {
  id: number;
  name: string;
  description?: string;
  sellerId: number;
  seller?: { id: number; username: string };
  createdAt: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  description?: string;
  stock: number;
  storeId: number;
  store?: Store;
  createdAt: string;
  updatedAt: string;
}

export interface ProductInput {
  name: string;
  description?: string;
  price: number;
  stock: number;
}

export interface Wallet {
  id: number;
  buyerId: number;
  balance: number;
  transactions: WalletTransaction[];
}

export interface WalletTransaction {
  id: number;
  walletId: number;
  type: 'topup' | 'payment' | 'refund';
  amount: number;
  description: string;
  createdAt: string;
}

export interface Address {
  id: number;
  buyerId: number;
  label: string;
  recipientName: string;
  phone: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
  isDefault: boolean;
  createdAt: string;
}

export interface Cart {
  id: number;
  buyerId: number;
  storeId: number | null;
  store?: { id: number; name: string } | null;
  items: CartItem[];
}

export interface CartItem {
  id: number;
  cartId: number;
  productId: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: number;
    stock: number;
    description?: string;
  };
}

export type DeliveryMethod = 'instant' | 'next_day' | 'regular';

export interface Order {
  id: number;
  buyerId: number;
  storeId: number;
  store?: { id: number; name: string };
  buyer?: { id: number; username: string };
  addressId: number;
  address?: {
    id: number;
    label: string;
    recipientName: string;
    phone: string;
    street: string;
    city: string;
    province: string;
    postalCode: string;
  };
  driverId?: number;
  driver?: { id: number; username: string };
  coupon?: { id: number; code: string; type: string; value: number };
  deliveryMethod: DeliveryMethod;
  deliveryFee: number;
  subtotal: number;
  discount: number;
  ppn: number;
  total: number;
  status: string;
  deliveryDeadline?: string;
  items: OrderItem[];
  statusHistory: OrderStatusHistory[];
  createdAt: string;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  product: { id: number; name: string };
  quantity: number;
  price: number;
}

export interface OrderStatusHistory {
  id: number;
  orderId: number;
  status: string;
  createdAt: string;
}

export interface Coupon {
  id: number;
  storeId: number | null;
  store?: { id: number; name: string } | null;
  code: string;
  category: 'voucher' | 'promo';
  type: 'percent' | 'nominal';
  value: number;
  minPurchase?: number;
  maxUsage: number;
  usageCount: number;
  expiresAt?: string;
  createdAt: string;
  _count?: { orders: number };
}

export interface ProductReview {
  id: number;
  productId: number;
  buyerId: number;
  buyer?: { id: number; username: string };
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ReviewInput {
  rating: number;
  comment: string;
}

export interface CouponInput {
  code: string;
  category: 'voucher' | 'promo';
  type: 'percent' | 'nominal';
  value: number;
  minPurchase?: number;
  maxUsage: number;
  expiresAt?: string;
}

export interface DashboardStats {
  storeName?: string;
  productCount?: number;
  orderCount: number;
  revenue?: number;
  balance?: number;
  totalDeliveries?: number;
  inProgress?: number;
  completed?: number;
  earnings?: number;
  userCount?: number;
  storeCount?: number;
  couponCount?: number;
}
