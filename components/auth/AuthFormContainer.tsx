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
}

const AuthFormFields = ({ mode, userType, formData, handleInputChange }: { mode: string, userType: string, formData: any, handleInputChange: any }) => (
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
  </div>
);

export function AuthFormContainer({ defaultMode = 'login' }: AuthFormContainerProps) {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [userType, setUserType] = useState<'teacher' | 'student'>('teacher');

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
      
      const endpoint = userType === 'teacher' ? "/api/register/teacher" : "/api/register/student";
      const registerResponse = await fetch(endpoint, {
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

      // Automatically login after registration
      await handleLogin();
    } catch (err) {
      console.error('Registration error:', err);
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
    <Card className="w-full max-w-md mx-auto mt-8 p-6 shadow-lg rounded-lg">
      <div className="mb-4 flex space-x-4 justify-center">
        <Button
          variant={userType === 'teacher' ? "default" : "outline"}
          onClick={() => setUserType('teacher')}
          className="w-1/2"
        >
          Teacher
        </Button>
        <Button
          variant={userType === 'student' ? "default" : "outline"}
          onClick={() => setUserType('student')}
          className="w-1/2"
        >
          Student
        </Button>
      </div>

      <form onSubmit={(e) => {
        e.preventDefault();
        mode === 'login' ? handleLogin() : handleRegister();
      }}>
        <AuthFormFields 
          mode={mode} 
          userType={userType} 
          formData={formData} 
          handleInputChange={handleInputChange} 
        />

        {error && (
          <div className="text-sm text-red-500 mt-2">{error}</div>
        )}

        <Button 
          type="submit" 
          className="w-full mt-4"
          disabled={isLoading}
        >
          {isLoading ? "Please wait..." : mode === 'login' ? "Login" : "Register"}
        </Button>
      </form>

      <div className="mt-4 text-center">
        {mode === 'login' ? (
          <span>
            Dont have an account? <a href="/register" className="text-blue-500">Register here</a>
          </span>
        ) : (
          <span>
            Already have an account? <a href="/login" className="text-blue-500">Login here</a>
          </span>
        )}
      </div>
    </Card>
  );
} 