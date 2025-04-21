"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { AuthMode } from "@/lib/types/auth";
import { useRouter } from "next/navigation";
import { tokenService } from "@/lib/auth/token";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

const AuthFormFields = ({
  mode,
  userType,
  formData,
  handleInputChange,
  districtsData,
  availableAreas,
  openDistrict,
  setOpenDistrict,
  openArea,
  setOpenArea,
  setFormData,
}: {
  mode: string;
  userType: string;
  formData: any;
  handleInputChange: any;
  districtsData: Array<{ district: string; areas: string[] }>;
  availableAreas: string[];
  openDistrict: boolean;
  setOpenDistrict: (open: boolean) => void;
  openArea: boolean;
  setOpenArea: (open: boolean) => void;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}) => (
  <div className="space-y-4">
    {mode === "register" && (
      <>
        <Input
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleInputChange}
          required
        />
        <Input
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleInputChange}
          required
        />
        <Input
          name="phone"
          type="tel"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleInputChange}
          required
        />

        <div className="space-y-1 sm:space-y-1.5 lg:space-y-2">
          <label htmlFor="district" className="text-sm font-medium">
            District
          </label>
          <Popover open={openDistrict} onOpenChange={setOpenDistrict}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openDistrict}
                className="w-full justify-between text-xs sm:text-sm lg:text-base h-8 sm:h-9 lg:h-10"
              >
                {formData.district === ""
                  ? "Select District"
                  : districtsData.find(
                      (d) => d.district.toLowerCase() === formData.district
                    )?.district || "Select District"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-full p-0 z-[9999]"
              align="start"
              side="bottom"
              sideOffset={5}
            >
              <Command>
                <CommandInput placeholder="Search district..." />
                <CommandEmpty>No district found.</CommandEmpty>
                <CommandGroup>
                  {districtsData.map((d) => (
                    <CommandItem
                      key={d.district}
                      value={d.district}
                      onSelect={(value) => {
                        setFormData((prev) => ({
                          ...prev,
                          district: d.district.toLowerCase(),
                          area: "",
                        }));
                        setOpenDistrict(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          formData.district === d.district.toLowerCase()
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {d.district}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-1 sm:space-y-1.5 lg:space-y-2">
          <label htmlFor="area" className="text-sm font-medium">
            Area
          </label>
          <Popover open={openArea} onOpenChange={setOpenArea}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openArea}
                className="w-full justify-between text-xs sm:text-sm lg:text-base h-8 sm:h-9 lg:h-10"
                disabled={!formData.district}
              >
                {formData.area === ""
                  ? formData.district !== ""
                    ? "Select Area"
                    : "Select District First"
                  : formData.area}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-full p-0 z-[9999]"
              align="start"
              side="bottom"
              sideOffset={5}
            >
              <Command>
                <CommandInput placeholder="Search area..." />
                <CommandEmpty>No area found.</CommandEmpty>
                <CommandGroup>
                  {availableAreas.map((areaItem) => (
                    <CommandItem
                      key={areaItem}
                      value={areaItem}
                      onSelect={(value) => {
                        setFormData((prev) => ({
                          ...prev,
                          area: areaItem.toLowerCase(),
                        }));
                        setOpenArea(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          formData.area === areaItem.toLowerCase()
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {areaItem}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </>
    )}

    <Input
      name={mode === "login" ? "username" : "email"}
      type={mode === "login" ? "text" : "email"}
      placeholder={mode === "login" ? "Username or Email" : "Email"}
      value={mode === "login" ? formData.username : formData.email}
      onChange={handleInputChange}
      required
    />

    <Input
      name="password"
      type="password"
      placeholder="Password"
      value={formData.password}
      onChange={handleInputChange}
      required
    />
  </div>
);

// Define form data interface for proper typing
interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  district: string;
  area: string;
  username: string;
}

export function AuthFormContainer({
  defaultMode = "login",
}: AuthFormContainerProps) {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">(defaultMode);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [userType, setUserType] = useState<"teacher" | "student">("teacher");
  const [openDistrict, setOpenDistrict] = useState(false);
  const [openArea, setOpenArea] = useState(false);

  // Update FormData state with proper typing
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    district: "",
    area: "",
    username: "",
  });

  // District and area data
  const [districtsData, setDistrictsData] = useState<
    Array<{ district: string; areas: string[] }>
  >([]);
  const [availableAreas, setAvailableAreas] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://gist.githubusercontent.com/sifatulrabbi/9c1ae990e905bf620af298b5a4489f68/raw/4d9596fc0e0e48c223dea79efe902f6478e70cfd/bd_districts_areas.json"
        );
        const data = await response.json();
        setDistrictsData(data);
      } catch (err) {
        console.error("Failed to fetch districts and areas:", err);
        setError("Failed to load districts and areas.");
      }
    };

    fetchData();
  }, []);

  // Update available areas when district changes
  useEffect(() => {
    if (formData.district && formData.district !== "") {
      const selectedDistrict = districtsData.find(
        (d) => d.district.toLowerCase() === formData.district
      );
      setAvailableAreas(selectedDistrict?.areas || []);
    } else {
      setAvailableAreas([]);
    }
  }, [formData.district, districtsData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRegister = async () => {
    try {
      setIsLoading(true);
      setError("");

      const endpoint =
        userType === "teacher"
          ? "/api/register/teacher"
          : "/api/register/student";
      const registerResponse = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          district: formData.district,
          area: formData.area,
        }),
      });

      if (!registerResponse.ok) {
        const errorData = await registerResponse.json();
        throw new Error(errorData.error || "Registration failed");
      }

      // Automatically login after registration
      await handleLogin();
    } catch (err) {
      console.error("Registration error:", err);
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      setError("");

      const endpoint = "/api/login/" + userType; // Adjusted endpoint for login
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username || formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();
      console.log("Login response:", data);

      if (data.access_token) {
        tokenService.setToken(data.access_token);
        const token = tokenService.getToken();
        console.log("Token stored:", token ? "Yes" : "No");

        // Redirect based on user type
        if (userType === "teacher") {
          router.push("/dashboard-teacher");
        } else {
          router.push("/dashboard-student");
        }
      } else {
        throw new Error("No access token received");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-8 p-6 shadow-lg rounded-lg">
      <div className="mb-4 flex space-x-4 justify-center">
        <Button
          variant={userType === "teacher" ? "defaultv2" : "outline"}
          onClick={() => setUserType("teacher")}
          className="w-1/2"
        >
          Teacher
        </Button>
        <Button
          variant={userType === "student" ? "defaultv2" : "outline"}
          onClick={() => setUserType("student")}
          className="w-1/2"
        >
          Student
        </Button>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          mode === "login" ? handleLogin() : handleRegister();
        }}
      >
        <AuthFormFields
          mode={mode}
          userType={userType}
          formData={formData}
          handleInputChange={handleInputChange}
          districtsData={districtsData}
          availableAreas={availableAreas}
          openDistrict={openDistrict}
          setOpenDistrict={setOpenDistrict}
          openArea={openArea}
          setOpenArea={setOpenArea}
          setFormData={setFormData}
        />

        {error && <div className="text-sm text-red-500 mt-2">{error}</div>}

        <Button type="submit" className="w-full mt-4" disabled={isLoading}>
          {isLoading
            ? "Please wait..."
            : mode === "login"
            ? "Login"
            : "Register"}
        </Button>
      </form>

      <div className="mt-4 text-center">
        {mode === "login" ? (
          <span>
            Dont have an account?{" "}
            <a href="/register" style={{ color: "#3B82F6" }}>
              Register here
            </a>
          </span>
        ) : (
          <span>
            Already have an account?{" "}
            <a href="/login" style={{ color: "#3B82F6" }}>
              Login here
            </a>
          </span>
        )}
      </div>
    </Card>
  );
}

interface AuthFormContainerProps {
  defaultMode?: AuthMode;
}
