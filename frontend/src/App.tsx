import { Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import RoleSelect from './pages/RoleSelect';
import Dashboard from './pages/Dashboard';
import DashboardLayout from './components/layout/DashboardLayout';
import SellerStore from './pages/seller/SellerStore';
import SellerProducts from './pages/seller/SellerProducts';
import SellerProductForm from './pages/seller/SellerProductForm';
import SellerIncomingOrders from './pages/seller/SellerIncomingOrders';
import SellerOrderDetail from './pages/seller/SellerOrderDetail';
import SellerCoupons from './pages/seller/SellerCoupons';
import ProductDetail from './pages/public/ProductDetail';
import StoreDetail from './pages/public/StoreDetail';
import BuyerCart from './pages/buyer/BuyerCart';
import BuyerCheckout from './pages/buyer/BuyerCheckout';
import BuyerOrders from './pages/buyer/BuyerOrders';
import BuyerOrderDetail from './pages/buyer/BuyerOrderDetail';
import BuyerAddresses from './pages/buyer/BuyerAddresses';
import BuyerTopUp from './pages/buyer/BuyerTopUp';
import DriverDeliveryQueue from './pages/driver/DriverDeliveryQueue';
import DriverMyDeliveries from './pages/driver/DriverMyDeliveries';
import DriverDeliveryDetail from './pages/driver/DriverDeliveryDetail';
import AdminUsers from './pages/admin/AdminUsers';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCoupons from './pages/admin/AdminCoupons';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/role-select" element={<RoleSelect />} />
      <Route path="/products/:id" element={<ProductDetail />} />
      <Route path="/stores/:id" element={<StoreDetail />} />
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="seller/store" element={<SellerStore />} />
        <Route path="seller/products" element={<SellerProducts />} />
        <Route path="seller/products/new" element={<SellerProductForm />} />
        <Route path="seller/products/:id/edit" element={<SellerProductForm />} />
        <Route path="seller/orders" element={<SellerIncomingOrders />} />
        <Route path="seller/orders/:id" element={<SellerOrderDetail />} />
        <Route path="seller/coupons" element={<SellerCoupons />} />
        <Route path="buyer/cart" element={<BuyerCart />} />
        <Route path="buyer/checkout" element={<BuyerCheckout />} />
        <Route path="buyer/orders" element={<BuyerOrders />} />
        <Route path="buyer/orders/:id" element={<BuyerOrderDetail />} />
        <Route path="buyer/addresses" element={<BuyerAddresses />} />
        <Route path="buyer/topup" element={<BuyerTopUp />} />
        <Route path="deliveries" element={<DriverDeliveryQueue />} />
        <Route path="deliveries/mine" element={<DriverMyDeliveries />} />
        <Route path="deliveries/:id" element={<DriverDeliveryDetail />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="coupons" element={<AdminCoupons />} />
        <Route path="*" element={<Dashboard />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
