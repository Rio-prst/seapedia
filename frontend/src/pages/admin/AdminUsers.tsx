import { useState, useEffect } from 'react';
import * as adminApi from '../../api/admin.api';

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getUsers()
      .then((res) => setUsers(res.users))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-slate-500">Loading...</div>;

  return (
    <div>
      <h1 className="text-xl md:text-2xl font-bold text-slate-800">Manage Users</h1>
      <p className="mt-1 text-sm text-slate-500">{users.length} user(s)</p>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500">
              <th className="pb-2 font-medium">ID</th>
              <th className="pb-2 font-medium">Username</th>
              <th className="pb-2 font-medium">Email</th>
              <th className="pb-2 font-medium">Roles</th>
              <th className="pb-2 font-medium">Store</th>
              <th className="pb-2 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-slate-100 text-slate-700">
                <td className="py-2">{u.id}</td>
                <td className="py-2 font-medium">{u.username}</td>
                <td className="py-2 text-slate-500">{u.email}</td>
                <td className="py-2">
                  <div className="flex gap-1">
                    {u.roles.map((r: any) => (
                      <span
                        key={r.role}
                        className="rounded bg-teal-100 px-2 py-0.5 text-xs text-teal-700"
                      >
                        {r.role}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-2 text-slate-500">{u.stores?.[0]?.name || '-'}</td>
                <td className="py-2 text-slate-400">{new Date(u.createdAt).toLocaleDateString('id-ID')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
