import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
import { useAuth } from '@/hooks/useAuth';
import { TeacherDetail } from '@/types/teacher';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: TeacherDetail;
  onProfileUpdate: (updatedProfile: TeacherDetail) => void;
  /** Which section to edit: personal profile fields or teaching details. */
  section?: 'profile' | 'teaching';
}

export function ProfileEditModal({
  isOpen,
  onClose,
  profile,
  onProfileUpdate,
  section = 'profile',
}: ProfileEditModalProps) {
  const { makeAuthenticatedRequest } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState<TeacherDetail>(profile);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // No profile yet -> this is a first-time "complete your profile" flow.
  const creating = !profile.profile;
  const showPersonal = section === 'profile' && !creating;
  const showLocation = section === 'profile' || creating;
  const showTeaching = section === 'teaching' || creating;

  const handleChange = (
    field: keyof Omit<TeacherDetail, 'profile'>,
    value: TeacherDetail[keyof Omit<TeacherDetail, 'profile'>]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleProfileChange = (field: keyof NonNullable<TeacherDetail['profile']>, value: any) => {
    setFormData((prev) => ({
      ...prev,
      profile: {
        ...(prev.profile || {}),
        [field]: value,
      } as TeacherDetail['profile'],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const changedFields: Record<string, unknown> = {};

      // Basic (teacher-table) fields that changed.
      (Object.keys(formData) as Array<keyof TeacherDetail>).forEach((key) => {
        if (key !== 'profile' && JSON.stringify(profile[key]) !== JSON.stringify(formData[key])) {
          changedFields[key] = formData[key];
        }
      });

      // Profile: send the full object when creating or when anything changed.
      // The backend upserts, so a complete object is safe for both cases.
      const fp = formData.profile;
      const profileChanged = JSON.stringify(profile.profile ?? null) !== JSON.stringify(fp ?? null);
      if (fp && (creating || profileChanged)) {
        changedFields.profile = {
          ...fp,
          age: Number(fp.age) || 18,
          yearsOfExperience: Number(fp.yearsOfExperience) || 0,
          monthlySalary: Number(fp.monthlySalary) || 0,
        } as TeacherDetail['profile'];
      }

      if (Object.keys(changedFields).length === 0) {
        onClose();
        return;
      }

      const updatedProfile = await makeAuthenticatedRequest(`/api/teacher/${profile.id}`, {
        method: 'PUT',
        data: changedFields,
      });

      onProfileUpdate(updatedProfile);
      toast({
        title: creating ? 'Profile created' : 'Profile updated',
        description: creating
          ? 'Your profile is live — students can now find you in search.'
          : 'Your profile has been successfully updated.',
      });
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to save profile';
      setError(msg);
      toast({ title: 'Save failed', description: msg, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const title = creating
    ? 'Complete your teaching profile'
    : section === 'teaching'
      ? 'Edit Teaching Details'
      : 'Edit Profile';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-xl border border-error/20 bg-error/10 p-3 text-sm font-medium text-error">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {showPersonal && (
              <>
                <div>
                  <Label>First Name</Label>
                  <Input
                    value={formData.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Last Name</Label>
                  <Input
                    value={formData.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                  />
                </div>
              </>
            )}

            {showLocation && (
              <>
                <div>
                  <Label>District</Label>
                  <Input
                    value={formData.profile?.district ?? ''}
                    onChange={(e) => handleProfileChange('district', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Area</Label>
                  <Input
                    value={formData.profile?.area ?? ''}
                    onChange={(e) => handleProfileChange('area', e.target.value)}
                  />
                </div>
              </>
            )}

            {showTeaching && (
              <>
                <div>
                  <Label>Gender</Label>
                  <Select
                    value={formData.profile?.gender}
                    onValueChange={(value) => handleProfileChange('gender', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
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
                    value={formData.profile?.age ?? ''}
                    onChange={(e) => handleProfileChange('age', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label>Education</Label>
                  <Input
                    value={formData.profile?.education ?? ''}
                    onChange={(e) => handleProfileChange('education', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Experience (years)</Label>
                  <Input
                    type="number"
                    value={formData.profile?.yearsOfExperience ?? 0}
                    onChange={(e) =>
                      handleProfileChange('yearsOfExperience', parseInt(e.target.value) || 0)
                    }
                  />
                </div>
                <div>
                  <Label>Teaching Level</Label>
                  <Input
                    value={formData.profile?.teachingLevel ?? ''}
                    onChange={(e) => handleProfileChange('teachingLevel', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Medium</Label>
                  <Select
                    value={formData.profile?.medium}
                    onValueChange={(value) => handleProfileChange('medium', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select medium" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ENGLISH_MEDIUM">English Medium</SelectItem>
                      <SelectItem value="BANGLA_MEDIUM">Bangla Medium</SelectItem>
                      <SelectItem value="ENGLISH_VERSION">English Version</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Specialization</Label>
                  <Input
                    value={formData.profile?.specialization ?? ''}
                    onChange={(e) => handleProfileChange('specialization', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Availability</Label>
                  <Input
                    value={formData.profile?.availability ?? ''}
                    onChange={(e) => handleProfileChange('availability', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Expected Salary (৳)</Label>
                  <Input
                    type="number"
                    value={formData.profile?.monthlySalary ?? 0}
                    onChange={(e) =>
                      handleProfileChange('monthlySalary', parseInt(e.target.value) || 0)
                    }
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>Subjects (comma separated)</Label>
                  <Input
                    value={formData.profile?.subjects?.join(', ') ?? ''}
                    onChange={(e) =>
                      handleProfileChange(
                        'subjects',
                        e.target.value
                          .split(',')
                          .map((s) => s.trim())
                          .filter(Boolean)
                      )
                    }
                  />
                </div>
              </>
            )}
          </div>

          <div className="flex justify-end gap-3 border-t border-border pt-5">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-pill font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="rounded-pill px-6 font-semibold shadow-glow"
            >
              {loading ? 'Saving...' : creating ? 'Create profile' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
