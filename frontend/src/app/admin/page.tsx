'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { adminAPI } from '@/lib/api';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated() || user?.role !== 'ADMIN') {
      router.push('/login');
      return;
    }

    const loadStats = async () => {
      try {
        const response = await adminAPI.getStats();
        setStats(response.data);
      } catch (error) {
        console.error('Failed to load stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated() || user?.role !== 'ADMIN') {
    return null;
  }

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Dashboard
        </h1>

        {loading ? (
          <div className="text-gray-600 dark:text-gray-400">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                Total Users
              </h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {stats?.totalUsers || 0}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                Active Users
              </h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {stats?.activeUsers || 0}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                Conversations
              </h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {stats?.totalConversations || 0}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                Messages
              </h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {stats?.totalMessages || 0}
              </p>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
