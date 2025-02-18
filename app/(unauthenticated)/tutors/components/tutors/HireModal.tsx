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
import DistrictAreaSelector, {
  DistrictData,
} from "@/app/(unauthenticated)/jobs/components/DistrictAreaSelector";

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
  const { makeAuthenticatedRequest } = useAuth();
  const decodedToken = useToken();
  const studentId = decodedToken?.sub;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [fee, setFee] = useState(10000);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedArea, setSelectedArea] = useState<string>("");

  const handleDistrictChange = (district: string) => {
    setSelectedDistrict(district);
  };

  const handleAreaChange = (area: string) => {
    setSelectedArea(area);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
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
            Fill in your details below. This will automatically create an
            account for you and hire the tutor.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 max-h-[70vh] overflow-y-auto px-1"
        >
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
            <DistrictAreaSelector
              onDistrictChange={handleDistrictChange}
              onAreaChange={handleAreaChange}
              selectedDistrict={selectedDistrict}
              selectedArea={selectedArea}
            />
          </div>
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
