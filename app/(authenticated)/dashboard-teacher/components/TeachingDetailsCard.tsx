import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit2, GraduationCap, Briefcase, Clock, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface TeachingDetails {
  district: string;
  area: string;
  gender: string;
  age: number;
  education: string;
  yearsOfExperience: number;
  subjects: string[];
  specialization: string;
  teachingLevel: string;
  availability: string;
  monthlySalary: number;
  medium: string;
}

interface TeachingDetailsCardProps {
  details: TeachingDetails;
  teacherId: string;
  onUpdate?: (updatedDetails: TeachingDetails) => void;
}

export function TeachingDetailsCard({
  details,
  teacherId,
  onUpdate,
}: TeachingDetailsCardProps) {
  const { makeAuthenticatedRequest } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedDetails, setEditedDetails] = useState<TeachingDetails>(details);

  const handleInputChange = (
    field: keyof TeachingDetails,
    value: string | number | string[]
  ) => {
    setEditedDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const createTeacherProfile = async () => {
    try {
      const response = await makeAuthenticatedRequest("/api/teacher-profile", {
        method: "POST",
        data: {
          ...editedDetails,
          teacherId,
        },
      });

      const responseData = await response.json();
      console.log(responseData);

      if (response.ok) {
        toast({
          title: "Success",
          description: "Teacher profile created successfully",
        });
        setIsEditing(false);
        if (onUpdate) {
          onUpdate(editedDetails);
        }
      } else {
        throw new Error(
          responseData.message || "Failed to create teacher profile"
        );
      }
    } catch (error) {
      console.error("Error creating teacher profile:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to create teacher profile",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg sm:text-xl">Teaching Details</CardTitle>
          <div className="flex gap-2">
            {isEditing ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={createTeacherProfile}
              >
                <Save className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditing(true)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <GraduationCap className="h-4 w-4 text-gray-500" />
                <h3 className="font-medium text-sm sm:text-base">Education</h3>
              </div>
              {isEditing ? (
                <Input
                  value={editedDetails.education}
                  onChange={(e) =>
                    handleInputChange("education", e.target.value)
                  }
                  className="text-sm sm:text-base"
                />
              ) : (
                <p className="text-sm sm:text-base">{details.education}</p>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="h-4 w-4 text-gray-500" />
                <h3 className="font-medium text-sm sm:text-base">Experience</h3>
              </div>
              {isEditing ? (
                <Input
                  type="number"
                  value={editedDetails.yearsOfExperience}
                  onChange={(e) =>
                    handleInputChange(
                      "yearsOfExperience",
                      parseInt(e.target.value)
                    )
                  }
                  className="text-sm sm:text-base"
                />
              ) : (
                <p className="text-sm sm:text-base">
                  {details.yearsOfExperience} years
                </p>
              )}
            </div>
            <div>
              <h3 className="font-medium text-sm sm:text-base mb-2">
                Location
              </h3>
              <div className="space-y-2">
                {isEditing ? (
                  <>
                    <Input
                      value={editedDetails.district}
                      onChange={(e) =>
                        handleInputChange("district", e.target.value)
                      }
                      placeholder="District"
                      className="text-sm sm:text-base"
                    />
                    <Input
                      value={editedDetails.area}
                      onChange={(e) =>
                        handleInputChange("area", e.target.value)
                      }
                      placeholder="Area"
                      className="text-sm sm:text-base"
                    />
                  </>
                ) : (
                  <p className="text-sm sm:text-base">
                    {details.district}, {details.area}
                  </p>
                )}
              </div>
            </div>
            <div>
              <h3 className="font-medium text-sm sm:text-base mb-2">
                Personal Info
              </h3>
              <div className="space-y-2">
                {isEditing ? (
                  <>
                    <Input
                      value={editedDetails.gender}
                      onChange={(e) =>
                        handleInputChange("gender", e.target.value)
                      }
                      placeholder="Gender"
                      className="text-sm sm:text-base"
                    />
                    <Input
                      type="number"
                      value={editedDetails.age}
                      onChange={(e) =>
                        handleInputChange("age", parseInt(e.target.value))
                      }
                      placeholder="Age"
                      className="text-sm sm:text-base"
                    />
                  </>
                ) : (
                  <p className="text-sm sm:text-base">
                    {details.gender}, {details.age} years
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-sm sm:text-base mb-2">
                Subjects
              </h3>
              {isEditing ? (
                <Input
                  value={editedDetails.subjects.join(", ")}
                  onChange={(e) =>
                    handleInputChange(
                      "subjects",
                      e.target.value.split(",").map((s) => s.trim())
                    )
                  }
                  placeholder="Enter subjects separated by commas"
                  className="text-sm sm:text-base"
                />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {details.subjects.map((subject, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary/10 rounded-full text-sm sm:text-base"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <h3 className="font-medium text-sm sm:text-base">
                  Availability
                </h3>
              </div>
              {isEditing ? (
                <Input
                  value={editedDetails.availability}
                  onChange={(e) =>
                    handleInputChange("availability", e.target.value)
                  }
                  className="text-sm sm:text-base"
                />
              ) : (
                <p className="text-sm sm:text-base">{details.availability}</p>
              )}
            </div>
            <div>
              <h3 className="font-medium text-sm sm:text-base mb-2">
                Specialization
              </h3>
              {isEditing ? (
                <Input
                  value={editedDetails.specialization}
                  onChange={(e) =>
                    handleInputChange("specialization", e.target.value)
                  }
                  className="text-sm sm:text-base"
                />
              ) : (
                <p className="text-sm sm:text-base">{details.specialization}</p>
              )}
            </div>
            <div>
              <h3 className="font-medium text-sm sm:text-base mb-2">
                Teaching Level
              </h3>
              {isEditing ? (
                <Input
                  value={editedDetails.teachingLevel}
                  onChange={(e) =>
                    handleInputChange("teachingLevel", e.target.value)
                  }
                  className="text-sm sm:text-base"
                />
              ) : (
                <p className="text-sm sm:text-base">{details.teachingLevel}</p>
              )}
            </div>
            <div>
              <h3 className="font-medium text-sm sm:text-base mb-2">Medium</h3>
              {isEditing ? (
                <Input
                  value={editedDetails.medium}
                  onChange={(e) => handleInputChange("medium", e.target.value)}
                  className="text-sm sm:text-base"
                />
              ) : (
                <p className="text-sm sm:text-base">
                  {details.medium.replace("_", " ")}
                </p>
              )}
            </div>
            <div>
              <h3 className="font-medium text-sm sm:text-base mb-2">
                Expected Salary
              </h3>
              {isEditing ? (
                <Input
                  type="number"
                  value={editedDetails.monthlySalary}
                  onChange={(e) =>
                    handleInputChange("monthlySalary", parseInt(e.target.value))
                  }
                  className="text-sm sm:text-base"
                />
              ) : (
                <p className="text-sm sm:text-base">
                  ₹{details.monthlySalary.toLocaleString()}/month
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
