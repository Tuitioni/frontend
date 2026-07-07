'use client';
import {
  Edit2,
  MapPin,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  Clock,
  AlertCircle,
  BookOpen,
  Wallet,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import { useToken } from '@/hooks/useToken';
import { TeacherDetail } from '@/types/teacher';

import { ProfileEditModal } from './components/ProfileEditModal';

export default function DashboardPage() {
  const { makeAuthenticatedRequest, logout } = useAuth();
  const [profile, setProfile] = useState<TeacherDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const decodedToken = useToken();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editSection, setEditSection] = useState<'profile' | 'teaching'>('profile');
  const router = useRouter();

  const openEditModal = (section: 'profile' | 'teaching') => {
    setEditSection(section);
    setIsEditModalOpen(true);
  };

  const fetchProfile = useCallback(async () => {
    if (!decodedToken?.sub) {
      setError('Authentication error - no user ID found');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await makeAuthenticatedRequest(`/api/teacher/${decodedToken.sub}`);
      setProfile(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  }, [decodedToken?.sub, makeAuthenticatedRequest]);

  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      fetchProfile();
    }
  }, [fetchProfile]);

  const handleProfileUpdate = (updatedProfile: TeacherDetail) => {
    setProfile(updatedProfile);
  };

  if (loading) return <DashboardSkeleton />;
  if (error) {
    return (
      <div className="min-h-[60vh] p-4 sm:p-6 flex items-center justify-center">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-soft">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-error/10 text-error">
            <AlertCircle className="h-6 w-6" />
          </span>
          <h2 className="mt-4 font-display text-xl font-bold">Couldn&apos;t load your dashboard</h2>
          <p className="mt-2 text-sm text-muted-foreground">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="mt-6 rounded-pill px-6 font-semibold shadow-glow"
          >
            Refresh Page
          </Button>
        </div>
      </div>
    );
  }

  const p = profile?.profile;
  const stats = [
    {
      label: 'Experience',
      value: `${p?.yearsOfExperience ?? 0}`,
      suffix: 'yrs',
      icon: Briefcase,
      trend: 'Teaching level: ' + (p?.teachingLevel ?? '—'),
    },
    {
      label: 'Subjects',
      value: `${p?.subjects?.length ?? 0}`,
      suffix: '',
      icon: BookOpen,
      trend: p?.medium?.replace('_', ' ') ?? '—',
    },
    {
      label: 'Expected Salary',
      value: `৳${(p?.monthlySalary ?? 0).toLocaleString()}`,
      suffix: '/mo',
      icon: Wallet,
      trend: 'Monthly rate',
    },
    {
      label: 'Availability',
      value: p?.availability ?? '—',
      suffix: '',
      icon: Clock,
      trend: `${p?.district ?? ''}${p?.area ? ', ' + p.area : ''}`,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6">
      {/* Complete-profile prompt for teachers with no profile yet */}
      {!profile?.profile && (
        <div className="mb-6 flex flex-col items-start justify-between gap-3 rounded-2xl border border-amber/30 bg-amber/10 p-5 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-amber/20 text-amber-600">
              <AlertCircle className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display font-bold">Complete your profile</p>
              <p className="text-sm text-muted-foreground">
                Add your subjects, rate, and experience so students can find and hire you. You
                won&apos;t appear in tutor search until your profile is complete.
              </p>
            </div>
          </div>
          <Button
            onClick={() => openEditModal('teaching')}
            className="shrink-0 rounded-pill font-semibold shadow-glow"
          >
            Complete profile
          </Button>
        </div>
      )}

      {/* Header Section */}
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Teacher Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Welcome back, {profile?.firstName ?? 'Teacher'}. Here&apos;s your profile at a glance.
          </p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <Button
            className="flex-1 rounded-pill font-semibold shadow-glow sm:flex-initial"
            onClick={() => router.push('/jobs')}
          >
            <Briefcase className="mr-2 h-4 w-4" />
            Find Teaching Jobs
          </Button>
          <Button className="flex-1 rounded-pill font-semibold sm:flex-initial" variant="outline">
            <Clock className="mr-2 h-4 w-4" />
            View Applications
          </Button>
          <Button
            variant="outline"
            onClick={logout}
            className="flex-1 rounded-pill font-semibold text-muted-foreground hover:border-error/40 hover:bg-error/10 hover:text-error sm:flex-initial"
          >
            Logout
          </Button>
          <ThemeToggle className="hidden sm:inline-grid" />
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="rounded-2xl border border-border bg-card p-5 shadow-soft-sm"
            >
              <div className="flex items-center justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-brand-50 text-primary dark:bg-primary/15">
                  <Icon className="h-5 w-5" />
                </span>
              </div>
              <p className="mt-4 truncate font-display text-2xl font-extrabold tabular">
                {s.value}
                {s.suffix && (
                  <span className="ml-1 text-base font-semibold text-muted-foreground">
                    {s.suffix}
                  </span>
                )}
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {s.label}
              </p>
              <p className="mt-2 flex items-center gap-1 truncate text-xs text-muted-foreground">
                <TrendingUp className="h-3.5 w-3.5 flex-shrink-0 text-success" />
                <span className="truncate">{s.trend}</span>
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <Card className="h-fit rounded-2xl border-border shadow-soft-sm lg:col-span-1 lg:sticky lg:top-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg sm:text-xl">Profile</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => openEditModal('profile')}
                aria-label="Edit profile"
                className="rounded-lg text-muted-foreground hover:text-primary"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6 flex flex-col items-center">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-800 shadow-soft sm:h-24 sm:w-24">
                <span className="font-display text-xl font-bold text-white sm:text-2xl">
                  {profile?.firstName?.[0]}
                  {profile?.lastName?.[0]}
                </span>
              </div>
              <h2 className="text-center font-display text-lg font-bold sm:text-xl">
                {profile?.firstName} {profile?.lastName}
              </h2>
              <span className="mt-2 inline-flex items-center gap-1.5 rounded-pill bg-secondary px-3 py-1 text-xs font-semibold text-primary">
                <GraduationCap className="h-3.5 w-3.5" />
                {profile?.profile?.teachingLevel} Teacher
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-lg bg-brand-50 text-primary dark:bg-primary/15">
                  <Mail className="h-4 w-4" />
                </span>
                <span className="break-all text-sm">{profile?.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-lg bg-brand-50 text-primary dark:bg-primary/15">
                  <Phone className="h-4 w-4" />
                </span>
                <span className="text-sm tabular">{profile?.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-lg bg-brand-50 text-primary dark:bg-primary/15">
                  <MapPin className="h-4 w-4" />
                </span>
                <span className="text-sm">
                  {profile?.profile?.district}, {profile?.profile?.area}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Area */}
        <div className="space-y-4 sm:space-y-6 lg:col-span-2">
          {/* Teaching Details Card */}
          <Card className="rounded-2xl border-border shadow-soft-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg sm:text-xl">Teaching Details</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openEditModal('teaching')}
                  aria-label="Edit teaching details"
                  className="rounded-lg text-muted-foreground hover:text-primary"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
                <div className="space-y-5">
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-primary" />
                      <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Education
                      </h3>
                    </div>
                    <p className="text-sm font-medium">{profile?.profile?.education}</p>
                  </div>
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-primary" />
                      <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Experience
                      </h3>
                    </div>
                    <p className="text-sm font-medium tabular">
                      {profile?.profile?.yearsOfExperience} years
                    </p>
                  </div>
                </div>
                <div className="space-y-5">
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-primary" />
                      <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Subjects
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {profile?.profile?.subjects.map((subject, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center rounded-pill bg-secondary px-3 py-1 text-xs font-semibold text-primary"
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Availability
                      </h3>
                    </div>
                    <p className="text-sm font-medium">{profile?.profile?.availability}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Details Card */}
          <Card className="rounded-2xl border-border shadow-soft-sm">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Additional Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                <div className="rounded-xl border border-border bg-muted/40 p-4">
                  <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Medium
                  </h3>
                  <p className="text-sm font-semibold">
                    {profile?.profile?.medium.replace('_', ' ')}
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-muted/40 p-4">
                  <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Specialization
                  </h3>
                  <p className="line-clamp-1 text-sm font-semibold">
                    {profile?.profile?.specialization}
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-muted/40 p-4">
                  <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Expected Salary
                  </h3>
                  <p className="text-sm font-semibold tabular">
                    ৳{profile?.profile?.monthlySalary.toLocaleString()}
                    <span className="font-normal text-muted-foreground">/month</span>
                  </p>
                </div>
              </div>

              {/* Verification Card */}
              <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-warning/30 dark:bg-warning/10">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-lg bg-amber-100 text-amber-600 dark:bg-warning/20 dark:text-warning">
                      <AlertCircle className="h-5 w-5" />
                    </span>
                    <h3 className="font-display text-base font-bold sm:text-lg">
                      Verify Your Account
                    </h3>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-pill bg-warning/10 px-3 py-1 text-xs font-semibold text-warning">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Not verified
                  </span>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  Please verify your account by uploading either your NID or Birth Certificate
                </p>
                <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/dashboard/verify/nid`)}
                    className="rounded-pill bg-card text-sm font-semibold"
                  >
                    Upload NID
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/dashboard/verify/birth-certificate`)}
                    className="rounded-pill bg-card text-sm font-semibold"
                  >
                    Upload Birth Certificate
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/dashboard/verify/passport`)}
                    className="rounded-pill bg-card text-sm font-semibold"
                  >
                    Upload Passport
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Profile Edit Modal */}
      {profile && (
        <ProfileEditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          profile={profile}
          onProfileUpdate={handleProfileUpdate}
          section={editSection}
        />
      )}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48 sm:h-10" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <Skeleton className="h-10 w-full rounded-pill sm:w-32" />
          <Skeleton className="h-10 w-full rounded-pill sm:w-32" />
          <Skeleton className="h-10 w-full rounded-pill sm:w-24" />
        </div>
      </div>
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[132px] rounded-2xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
        <Skeleton className="h-[400px] rounded-2xl" />
        <div className="space-y-4 sm:space-y-6 lg:col-span-2">
          <Skeleton className="h-[300px] rounded-2xl" />
          <Skeleton className="h-[400px] rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
