"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { AuthMode } from "@/lib/types/auth";
import { useRouter } from "next/navigation";
import { tokenService } from "@/lib/auth/token";
import { jwtDecode } from "jwt-decode";

import DistrictAreaSelector from "@/app/(unauthenticated)/jobs/components/DistrictAreaSelector";

interface AuthFormContainerProps {
  defaultMode?: AuthMode;
}

const AuthFormFields = ({
  mode,
  formData,
  handleInputChange,
  selectedDistrict,
  setSelectedDistrict,
  selectedArea,
  setSelectedArea,
}: {
  mode: string;
  userType: string;
  formData: any;
  handleInputChange: any;
  selectedDistrict: string;
  setSelectedDistrict: (district: string) => void;
  selectedArea: string;
  setSelectedArea: (area: string) => void;
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

        <DistrictAreaSelector
          onDistrictChange={(district) => {
            setSelectedDistrict(district);
            setFormData((prev) => ({ ...prev, district }));
          }}
          onAreaChange={(area) => {
            setSelectedArea(area);
            setFormData((prev) => ({ ...prev, area }));
          }}
          selectedDistrict={selectedDistrict}
          selectedArea={selectedArea}
        />
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

export function AuthFormContainer({
  defaultMode = "login",
}: AuthFormContainerProps) {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">(defaultMode);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [userType, setUserType] = useState<"teacher" | "student">("teacher");

  // Form states
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    district: "",
    area: "",
    username: "",
  });

  // Remove districts state since it's handled by DistrictAreaSelector
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedArea, setSelectedArea] = useState<string>("");

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
          district: selectedDistrict,
          area: selectedArea,
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
          selectedDistrict={selectedDistrict}
          setSelectedDistrict={setSelectedDistrict}
          selectedArea={selectedArea}
          setSelectedArea={setSelectedArea}
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
