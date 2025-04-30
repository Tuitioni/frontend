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
import {
  TeacherDetail,
  UpdateTeacherDto,
  UpdateTeacherProfileDto,
} from "@/types/teacher";
import { useAuth } from "@/hooks/useAuth";

import { useToast } from "@/components/ui/use-toast";
import { SearchableSelect } from "@/components/ui/searchable-select";

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
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<UpdateTeacherDto>({
    firstName: profile.firstName,
    lastName: profile.lastName,
    email: profile.email,
    phone: profile.phone,
    district: profile.district,
    area: profile.area,
    profile: {
      gender: profile.profile?.gender,
      age: profile.profile?.age,
      medium: profile.profile?.medium,
      education: profile.profile?.education,
      yearsOfExperience: profile.profile?.yearsOfExperience,
      subjects: profile.profile?.subjects || [],
      specialization: profile.profile?.specialization || undefined,
      teachingLevel: profile.profile?.teachingLevel,
      availability: profile.profile?.availability,
      monthlySalary: profile.profile?.monthlySalary,
    },
  });

  // Track original values to compare changes
  const [originalData] = useState<UpdateTeacherDto>({
    firstName: profile.firstName,
    lastName: profile.lastName,
    email: profile.email,
    phone: profile.phone,
    district: profile.district,
    area: profile.area,
    profile: {
      gender: profile.profile?.gender,
      age: profile.profile?.age,
      medium: profile.profile?.medium,
      education: profile.profile?.education,
      yearsOfExperience: profile.profile?.yearsOfExperience,
      subjects: profile.profile?.subjects || [],
      specialization: profile.profile?.specialization || undefined,
      teachingLevel: profile.profile?.teachingLevel,
      availability: profile.profile?.availability,
      monthlySalary: profile.profile?.monthlySalary,
    },
  });

  const [districtsData, setDistrictsData] = useState<
    Array<{ district: string; areas: string[] }>
  >([]);
  const [availableAreas, setAvailableAreas] = useState<string[]>([]);

  // Convert data for the searchable select component
  const districtOptions = districtsData.map((d) => ({
    value: d.district.toLowerCase(),
    label: d.district,
  }));

  const areaOptions = availableAreas.map((area) => ({
    value: area.toLowerCase(),
    label: area,
  }));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://gist.githubusercontent.com/sifatulrabbi/9c1ae990e905bf620af298b5a4489f68/raw/4d9596fc0e0e48c223dea79efe902f6478e70cfd/bd_districts_areas.json"
        );
        const data = await response.json();
        setDistrictsData(data);
      } catch (error) {
        console.error("Failed to fetch districts and areas:", error);
        toast({
          title: "Error",
          description: "Failed to load districts and areas.",
          variant: "destructive",
        });
      }
    };

    fetchData();
  }, [toast]);

  // Update available areas when district changes
  useEffect(() => {
    if (formData.district && formData.district !== "") {
      const district = districtsData.find(
        (d) => d.district.toLowerCase() === formData.district?.toLowerCase()
      );
      setAvailableAreas(district?.areas || []);
    } else {
      setAvailableAreas([]);
    }
  }, [formData.district, districtsData]);

  // Function to get only changed fields
  const getChangedFields = () => {
    const changes: UpdateTeacherDto = {};

    // Check root level fields
    if (formData.firstName !== originalData.firstName)
      changes.firstName = formData.firstName;
    if (formData.lastName !== originalData.lastName)
      changes.lastName = formData.lastName;
    if (formData.email !== originalData.email) changes.email = formData.email;
    if (formData.phone !== originalData.phone) changes.phone = formData.phone;
    if (formData.district !== originalData.district)
      changes.district = formData.district;
    if (formData.area !== originalData.area) changes.area = formData.area;

    // Check profile fields
    const profileChanges: UpdateTeacherProfileDto = {};
    if (formData.profile?.gender !== originalData.profile?.gender)
      profileChanges.gender = formData.profile?.gender;
    if (formData.profile?.age !== originalData.profile?.age)
      profileChanges.age = formData.profile?.age;
    if (formData.profile?.medium !== originalData.profile?.medium)
      profileChanges.medium = formData.profile?.medium;
    if (formData.profile?.education !== originalData.profile?.education)
      profileChanges.education = formData.profile?.education;
    if (
      formData.profile?.yearsOfExperience !==
      originalData.profile?.yearsOfExperience
    )
      profileChanges.yearsOfExperience = formData.profile?.yearsOfExperience;
    if (
      formData.profile?.subjects?.join(",") !==
      originalData.profile?.subjects?.join(",")
    )
      profileChanges.subjects = formData.profile?.subjects;
    if (
      formData.profile?.specialization !== originalData.profile?.specialization
    )
      profileChanges.specialization = formData.profile?.specialization;
    if (formData.profile?.teachingLevel !== originalData.profile?.teachingLevel)
      profileChanges.teachingLevel = formData.profile?.teachingLevel;
    if (formData.profile?.availability !== originalData.profile?.availability)
      profileChanges.availability = formData.profile?.availability;
    if (formData.profile?.monthlySalary !== originalData.profile?.monthlySalary)
      profileChanges.monthlySalary = formData.profile?.monthlySalary;

    // Only add profile if there are changes
    if (Object.keys(profileChanges).length > 0) {
      changes.profile = profileChanges;
    }

    return changes;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const changedFields = getChangedFields();

      // If no fields were changed, show a message and return
      if (Object.keys(changedFields).length === 0) {
        toast({
          title: "No changes",
          description: "No changes were made to the profile.",
        });
        onClose();
        return;
      }

      const response = await makeAuthenticatedRequest(
        `/api/teacher/${profile.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          data: changedFields,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Update failed with response:", errorData);
        throw new Error(errorData.message || "Failed to update profile");
      }

      const updatedProfile = await response.json();
      console.log("Update successful, received profile:", updatedProfile);

      onProfileUpdate(updatedProfile);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      onClose();
    } catch (error) {
      console.error("Profile update error:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="district">District</Label>
              <SearchableSelect
                options={districtOptions}
                value={formData.district?.toLowerCase() || ""}
                onChange={(value) =>
                  setFormData({ ...formData, district: value })
                }
                placeholder="Select district"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="area">Area</Label>
              <SearchableSelect
                options={areaOptions}
                value={formData.area?.toLowerCase() || ""}
                onChange={(value) => setFormData({ ...formData, area: value })}
                placeholder={
                  !formData.district ? "Select district first" : "Select area"
                }
                disabled={!formData.district || areaOptions.length === 0}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="education">Education</Label>
            <Input
              id="education"
              value={formData.profile?.education}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  profile: {
                    ...formData.profile,
                    education: e.target.value,
                  },
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="yearsOfExperience">Years of Experience</Label>
            <Input
              id="yearsOfExperience"
              type="number"
              value={formData.profile?.yearsOfExperience}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  profile: {
                    ...formData.profile,
                    yearsOfExperience: parseInt(e.target.value),
                  },
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="monthlySalary">Expected Monthly Salary</Label>
            <Input
              id="monthlySalary"
              type="number"
              value={formData.profile?.monthlySalary}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  profile: {
                    ...formData.profile,
                    monthlySalary: parseInt(e.target.value),
                  },
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="availability">Availability</Label>
            <Input
              id="availability"
              value={formData.profile?.availability}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  profile: {
                    ...formData.profile,
                    availability: e.target.value,
                  },
                })
              }
            />
          </div>

          <div className="flex justify-end gap-2 sticky bottom-0 bg-background pt-4 pb-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
