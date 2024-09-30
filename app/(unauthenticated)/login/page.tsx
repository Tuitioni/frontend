"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";

export default function Page() {
  const [activeButton, setActiveButton] = useState("login"); 

  return (
    <div className="p-6 w-2/3 mx-auto">
      <div className="mb-4 flex space-x-4 justify-center">
        {activeButton === "login" ? (
          <Button
            className="border border-yellow bg-gradient-to-r from-yellow via-red to-pink"
            variant="default"
          >
            Login
          </Button>
        ) : (
          <Button
            className="border border-yellow hover:bg-gradient-to-r hover:from-yellow hover:via-red hover:to-pink"
            variant="default"
            onClick={() => setActiveButton("login")}
          >
            Login
          </Button>
        )}
        {activeButton === "register" ? (
          <Button
            className="border border-yellow bg-gradient-to-r from-yellow via-red to-pink"
            variant="default"
          >
            Register
          </Button>
        ) : (
          <Button
            className="border border-yellow hover:bg-gradient-to-r hover:from-yellow hover:via-red hover:to-pink"
            variant="default"
            onClick={() => setActiveButton("register")}
          >
            Register
          </Button>
        )}
      </div>
      {activeButton === "login" && (
        <div className="mb-4">
          <Input
            type="text"
            placeholder="Username"
            className="mb-2"
            onFocus={() => setActiveButton("login")}
          />
          <Input
            type="password"
            placeholder="Password"
            onFocus={() => setActiveButton("login")}
          />
        </div>
      )}
      {activeButton === "register" && (
        <div className="mb-4">
          <Input
            type="text"
            placeholder="Username"
            className="mb-2"
            onFocus={() => setActiveButton("register")}
          />
          <Input
            type="email"
            placeholder="Email"
            className="mb-2"
            onFocus={() => setActiveButton("register")}
          />
          <Input
            type="password"
            placeholder="Password"
            onFocus={() => setActiveButton("register")}
          />
        </div>
      )}
      <div className="mt-4">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga voluptatum
        quod amet numquam obcaecati eos earum illum deleniti!
      </div>
    </div>
  );
}
