import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useToken } from "@/hooks/useToken";
import { tokenService } from "@/lib/auth/token";

interface HireModalProps {
  isOpen: boolean;
  onClose: () => void;
  tutorName: string;
  tutorId: string;
}

export default function HireModal({
  isOpen,
  onClose,
  tutorName,
  tutorId,
}: HireModalProps) {
  const { makeAuthenticatedRequest, isAuthenticated } = useAuth();
  const decodedToken = useToken();
  const isStudent = decodedToken?.role === "student";
  const studentId = decodedToken?.sub;

  const [fee, setFee] = useState(10000);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedArea, setSelectedArea] = useState("");

  const [districts, setDistricts] = useState<string[]>([]);
  const [areas, setAreas] = useState<{ [key: string]: string[] }>({});
  const [availableAreas, setAvailableAreas] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://gist.githubusercontent.com/sifatulrabbi/9c1ae990e905bf620af298b5a4489f68/raw/4d9596fc0e0e48c223dea79efe902f6478e70cfd/bd_districts_areas.json"
        );
        const data = await response.json();

        const districtList = data.map((item: any) => item.district);
        const areaMap: { [key: string]: string[] } = {};
        data.forEach((item: any) => {
          // Ensure areas are deduplicated to avoid key warnings
          areaMap[item.district] = Array.from(new Set(item.areas));
        });

        setDistricts(districtList);
        setAreas(areaMap);
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
    if (selectedDistrict && areas[selectedDistrict]) {
      setAvailableAreas(areas[selectedDistrict]);
      setSelectedArea("");
    } else {
      setAvailableAreas([]);
    }
  }, [selectedDistrict, areas]);

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDistrict(e.target.value);
  };

  const handleAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedArea(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isAuthenticated && isStudent) {
        const hireResponse = await makeAuthenticatedRequest("/api/hire", {
          method: "POST",
          data: {
            teacherId: tutorId,
            studentId,
            fee,
            district: selectedDistrict,
            area: selectedArea,
          },
        });

        if (!hireResponse.ok) {
          throw new Error("Failed to hire tutor");
        }

        toast({
          title: "Success!",
          description: "You have successfully hired the tutor.",
        });
      } else {
        const registerResponse = await fetch("/api/register/student", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName,
            lastName,
            email,
            password,
            phone,
            district: selectedDistrict,
            area: selectedArea,
          }),
        });

        if (!registerResponse.ok) {
          throw new Error("Failed to register student");
        }

        const registerData = await registerResponse.json();
        const studentId = registerData.id;
        console.log(studentId);

        const loginResponse = await fetch("/api/login/student", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: email,
            password,
          }),
        });

        const loginData = await loginResponse.json();

        if (loginData.access_token) {
          tokenService.setToken(loginData.access_token);
          const token = tokenService.getToken();
          console.log("Token stored:", token ? "Yes" : "No");
        } else {
          throw new Error("No access token received");
        }

        if (!loginResponse.ok) {
          throw new Error("Failed to login student");
        }

        const token = tokenService.getToken();
        const hireResponse = await fetch("/api/hire", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            teacherId: tutorId,
            studentId,
            fee,
            district: selectedDistrict,
            area: selectedArea,
          }),
        });

        if (!hireResponse.ok) {
          throw new Error("Failed to hire tutor");
        }

        toast({
          title: "Success!",
          description:
            "Your account has been created, logged in, and the tutor has been hired.",
        });
      }
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-6 max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Hire {tutorName}</DialogTitle>
          <DialogDescription>
            {isAuthenticated && isStudent
              ? "Please enter your proposed fee to hire the tutor."
              : "Fill in your details below. This will automatically create an account for you and hire the tutor."}
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 max-h-[70vh] overflow-y-auto px-1"
        >
          {!isAuthenticated || !isStudent ? (
            <>
              <div className="space-y-2">
                <label htmlFor="firstName" className="text-sm font-medium">
                  First Name
                </label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Enter your first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="lastName" className="text-sm font-medium">
                  Last Name
                </label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Enter your last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
              <div className="col-span-1 sm:col-span-2">
                <div className="space-y-2">
                  <label htmlFor="district" className="text-sm font-medium">
                    District
                  </label>
                  <select
                    id="district"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={selectedDistrict}
                    onChange={handleDistrictChange}
                    required
                  >
                    <option value="">Select District</option>
                    {districts.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2 mt-2">
                  <label htmlFor="area" className="text-sm font-medium">
                    Area
                  </label>
                  <select
                    id="area"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={selectedArea}
                    onChange={handleAreaChange}
                    disabled={!selectedDistrict}
                    required
                  >
                    <option value="">Select Area</option>
                    {availableAreas.map((areaItem, index) => (
                      <option
                        key={`${selectedDistrict}-${areaItem}-${index}`}
                        value={areaItem}
                      >
                        {areaItem}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">
                  Phone Number
                </label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </>
          ) : (
            <div className="space-y-2 col-span-1 sm:col-span-2">
              <label htmlFor="fee" className="text-sm font-medium">
                Proposed Fee
              </label>
              <Input
                id="fee"
                type="number"
                placeholder="Enter the proposed fee"
                value={fee}
                onChange={(e) => setFee(Number(e.target.value))}
                required
              />
            </div>
          )}
          <Button
            type="submit"
            className="col-span-1 sm:col-span-2 w-full"
            disabled={loading}
          >
            {loading ? "Processing..." : "Hire Tutor"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
