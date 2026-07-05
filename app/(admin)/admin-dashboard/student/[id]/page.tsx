'use client';

import { useEffect, useState } from 'react';

import { AdminCard } from '@/components/ui/admin/AdminCard';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/components/ui/use-toast';
import { StudentDetail } from '@/types/Student';

export default function StudentDashboardByID({ params }: { params: { id: string } }) {
  const [student, setStudent] = useState<StudentDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/student/${params.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch student details');
        }

        const data = await response.json();
        setStudent(data);
      } catch (err: any) {
        toast({ title: 'Error', description: err.message, variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [params.id]);

  if (loading) {
    return <LoadingSpinner size="lg" />;
  }

  if (!student) {
    return (
      <EmptyState
        title="No student found"
        description="The student profile you're looking for doesn't exist or has been removed."
      />
    );
  }

  const formatMedium = (medium: string) => {
    return medium
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Student Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Full details for {student.firstName} {student.lastName}.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Personal Information */}
        <AdminCard title="Personal Information">
          <div className="space-y-5">
            <div className="flex flex-col">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Full Name
              </p>
              <p className="mt-1 text-lg font-semibold">
                {student.firstName} {student.lastName}
              </p>
            </div>
            <div className="flex flex-col">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Email
              </p>
              <p className="mt-1 text-lg font-semibold">{student.email}</p>
            </div>
          </div>
        </AdminCard>

        {/* Academic Information */}
        {student.profile && (
          <AdminCard title="Academic Information">
            <div className="space-y-5">
              <div className="flex flex-col">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Medium
                </p>
                <p className="mt-1 text-lg font-semibold">{formatMedium(student.profile.medium)}</p>
              </div>
              <div className="flex flex-col">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Level of Study
                </p>
                <p className="mt-1 text-lg font-semibold">{student.profile.levelOfStudy}</p>
              </div>
              <div className="flex flex-col">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Subjects
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {student.profile.subjects.map((subject, index) => (
                    <Badge key={index} variant="info">
                      {subject}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </AdminCard>
        )}

        {/* Additional Details */}
        {student.profile && (
          <AdminCard title="Additional Details" className="lg:col-span-2">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="flex flex-col">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Location
                </p>
                <p className="mt-1 text-lg font-semibold">
                  {student.profile.area}, {student.profile.district}
                </p>
              </div>
              <div className="flex flex-col">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Age
                </p>
                <p className="mt-1 text-lg font-semibold tabular">{student.profile.age}</p>
              </div>
              {student.profile.school && (
                <div className="flex flex-col">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    School
                  </p>
                  <p className="mt-1 text-lg font-semibold">{student.profile.school}</p>
                </div>
              )}
              {student.profile.college && (
                <div className="flex flex-col">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    College
                  </p>
                  <p className="mt-1 text-lg font-semibold">{student.profile.college}</p>
                </div>
              )}
              {student.profile.university && (
                <div className="flex flex-col">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    University
                  </p>
                  <p className="mt-1 text-lg font-semibold">{student.profile.university}</p>
                </div>
              )}
            </div>
          </AdminCard>
        )}
      </div>
    </div>
  );
}
