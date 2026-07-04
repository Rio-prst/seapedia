import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navByRole: Record<string, { label: string; path: string }[]> = {
  admin: [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Manage Users', path: '/dashboard/users' },
    { label: 'All Products', path: '/dashboard/products' },
    { label: 'All Orders', path: '/dashboard/orders' },
    { label: 'Coupons', path: '/dashboard/coupons' },
  ],
  seller: [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'My Store', path: '/dashboard/seller/store' },
    { label: 'My Products', path: '/dashboard/seller/products' },
    { label: 'Add Product', path: '/dashboard/seller/products/new' },
    { label: 'Incoming Orders', path: '/dashboard/seller/orders' },
    { label: 'Coupons', path: '/dashboard/seller/coupons' },
  ],
  buyer: [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'My Cart', path: '/dashboard/buyer/cart' },
    { label: 'My Orders', path: '/dashboard/buyer/orders' },
    { label: 'My Addresses', path: '/dashboard/buyer/addresses' },
    { label: 'Wallet', path: '/dashboard/buyer/topup' },
  ],
  driver: [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Delivery Queue', path: '/dashboard/deliveries' },
    { label: 'My Deliveries', path: '/dashboard/deliveries/mine' },
  ],
};

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: Props) {
  const { user, logout } = useAuth();
  const role = user?.activeRole || 'buyer';
  const links = navByRole[role] || navByRole.buyer;

  const content = (
    <aside className="flex h-full w-64 flex-col border-r border-slate-200 bg-white">
      <div className="flex h-16 items-center justify-between px-6 border-b border-slate-200">
        <span className="text-lg font-bold text-teal-600">SEAPEDIA</span>
        <button
          onClick={onClose}
          className="md:hidden p-1 text-slate-500 hover:text-slate-800 cursor-pointer"
          aria-label="Close sidebar"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end={link.path === '/dashboard'}
            onClick={onClose}
            className={({ isActive }) =>
              `block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-teal-100 text-teal-600'
                  : 'text-slate-600 hover:bg-slate-100'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-slate-200 px-3 py-4">
        <div className="px-3 py-2 text-xs text-slate-500 uppercase tracking-wider">
          Role: {role}
        </div>
        <button
          onClick={() => { logout(); onClose(); }}
          className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          Logout
        </button>
      </div>
    </aside>
  );

  return (
    <>
      <div className="hidden md:flex h-full shrink-0">{content}</div>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="fixed inset-0 bg-black/40" onClick={onClose} />
          <div className="relative h-full">{content}</div>
        </div>
      )}
    </>
  );
}
