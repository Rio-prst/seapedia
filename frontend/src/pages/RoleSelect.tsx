import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import type { Role } from '../types';

const roleDescriptions: Record<Role, string> = {
  buyer: 'Browse and purchase products',
  seller: 'Manage your product listings',
  driver: 'Handle deliveries',
  admin: 'Full system access',
};

export default function RoleSelect() {
  const { user, selectRole } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleSelect = async (role: Role) => {
    await selectRole(role);
    navigate('/dashboard');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="rounded-xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm text-center">
          <h1 className="text-xl md:text-2xl font-bold text-slate-800">Select Your Role</h1>
          <p className="mt-2 text-sm text-slate-500">
            You have multiple roles. Choose one to continue.
          </p>
          <div className="mt-6 space-y-3">
            {user.roles.map((role) => (
              <button
                key={role}
                onClick={() => handleSelect(role)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-4 text-left transition-colors hover:border-teal-600 hover:bg-teal-50 cursor-pointer"
              >
                <span className="text-sm font-semibold text-slate-800 capitalize">{role}</span>
                <p className="mt-0.5 text-xs text-slate-500">{roleDescriptions[role]}</p>
              </button>
            ))}
          </div>
          <div className="mt-6">
            <Button variant="ghost" onClick={() => navigate('/')}>
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
