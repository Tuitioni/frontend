import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { TeacherDetail } from "@/types/teacher";
import { useAuth } from "@/hooks/useAuth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: TeacherDetail;
  onProfileUpdate: (updatedProfile: TeacherDetail) => void;
}

export function ProfileEditModal({
  isOpen,
  onClose,
  profile,
  onProfileUpdate,
}: ProfileEditModalProps) {
  const { makeAuthenticatedRequest } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState<TeacherDetail>(profile);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate loading state for form initialization
    if (isOpen) {
      setInitialLoading(true);
      const timer = setTimeout(() => {
        setFormData(profile);
        setInitialLoading(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isOpen, profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const originalProfile = JSON.parse(JSON.stringify(profile));
      const currentFormData = JSON.parse(JSON.stringify(formData));

      // Initialize changed fields object with correct type
      const changedFields: Partial<TeacherDetail> & {
        profile?: TeacherDetail["profile"];
      } = {};

      // Compare and collect only changed basic fields
      (Object.keys(currentFormData) as Array<keyof TeacherDetail>).forEach(
        (key) => {
          if (
            key !== "profile" &&
            JSON.stringify(originalProfile[key]) !==
              JSON.stringify(currentFormData[key])
          ) {
            changedFields[key] = currentFormData[key];
          }
        }
      );

      // Compare and collect only changed profile fields
      const changedProfileFields: Partial<TeacherDetail["profile"]> = {};
      if (currentFormData.profile && originalProfile.profile) {
        (
          Object.keys(currentFormData.profile) as Array<
            keyof TeacherDetail["profile"]
          >
        ).forEach((key) => {
          if (
            JSON.stringify(originalProfile.profile?.[key]) !==
            JSON.stringify(currentFormData.profile[key])
          ) {
            changedProfileFields[key] = currentFormData.profile![
              key
            ] as TeacherDetail["profile"][keyof TeacherDetail["profile"]];
          }
        });
      }

      // Only include profile in changedFields if there are actual changes
      if (Object.keys(changedProfileFields).length > 0 && profile.profile) {
        changedFields.profile = {
          ...profile.profile,
          ...changedProfileFields,
        } as TeacherDetail["profile"];
      }

      console.log("Changed fields to be sent:", changedFields);

      // Only make the request if there are changes
      if (Object.keys(changedFields).length > 0) {
        const response = await makeAuthenticatedRequest(
          `/api/teacher/${profile.id}`,
          {
            method: "PUT",
            data: changedFields,
          }
        );

        const updatedProfile = response as unknown as TeacherDetail;
        console.log("Update successful:", updatedProfile);
        onProfileUpdate(updatedProfile);

        toast({
          title: "Profile Updated",
          description: "Your profile has been successfully updated.",
          variant: "default",
        });

        onClose();
      } else {
        console.log("No changes detected");
        onClose();
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      setError(
        error instanceof Error ? error.message : "Failed to update profile"
      );

      toast({
        title: "Update Failed",
        description:
          error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    field: keyof Omit<TeacherDetail, "profile">,
    value: TeacherDetail[keyof Omit<TeacherDetail, "profile">]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleProfileChange = (
    field: keyof NonNullable<TeacherDetail["profile"]>,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      profile: {
        ...(prev.profile || {}),
        [field]: value,
      } as TeacherDetail["profile"],
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-md">{error}</div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Basic Information */}
            <div className="space-y-4">
              <div>
                <Label>First Name</Label>
                {initialLoading ? (
                  <Skeleton className="w-full h-10 mt-1" />
                ) : (
                  <Input
                    value={formData.firstName}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                  />
                )}
              </div>
              <div>
                <Label>Last Name</Label>
                {initialLoading ? (
                  <Skeleton className="w-full h-10 mt-1" />
                ) : (
                  <Input
                    value={formData.lastName}
                    onChange={(e) => handleChange("lastName", e.target.value)}
                  />
                )}
              </div>
              <div>
                <Label>Email</Label>
                {initialLoading ? (
                  <Skeleton className="w-full h-10 mt-1" />
                ) : (
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                )}
              </div>
              <div>
                <Label>Phone</Label>
                {initialLoading ? (
                  <Skeleton className="w-full h-10 mt-1" />
                ) : (
                  <Input
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                  />
                )}
              </div>
            </div>

            {/* Professional Information */}
            <div className="space-y-4">
              <div>
                <Label>Education</Label>
                {initialLoading ? (
                  <Skeleton className="w-full h-10 mt-1" />
                ) : (
                  <Input
                    value={formData.profile?.education ?? ""}
                    onChange={(e) =>
                      handleProfileChange("education", e.target.value)
                    }
                  />
                )}
              </div>
              <div>
                <Label>Experience (years)</Label>
                {initialLoading ? (
                  <Skeleton className="w-full h-10 mt-1" />
                ) : (
                  <Input
                    type="number"
                    value={formData.profile?.yearsOfExperience}
                    onChange={(e) =>
                      handleProfileChange(
                        "yearsOfExperience",
                        parseInt(e.target.value)
                      )
                    }
                  />
                )}
              </div>
              <div>
                <Label>Medium</Label>
                {initialLoading ? (
                  <Skeleton className="w-full h-10 mt-1" />
                ) : (
                  <Select
                    value={formData.profile?.medium}
                    onValueChange={(value) =>
                      handleProfileChange("medium", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ENGLISH_MEDIUM">
                        English Medium
                      </SelectItem>
                      <SelectItem value="BANGLA_MEDIUM">
                        Bangla Medium
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
              <div>
                <Label>Monthly Salary (₹)</Label>
                {initialLoading ? (
                  <Skeleton className="w-full h-10 mt-1" />
                ) : (
                  <Input
                    type="number"
                    value={formData.profile?.monthlySalary}
                    onChange={(e) =>
                      handleProfileChange(
                        "monthlySalary",
                        parseInt(e.target.value)
                      )
                    }
                  />
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={initialLoading || loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={initialLoading || loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
