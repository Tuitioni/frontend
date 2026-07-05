'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

import { LoadingSpinnerCenter } from '@/components/ui/LoadingSpinnerCenter';
import { useAuthFetch } from '@/hooks/useAuthFetch';

interface DashboardStats {
  teachers: {
    total: number;
    byMedium: {
      BANGLA_MEDIUM: number;
      ENGLISH_MEDIUM: number;
      ENGLISH_VERSION: number;
    };
  };
  students: {
    total: number;
    byMedium: {
      BANGLA_MEDIUM: number;
      ENGLISH_MEDIUM: number;
      ENGLISH_VERSION: number;
    };
  };
  tuitions: {
    total: number;
    byStatus: {
      PENDING: number;
      ACTIVE: number;
      COMPLETED: number;
      CANCELLED: number;
    };
  };
  payments: {
    total: number;
    totalAmount: number;
    byStatus: {
      PENDING: number;
      COMPLETED: number;
      FAILED: number;
    };
  };
  reports: {
    total: number;
  };
  announcements: {
    total: number;
  };
  jobs: {
    total: number;
    byStatus: {
      OPEN: number;
      CLOSED: number;
    };
  };
}

const COLORS = [
  'hsl(12, 76%, 61%)',
  'hsl(173, 58%, 39%)',
  'hsl(43, 74%, 66%)',
  'hsl(27, 87%, 67%)',
];

export default function AdminDashboard() {
  const router = useRouter();
  const { fetchWithAuth } = useAuthFetch();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetchWithAuth(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/dashboard/stats`
        );
        const data = await response.json();
        setStats(data);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [fetchWithAuth]);

  if (loading || !stats) {
    return <LoadingSpinnerCenter />;
  }

  const tuitionStatusData = [
    { name: 'Pending', value: stats.tuitions.byStatus.PENDING },
    { name: 'Active', value: stats.tuitions.byStatus.ACTIVE },
    { name: 'Completed', value: stats.tuitions.byStatus.COMPLETED },
    { name: 'Cancelled', value: stats.tuitions.byStatus.CANCELLED },
  ];

  const mediumComparisonData = [
    {
      name: 'Bangla Medium',
      teachers: stats.teachers.byMedium.BANGLA_MEDIUM,
      students: stats.students.byMedium.BANGLA_MEDIUM,
    },
    {
      name: 'English Medium',
      teachers: stats.teachers.byMedium.ENGLISH_MEDIUM,
      students: stats.students.byMedium.ENGLISH_MEDIUM,
    },
    {
      name: 'English Version',
      teachers: stats.teachers.byMedium.ENGLISH_VERSION,
      students: stats.students.byMedium.ENGLISH_VERSION,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Dashboard Overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          A snapshot of tutors, students, tuitions, and revenue across Tuitioni.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-soft-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Total Teachers
          </p>
          <p className="mt-2 font-display text-3xl font-extrabold tabular">
            {stats.teachers.total}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-soft-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Total Students
          </p>
          <p className="mt-2 font-display text-3xl font-extrabold tabular">
            {stats.students.total}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-soft-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Active Tuitions
          </p>
          <p className="mt-2 font-display text-3xl font-extrabold tabular">
            {stats.tuitions.byStatus.ACTIVE}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-soft-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Total Revenue
          </p>
          <p className="mt-2 font-display text-3xl font-extrabold tabular">
            ৳{stats.payments.totalAmount.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Medium Comparison Chart */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft-sm">
          <h2 className="mb-4 font-display text-lg font-bold">Teachers &amp; Students by Medium</h2>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mediumComparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="teachers" fill="hsl(197, 37%, 24%)" name="Teachers" />
                <Bar dataKey="students" fill="hsl(173, 58%, 39%)" name="Students" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tuition Status Distribution */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft-sm">
          <h2 className="mb-4 font-display text-lg font-bold">Tuition Status Distribution</h2>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={tuitionStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={150}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {tuitionStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-soft-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Total Jobs
          </p>
          <p className="mt-2 font-display text-3xl font-extrabold tabular">{stats.jobs.total}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium">
            <span className="inline-flex items-center rounded-pill bg-success/10 px-2.5 py-1 tabular text-success">
              {stats.jobs.byStatus.OPEN} Open
            </span>
            <span className="inline-flex items-center rounded-pill bg-muted px-2.5 py-1 tabular text-muted-foreground">
              {stats.jobs.byStatus.CLOSED} Closed
            </span>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-soft-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Reports
          </p>
          <p className="mt-2 font-display text-3xl font-extrabold tabular">{stats.reports.total}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-soft-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Announcements
          </p>
          <p className="mt-2 font-display text-3xl font-extrabold tabular">
            {stats.announcements.total}
          </p>
        </div>
      </div>
    </div>
  );
}
