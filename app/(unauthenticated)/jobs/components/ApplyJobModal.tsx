import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useToken } from "@/hooks/useToken";
import { tokenService } from "@/lib/auth/token";

interface ApplyJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle: string;
  id: string;
}

export default function ApplyJobModal({
  isOpen,
  onClose,
  jobTitle,
  id,
}: ApplyJobModalProps) {
  const { makeAuthenticatedRequest } = useAuth();
  const decodedToken = useToken();
  const studentId = decodedToken?.sub;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [district, setDistrict] = useState("");
  const [area, setArea] = useState("");
  const [expectedSalary, setExpectedSalary] = useState(10000);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const registerResponse = await fetch("/api/register/teacher", {
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
          district,
          area,
        }),
      });

      if (!registerResponse.ok) {
        throw new Error("Failed to register teacher");
      }

      const registerData = await registerResponse.json();
      const teacherId = registerData.id;

      const loginResponse = await fetch("/api/login/teacher", {
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
      } else {
        throw new Error("No access token received");
      }

      if (!loginResponse.ok) {
        throw new Error("Failed to login teacher");
      }

      const token = tokenService.getToken();
      const applyResponse = await fetch("/api/job", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          teacherId,
          postId: id,
          expected_salary: expectedSalary,
          district,
          area,
        }),
      });

      if (!applyResponse.ok) {
        throw new Error("Failed to apply for job");
      }

      toast({
        title: "Success!",
        description:
          "Your account has been created, logged in, and the job application has been submitted.",
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
          <DialogTitle>Apply for {jobTitle}</DialogTitle>
          <DialogDescription>
            Fill in your details below to apply for the job.
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
          <div className="space-y-2">
            <label htmlFor="district" className="text-sm font-medium">
              District
            </label>
            <Input
              id="district"
              type="text"
              placeholder="Enter your district"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="area" className="text-sm font-medium">
              Area
            </label>
            <Input
              id="area"
              type="text"
              placeholder="Enter your area"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2 col-span-1 sm:col-span-2">
            <label htmlFor="expectedSalary" className="text-sm font-medium">
              Expected Salary
            </label>
            <Input
              id="expectedSalary"
              type="number"
              placeholder="Enter your expected salary"
              value={expectedSalary}
              onChange={(e) => setExpectedSalary(Number(e.target.value))}
              required
            />
          </div>
          <Button
            type="submit"
            className="col-span-1 sm:col-span-2 w-full"
            disabled={loading}
          >
            {loading ? "Processing..." : "Apply for Job"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
