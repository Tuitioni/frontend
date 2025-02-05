"use client";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Card } from "@/components/ui/card";

const TokenDisplayPage = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Retrieve the access token from cookies
    const accessToken = Cookies.get("access_token");
    setToken(accessToken || null);
  }, []);

  return (
    <Card className="w-full max-w-md mx-auto mt-8 p-6 shadow-lg rounded-lg">
      <h1 className="text-xl font-bold mb-4">Access Token</h1>
      {token ? (
        <div className="text-sm text-gray-700">
          <p>Your access token is:</p>
          <pre className="bg-gray-100 p-2 rounded">{token}</pre>
        </div>
      ) : (
        <p className="text-red-500">No access token found.</p>
      )}
    </Card>
  );
};

export default TokenDisplayPage;
