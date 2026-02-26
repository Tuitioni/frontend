import { AuthFormContainer } from '@/components/auth/AuthFormContainer';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Register',
  description: 'Create your Tuitioni account to start tutoring or find the perfect tutor.',
};

export default function RegisterPage() {
  return <AuthFormContainer defaultMode="register" />;
}
