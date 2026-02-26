'use client';

import { useState, useEffect } from 'react';

import { AdminCard } from '@/components/ui/admin/AdminCard';
import { Input } from '@/components/ui/admin/Form';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthFetch } from '@/hooks/useAuthFetch';

interface PasswordChangeForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function SettingsPage() {
  const { logout } = useAuth();
  const { fetchWithAuth } = useAuthFetch();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  const [passwordForm, setPasswordForm] = useState<PasswordChangeForm>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    // Simulate loading of settings data
    const loadSettings = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: 'Error',
        description: 'New passwords do not match',
        variant: 'destructive',
      });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast({
        title: 'Error',
        description: 'New password must be at least 6 characters long',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/change-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            currentPassword: passwordForm.currentPassword,
            newPassword: passwordForm.newPassword,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to change password');
      }

      toast({
        title: 'Success',
        description: 'Password changed successfully. Please login again.',
      });

      // Clear form
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      // Logout after successful password change
      setTimeout(() => {
        logout();
      }, 2000);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to change password',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" />;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

      <div className="space-y-6">
        {/* Password Change Section */}
        <AdminCard title="Change Password">
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <Input
              label="Current Password"
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) =>
                setPasswordForm((prev) => ({
                  ...prev,
                  currentPassword: e.target.value,
                }))
              }
              required
            />
            <Input
              label="New Password"
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) =>
                setPasswordForm((prev) => ({
                  ...prev,
                  newPassword: e.target.value,
                }))
              }
              required
            />
            <Input
              label="Confirm New Password"
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) =>
                setPasswordForm((prev) => ({
                  ...prev,
                  confirmPassword: e.target.value,
                }))
              }
              required
            />
            <div className="flex justify-end">
              <Button type="submit">Change Password</Button>
            </div>
          </form>
        </AdminCard>

        {/* Profile Settings Section */}
        <AdminCard title="Profile Settings">
          <div className="text-gray-500 italic">Profile settings will be available soon.</div>
        </AdminCard>

        {/* Notification Settings Section */}
        <AdminCard title="Notification Settings">
          <div className="text-gray-500 italic">Notification settings will be available soon.</div>
        </AdminCard>
      </div>
    </div>
  );
}
