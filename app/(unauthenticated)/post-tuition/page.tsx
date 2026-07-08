'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { tokenService } from '@/lib/auth/token';

const initial = {
  // student / child
  firstName: '',
  lastName: '',
  gender: 'MALE',
  age: '',
  class: '',
  levelOfStudy: '',
  medium: 'ENGLISH_MEDIUM',
  subjects: '',
  district: '',
  area: '',
  // tuition
  salary: '',
  numberOfDays: '',
  duration: '',
  tuitionType: 'Home',
  note: '',
  // contact / account
  email: '',
  phone: '',
  password: '',
};

export default function PostTuitionPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (name: keyof typeof initial, value: string) =>
    setForm((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        gender: form.gender,
        age: Number(form.age) || 0,
        class: form.class,
        levelOfStudy: form.levelOfStudy,
        medium: form.medium,
        subjects: form.subjects
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        district: form.district,
        area: form.area,
        salary: Number(form.salary) || 0,
        numberOfDays: Number(form.numberOfDays) || 0,
        duration: form.duration,
        tuitionType: form.tuitionType,
        note: form.note || undefined,
        email: form.email,
        phone: form.phone,
        password: form.password,
      };

      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to post your request');
      }

      // Auto sign-in and take them to their dashboard.
      if (data.access_token) {
        tokenService.setToken(data.access_token);
      }
      toast({
        title: 'Request posted',
        description:
          'Tutors can now see your request and apply. Track applicants on your dashboard.',
      });
      router.push('/student-dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-mesh">
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <div className="mb-8">
          <span className="mb-2 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-primary">
            <span className="h-2 w-2 rounded-full bg-amber" />
            Post a request
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Find a tutor for your child
          </h1>
          <p className="mt-2 text-muted-foreground">
            Describe what you need and verified tutors will apply. It takes a minute — we create
            your account as you post, so you can review applicants right after.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-8 rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-8"
        >
          {error && (
            <div className="rounded-md bg-error/10 px-3 py-2 text-sm font-medium text-error">
              {error}
            </div>
          )}

          {/* Student */}
          <section className="space-y-4">
            <h2 className="font-display text-lg font-bold">About the student</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label>First name</Label>
                <Input
                  value={form.firstName}
                  onChange={(e) => set('firstName', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>Last name</Label>
                <Input
                  value={form.lastName}
                  onChange={(e) => set('lastName', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>Gender</Label>
                <Select value={form.gender} onValueChange={(v) => set('gender', v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">Male</SelectItem>
                    <SelectItem value="FEMALE">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Age</Label>
                <Input
                  type="number"
                  value={form.age}
                  onChange={(e) => set('age', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>Class / grade</Label>
                <Input value={form.class} onChange={(e) => set('class', e.target.value)} required />
              </div>
              <div>
                <Label>Level of study</Label>
                <Input
                  placeholder="e.g. School, HSC, College"
                  value={form.levelOfStudy}
                  onChange={(e) => set('levelOfStudy', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>Medium</Label>
                <Select value={form.medium} onValueChange={(v) => set('medium', v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ENGLISH_MEDIUM">English Medium</SelectItem>
                    <SelectItem value="BANGLA_MEDIUM">Bangla Medium</SelectItem>
                    <SelectItem value="ENGLISH_VERSION">English Version</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Subjects (comma separated)</Label>
                <Input
                  placeholder="Physics, Math"
                  value={form.subjects}
                  onChange={(e) => set('subjects', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>District</Label>
                <Input
                  value={form.district}
                  onChange={(e) => set('district', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>Area</Label>
                <Input value={form.area} onChange={(e) => set('area', e.target.value)} required />
              </div>
            </div>
          </section>

          {/* Tuition */}
          <section className="space-y-4 border-t border-border pt-6">
            <h2 className="font-display text-lg font-bold">The tuition</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label>Budget (৳ / month)</Label>
                <Input
                  type="number"
                  value={form.salary}
                  onChange={(e) => set('salary', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>Days per week</Label>
                <Input
                  type="number"
                  value={form.numberOfDays}
                  onChange={(e) => set('numberOfDays', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>Session duration</Label>
                <Input
                  placeholder="e.g. 1.5 hours"
                  value={form.duration}
                  onChange={(e) => set('duration', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>Tuition type</Label>
                <Select value={form.tuitionType} onValueChange={(v) => set('tuitionType', v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Home">Home</SelectItem>
                    <SelectItem value="Online">Online</SelectItem>
                    <SelectItem value="Both">Either</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="sm:col-span-2">
                <Label>Notes (optional)</Label>
                <Input
                  placeholder="Anything tutors should know"
                  value={form.note}
                  onChange={(e) => set('note', e.target.value)}
                />
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className="space-y-4 border-t border-border pt-6">
            <h2 className="font-display text-lg font-bold">Your contact</h2>
            <p className="-mt-2 text-sm text-muted-foreground">
              We&apos;ll create your account with these so you can review applicants and message
              tutors.
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => set('email', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>Phone</Label>
                <Input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => set('phone', e.target.value)}
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <Label>Create a password</Label>
                <Input
                  type="password"
                  value={form.password}
                  onChange={(e) => set('password', e.target.value)}
                  required
                />
              </div>
            </div>
          </section>

          <Button
            type="submit"
            size="lg"
            disabled={loading}
            className="w-full rounded-pill font-semibold shadow-glow"
          >
            {loading ? 'Posting…' : 'Post request & find tutors'}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Already have an account?{' '}
            <a href="/login" className="font-semibold text-primary hover:underline">
              Log in
            </a>{' '}
            and post from your dashboard.
          </p>
        </form>
      </div>
    </div>
  );
}
