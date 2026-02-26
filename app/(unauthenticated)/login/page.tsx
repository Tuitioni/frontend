import { AuthFormContainer } from '@/components/auth/AuthFormContainer';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Login to your Tuitioni account to manage your tutoring profile and find students.',
};

export default function LoginPage() {
  return <AuthFormContainer defaultMode="login" />;
}
