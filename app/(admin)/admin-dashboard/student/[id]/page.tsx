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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Student Profile</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Personal Information */}
        <AdminCard title="Personal Information" className="bg-white shadow-lg rounded-xl">
          <div className="space-y-6">
            <div className="flex flex-col">
              <p className="text-sm font-medium text-gray-500">Full Name</p>
              <p className="text-lg font-semibold text-gray-900">
                {student.firstName} {student.lastName}
              </p>
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="text-lg font-semibold text-gray-900">{student.email}</p>
            </div>
          </div>
        </AdminCard>

        {/* Academic Information */}
        {student.profile && (
          <AdminCard title="Academic Information" className="bg-white shadow-lg rounded-xl">
            <div className="space-y-6">
              <div className="flex flex-col">
                <p className="text-sm font-medium text-gray-500">Medium</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatMedium(student.profile.medium)}
                </p>
              </div>
              <div className="flex flex-col">
                <p className="text-sm font-medium text-gray-500">Level of Study</p>
                <p className="text-lg font-semibold text-gray-900">
                  {student.profile.levelOfStudy}
                </p>
              </div>
              <div className="flex flex-col">
                <p className="text-sm font-medium text-gray-500">Subjects</p>
                <div className="flex flex-wrap gap-2 mt-2">
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
          <AdminCard
            title="Additional Details"
            className="bg-white shadow-lg rounded-xl lg:col-span-2"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <p className="text-sm font-medium text-gray-500">Location</p>
                <p className="text-lg font-semibold text-gray-900">
                  {student.profile.area}, {student.profile.district}
                </p>
              </div>
              <div className="flex flex-col">
                <p className="text-sm font-medium text-gray-500">Age</p>
                <p className="text-lg font-semibold text-gray-900">{student.profile.age}</p>
              </div>
              {student.profile.school && (
                <div className="flex flex-col">
                  <p className="text-sm font-medium text-gray-500">School</p>
                  <p className="text-lg font-semibold text-gray-900">{student.profile.school}</p>
                </div>
              )}
              {student.profile.college && (
                <div className="flex flex-col">
                  <p className="text-sm font-medium text-gray-500">College</p>
                  <p className="text-lg font-semibold text-gray-900">{student.profile.college}</p>
                </div>
              )}
              {student.profile.university && (
                <div className="flex flex-col">
                  <p className="text-sm font-medium text-gray-500">University</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {student.profile.university}
                  </p>
                </div>
              )}
            </div>
          </AdminCard>
        )}
      </div>
    </div>
  );
}
