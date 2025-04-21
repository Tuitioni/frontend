import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef, ChangeEvent, MouseEvent } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useToken } from "@/hooks/useToken";
import { tokenService } from "@/lib/auth/token";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { ChevronDown } from "lucide-react";

// Define types for our component
interface SelectOption {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
  required?: boolean;
}

// Custom searchable select component
const SearchableSelect = ({
  options,
  value,
  onChange,
  placeholder,
  disabled = false,
  required = false,
}: SearchableSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [displayValue, setDisplayValue] = useState("");
  const inputRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter options based on search term
  const filteredOptions = options.filter((option: SelectOption) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Update display value when selected value changes
  useEffect(() => {
    const selected = options.find(
      (option: SelectOption) => option.value === value
    );
    setDisplayValue(selected ? selected.label : "");
    setSearchTerm("");
  }, [value, options]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | any) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
        // Restore display value
        const selected = options.find(
          (option: SelectOption) => option.value === value
        );
        setDisplayValue(selected ? selected.label : "");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [value, options]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setDisplayValue(e.target.value);
    setIsOpen(true);
  };

  const handleOptionClick = (optionValue: string, optionLabel: string) => {
    onChange(optionValue);
    setDisplayValue(optionLabel);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="relative">
      <div
        className={`flex items-center relative ${
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        }`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        ref={inputRef}
      >
        <input
          type="text"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder={placeholder}
          value={displayValue}
          onChange={handleInputChange}
          onClick={(e) => e.stopPropagation()}
          disabled={disabled}
          onFocus={() => !disabled && setIsOpen(true)}
          required={required}
          autoComplete="off"
        />
        <ChevronDown className="absolute right-3 h-4 w-4 opacity-50" />
      </div>
      {isOpen && !disabled && (
        <div
          ref={dropdownRef}
          className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-popover py-1 text-popover-foreground shadow-md"
        >
          {filteredOptions.length === 0 ? (
            <div className="px-2 py-1.5 text-sm text-muted-foreground">
              No options found
            </div>
          ) : (
            filteredOptions.map((option: SelectOption) => (
              <div
                key={option.value}
                className={`px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer ${
                  option.value === value
                    ? "bg-accent text-accent-foreground"
                    : ""
                }`}
                onClick={() => handleOptionClick(option.value, option.label)}
              >
                {option.label}
              </div>
            ))
          )}
        </div>
      )}
      <input type="hidden" value={value || ""} />
    </div>
  );
};

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
  const { makeAuthenticatedRequest, isAuthenticated } = useAuth();
  const decodedToken = useToken();
  const isTeacher = decodedToken?.role === "teacher";
  const teacherId = decodedToken?.sub;

  const [expectedSalary, setExpectedSalary] = useState(10000);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [district, setDistrict] = useState("");
  const [area, setArea] = useState("");

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
    if (district && district !== "") {
      const selectedDistrict = districtsData.find(
        (d) => d.district.toLowerCase() === district.toLowerCase()
      );
      setAvailableAreas(selectedDistrict?.areas || []);
    } else {
      setAvailableAreas([]);
    }
    setArea(""); // Reset area when district changes
  }, [district, districtsData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isAuthenticated && isTeacher) {
        const applyResponse = await makeAuthenticatedRequest("/api/job", {
          method: "POST",
          data: {
            teacherId,
            postId: id,
            expected_salary: expectedSalary,
          },
        });

        if (!applyResponse.ok) {
          throw new Error("Failed to apply for job");
        }

        toast({
          title: "Success!",
          description: "Your job application has been submitted.",
        });
      } else {
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
      }
      window.location.reload();
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
            {isAuthenticated && isTeacher
              ? "Please enter your expected salary to apply."
              : "Fill in your details below to apply for the job."}
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 max-h-[70vh] overflow-y-auto px-1"
        >
          {!isAuthenticated || !isTeacher ? (
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
                  <Label htmlFor="district">District</Label>
                  <SearchableSelect
                    options={districtOptions}
                    value={district}
                    onChange={setDistrict}
                    placeholder="Select district"
                    required={true}
                  />
                </div>
                <div className="space-y-2 mt-2">
                  <Label htmlFor="area">Area</Label>
                  <SearchableSelect
                    options={areaOptions}
                    value={area}
                    onChange={setArea}
                    placeholder={
                      !district ? "Select district first" : "Select area"
                    }
                    disabled={!district || areaOptions.length === 0}
                    required={true}
                  />
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
          )}
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
