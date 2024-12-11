"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";

export default function Page() {
  const [activeButton, setActiveButton] = useState("login");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    try {
      const response = await fetch("/api/register/student", {
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
          location,
        }),
      });

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      const data = await response.json();
      console.log("Registration success:", data);
    } catch (error: any) {
      setError(error.message);
      console.error("Registration error:", error);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await fetch("/api/login/student", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: loginUsername,
          password: loginPassword,
        }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      console.log("Login success:", data);
    } catch (error: any) {
      setError(error.message);
      console.error("Login error:", error);
    }
  };

  return (
    <div className="p-6 w-2/3 mx-auto">
      <div className="mb-4 flex space-x-4 justify-center">
        <Button
          className={`border border-yellow ${
            activeButton === "login"
              ? "bg-gradient-to-r from-yellow via-red to-pink"
              : "hover:bg-gradient-to-r hover:from-yellow hover:via-red hover:to-pink"
          }`}
          variant="default"
          onClick={() => setActiveButton("login")}
        >
          Login
        </Button>
        <Button
          className={`border border-yellow ${
            activeButton === "register"
              ? "bg-gradient-to-r from-yellow via-red to-pink"
              : "hover:bg-gradient-to-r hover:from-yellow hover:via-red hover:to-pink"
          }`}
          variant="default"
          onClick={() => setActiveButton("register")}
        >
          Register
        </Button>
      </div>

      {activeButton === "login" && (
        <div className="mb-4">
          <Input
            type="text"
            placeholder="Username or Email"
            className="mb-2"
            value={loginUsername}
            onChange={(e) => setLoginUsername(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
          />
          <Button onClick={handleLogin} className="mt-2">
            Login
          </Button>
          {error && <div className="text-red-500 mt-2">{error}</div>}
        </div>
      )}

      {activeButton === "register" && (
        <div className="mb-4">
          <Input
            type="text"
            placeholder="First Name"
            className="mb-2"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Last Name"
            className="mb-2"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <Input
            type="email"
            placeholder="Email"
            className="mb-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            className="mb-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            type="tel"
            placeholder="Phone"
            className="mb-2"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Location"
            className="mb-2"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <Button onClick={handleRegister} className="mt-2">
            Register
          </Button>
          {error && <div className="text-red-500 mt-2">{error}</div>}
        </div>
      )}

      <div className="mt-4">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga voluptatum
        quod amet numquam obcaecati eos earum illum deleniti!
      </div>
    </div>
  );
}
