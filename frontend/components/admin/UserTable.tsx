'use client';

import { useState } from 'react';
import { Search, MoreVertical, Edit, Trash2, UserPlus, Download } from 'lucide-react';
import { colors } from '@/design-system/colors';
import { Button } from '@/design-system/components/Button';
import { Modal } from '@/components/shared/Modal';
import type { UserData } from '@/hooks/useAdmin';

interface UserTableProps {
  users: UserData[];
  loading?: boolean;
  onEdit?: (user: UserData) => void;
  onDelete?: (id: string) => void;
}

export function UserTable({ users, loading, onEdit, onDelete }: UserTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-background-200 overflow-hidden">
      <div className="p-6 border-b border-background-200">
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-background-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <Button size="sm" leftIcon={<UserPlus className="w-4 h-4" />}>
            Add User
          </Button>
          <Button variant="outline" size="sm" leftIcon={<Download className="w-4 h-4" />}>
            Export
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-background-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-text-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-text-500 uppercase tracking-wider">
                Current Day
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-text-500 uppercase tracking-wider">
                Streak
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-text-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-text-500 uppercase tracking-wider">
                Joined
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-text-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-background-200">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-text-500">
                  Loading users...
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-text-500">
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-background-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 font-medium">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-text-900">{user.name}</p>
                        <p className="text-sm text-text-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-text-700">Day {user.currentDay}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1 text-text-700">
                      🔥 {user.streak}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${user.isOnboarded
                          ? 'bg-success-100 text-success-700'
                          : 'bg-warning-100 text-warning-700'
                        }`}
                    >
                      {user.isOnboarded ? 'Active' : 'Onboarding'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-text-600">
                      {user.joinedAt ? new Date(user.joinedAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit?.(user)}
                        className="p-2 hover:bg-background-100 rounded-lg transition-colors text-text-500 hover:text-primary-600"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete?.(user.id)}
                        className="p-2 hover:bg-error-50 rounded-lg transition-colors text-text-500 hover:text-error-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
