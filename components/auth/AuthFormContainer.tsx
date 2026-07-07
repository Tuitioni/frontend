'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { tokenService } from '@/lib/auth/token';
import { AuthMode } from '@/types/auth';

type AuthRole = 'student' | 'teacher';

interface AuthFormContainerProps {
  defaultMode?: AuthMode;
  defaultRole?: AuthRole;
}

/** Only allow same-origin relative redirects (avoid open-redirect). */
function safeRedirect(role: AuthRole): string {
  const fallback = role === 'teacher' ? '/dashboard' : '/student-dashboard';
  if (typeof window === 'undefined') return fallback;
  const target = new URLSearchParams(window.location.search).get('redirect');
  if (target && target.startsWith('/') && !target.startsWith('//')) {
    return target;
  }
  return fallback;
}

export function AuthFormContainer({
  defaultMode = 'login',
  defaultRole = 'student',
}: AuthFormContainerProps) {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>(defaultMode);
  const [role, setRole] = useState<AuthRole>(defaultRole);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    district: '',
    area: '',
    username: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRegister = async () => {
    try {
      setIsLoading(true);
      setError('');

      const registerResponse = await fetch(`/api/register/${role}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          district: formData.district,
          area: formData.area,
        }),
      });

      if (!registerResponse.ok) {
        const errorData = await registerResponse.json();
        throw new Error(errorData.error || 'Registration failed');
      }

      // Auto-login after registration.
      const loginResponse = await fetch(`/api/login/${role}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: formData.email, password: formData.password }),
      });

      if (!loginResponse.ok) {
        throw new Error('Auto-login failed after registration');
      }

      const loginData = await loginResponse.json();
      if (!loginData.access_token) {
        throw new Error('No access token received');
      }

      tokenService.setToken(loginData.access_token);
      // Teachers complete their profile from the dashboard afterwards; no
      // placeholder profile is created here (it would pollute tutor search).
      router.push(safeRedirect(role));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      setError('');

      const response = await fetch(`/api/login/${role}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username || formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.message || 'Login failed');
      }

      const data = await response.json();
      if (data.access_token) {
        tokenService.setToken(data.access_token);
        router.push(safeRedirect(role));
      } else {
        throw new Error('No access token received');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const roleNoun = role === 'teacher' ? 'tutor' : 'student';

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-mesh px-4 py-12">
      <Card className="w-full max-w-md rounded-2xl border-border p-7 shadow-float sm:p-8">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-800 font-display text-lg font-extrabold text-white shadow-glow">
            T
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {mode === 'login'
              ? `Log in to your ${roleNoun} account.`
              : role === 'teacher'
                ? 'Join Tuitioni and start connecting with students.'
                : 'Join Tuitioni and find your perfect tutor.'}
          </p>
        </div>

        {/* Role selector */}
        <div className="mb-3 flex gap-1 rounded-pill bg-secondary p-1">
          {(['student', 'teacher'] as AuthRole[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`w-1/2 rounded-pill py-2 text-sm font-semibold transition-all ${
                role === r
                  ? 'bg-card text-primary shadow-soft-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {r === 'student' ? "I'm a Student" : "I'm a Tutor"}
            </button>
          ))}
        </div>

        {/* Mode selector */}
        <div className="mb-6 flex gap-1 rounded-pill bg-secondary p-1">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`w-1/2 rounded-pill py-2 text-sm font-semibold transition-all ${
              mode === 'login'
                ? 'bg-card text-primary shadow-soft-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`w-1/2 rounded-pill py-2 text-sm font-semibold transition-all ${
              mode === 'register'
                ? 'bg-card text-primary shadow-soft-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Register
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            mode === 'login' ? handleLogin() : handleRegister();
          }}
        >
          <div className="space-y-3.5">
            {mode === 'register' && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    name="firstName"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    name="lastName"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <Input
                  name="phone"
                  type="tel"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    name="district"
                    placeholder="District"
                    value={formData.district}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    name="area"
                    placeholder="Area"
                    value={formData.area}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </>
            )}

            <Input
              name={mode === 'login' ? 'username' : 'email'}
              type="email"
              placeholder="Email"
              value={mode === 'login' ? formData.username : formData.email}
              onChange={handleInputChange}
              required
            />

            <Input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />

            {error && (
              <div className="rounded-md bg-error/10 px-3 py-2 text-sm font-medium text-error">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full rounded-pill font-semibold shadow-glow"
              disabled={isLoading}
            >
              {isLoading ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Create account'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
