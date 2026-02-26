'use client';

import { Card, Metric, Text } from '@tremor/react';
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
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="max-w-xs mx-auto" decoration="top" decorationColor="indigo">
          <Text>Total Teachers</Text>
          <Metric>{stats.teachers.total}</Metric>
        </Card>
        <Card className="max-w-xs mx-auto" decoration="top" decorationColor="green">
          <Text>Total Students</Text>
          <Metric>{stats.students.total}</Metric>
        </Card>
        <Card className="max-w-xs mx-auto" decoration="top" decorationColor="amber">
          <Text>Active Tuitions</Text>
          <Metric>{stats.tuitions.byStatus.ACTIVE}</Metric>
        </Card>
        <Card className="max-w-xs mx-auto" decoration="top" decorationColor="rose">
          <Text>Total Revenue</Text>
          <Metric>৳{stats.payments.totalAmount.toLocaleString()}</Metric>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Medium Comparison Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Teachers & Students by Medium</h2>
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
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Tuition Status Distribution</h2>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="max-w-xs mx-auto" decoration="left" decorationColor="blue">
          <Text>Total Jobs</Text>
          <Metric>{stats.jobs.total}</Metric>
          <div className="mt-2 text-sm text-gray-600">
            <span className="text-green-600">{stats.jobs.byStatus.OPEN} Open</span> ·{' '}
            <span className="text-gray-500">{stats.jobs.byStatus.CLOSED} Closed</span>
          </div>
        </Card>
        <Card className="max-w-xs mx-auto" decoration="left" decorationColor="purple">
          <Text>Reports</Text>
          <Metric>{stats.reports.total}</Metric>
        </Card>
        <Card className="max-w-xs mx-auto" decoration="left" decorationColor="cyan">
          <Text>Announcements</Text>
          <Metric>{stats.announcements.total}</Metric>
        </Card>
      </div>
    </div>
  );
}
