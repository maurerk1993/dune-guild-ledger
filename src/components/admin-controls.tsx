'use client';

import { useState } from 'react';

type UserRow = {
  id: string;
  email: string;
  display_name: string | null;
  role: 'member' | 'admin';
};

type Props = {
  initialUsers: UserRow[];
  currentUserId: string;
};

export function AdminControls({ initialUsers, currentUserId }: Props) {
  const [users, setUsers] = useState(initialUsers);
  const [status, setStatus] = useState<string | null>(null);

  async function updateRole(userId: string, role: 'member' | 'admin') {
    setStatus(null);

    const response = await fetch('/api/admin/roles', {
      method: 'PATCH',
      body: JSON.stringify({ userId, role })
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      setStatus(payload?.error ?? 'Unable to update user role.');
      return;
    }

    setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, role } : user)));
    setStatus('Role updated successfully.');
  }

  return (
    <section className="space-y-4">
      <div className="card space-y-2">
        <h2 className="text-lg font-semibold">Admin controls</h2>
        <p className="text-sm thematic-subtitle">Manage registered users and promote/demote administrator access.</p>
      </div>

      <div className="card table-shell overflow-auto">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead>
            <tr>
              <th className="pb-2">Email</th>
              <th className="pb-2">In-game username</th>
              <th className="pb-2">Current role</th>
              <th className="pb-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const isSelf = user.id === currentUserId;
              const isAdmin = user.role === 'admin';

              return (
                <tr key={user.id}>
                  <td className="py-2 pr-4">{user.email}</td>
                  <td className="py-2 pr-4">{user.display_name?.trim() || '—'}</td>
                  <td className="py-2 pr-4 capitalize">{user.role}</td>
                  <td className="py-2">
                    <div className="flex gap-2">
                      <button
                        className="btn-primary"
                        onClick={() => updateRole(user.id, 'admin')}
                        disabled={isAdmin}
                      >
                        Promote to admin
                      </button>
                      <button
                        className="btn-secondary"
                        onClick={() => updateRole(user.id, 'member')}
                        disabled={!isAdmin || isSelf}
                        title={isSelf ? 'You cannot demote your own account.' : 'Demote to member'}
                      >
                        Demote to member
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {status && <p className="text-xs thematic-subtitle">{status}</p>}
    </section>
  );
}
