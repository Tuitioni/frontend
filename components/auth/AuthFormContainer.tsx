"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { AuthMode } from "@/lib/types/auth";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { tokenService } from '@/lib/auth/token';
import axiosInstance from '@/lib/axios';
import { jwtDecode } from "jwt-decode";

interface AuthFormContainerProps {
  defaultMode?: AuthMode;
}

interface TokenPayload {
  sub: string;
  // add other token payload properties if needed
}

export function AuthFormContainer({ defaultMode = 'login' }: AuthFormContainerProps) {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>(defaultMode);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Form states
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    location: "",
    username: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const createTeacherProfile = async (token: string) => {
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      const teacherId = decoded.sub;

      const profileData = {
        district: "Not Specified",
        area: "Not Specified",
        gender: "MALE",
        age: 25,
        medium: "ENGLISH_MEDIUM",
        education: "Not Specified",
        yearsOfExperience: 0,
        subjects: ["Not Specified"],
        specialization: "Not Specified",
        teachingLevel: "Not Specified",
        availability: "Not Specified",
        monthlySalary: 0,
        teacherId: teacherId
      };

      const response = await fetch("/api/teacher-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new Error("Failed to create teacher profile");
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating teacher profile:", error);
      throw error;
    }
  };

  const handleRegister = async () => {
    try {
      setIsLoading(true);
      setError("");
      
      // 1. Register the user
      const registerResponse = await fetch("/api/register/teacher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          location: formData.location,
        }),
      });

      if (!registerResponse.ok) {
        const errorData = await registerResponse.json();
        throw new Error(errorData.error || "Registration failed");
      }

      // 2. Automatically login after registration
      const loginResponse = await fetch("/api/login/teacher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.email, // Use email as username
          password: formData.password,
        }),
      });

      if (!loginResponse.ok) {
        throw new Error("Auto-login failed after registration");
      }

      const loginData = await loginResponse.json();
      
      if (!loginData.access_token) {
        throw new Error("No access token received");
      }

      // 3. Store the token
      tokenService.setToken(loginData.access_token);

      // 4. Create teacher profile
      await createTeacherProfile(loginData.access_token);

      // 5. Redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      console.error('Registration/Login error:', err);
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await fetch("/api/login/teacher", {
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
      console.log('Login response:', data);

      if (data.access_token) {
        tokenService.setToken(data.access_token);
        const token = tokenService.getToken();
        console.log('Token stored:', token ? 'Yes' : 'No');
        router.push('/dashboard');
      } else {
        throw new Error('No access token received');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-8 p-6">
      <div className="mb-6 flex space-x-4 justify-center">
        <Button
          variant={mode === 'login' ? "default" : "outline"}
          onClick={() => setMode('login')}
          className="w-1/2"
        >
          Login
        </Button>
        <Button
          variant={mode === 'register' ? "default" : "outline"}
          onClick={() => setMode('register')}
          className="w-1/2"
        >
          Register
        </Button>
      </div>

      <form onSubmit={(e) => {
        e.preventDefault();
        mode === 'login' ? handleLogin() : handleRegister();
      }}>
        <div className="space-y-4">
          {mode === 'register' && (
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
              <Input
                name="location"
                placeholder="Location"
                value={formData.location}
                onChange={handleInputChange}
                required
              />
            </>
          )}

          <Input
            name={mode === 'login' ? "username" : "email"}
            type={mode === 'login' ? "text" : "email"}
            placeholder={mode === 'login' ? "Username or Email" : "Email"}
            value={mode === 'login' ? formData.username : formData.email}
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

          {error && (
            <div className="text-sm text-red-500 mt-2">{error}</div>
          )}

          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Please wait..." : mode === 'login' ? "Login" : "Register"}
          </Button>
        </div>
      </form>
    </Card>
  );
} 