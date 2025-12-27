"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/auth";
import { Card } from "@/components/ui/card";

export default function DebugAuthPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [cookies, setCookies] = useState<string>("");
  const [localStorage, setLocalStorage] = useState<Record<string, string>>({});

  useEffect(() => {
    // Get all cookies
    setCookies(document.cookie);
    
    // Get localStorage
    const storage: Record<string, string> = {};
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (key) {
        storage[key] = window.localStorage.getItem(key) || "";
      }
    }
    setLocalStorage(storage);
  }, []);

  const parseCookies = () => {
    const cookieObj: Record<string, string> = {};
    cookies.split(';').forEach(cookie => {
      const [key, value] = cookie.trim().split('=');
      if (key) cookieObj[key] = value || '';
    });
    return cookieObj;
  };

  return (
    <div className="container mx-auto p-8 space-y-6">
      <h1 className="text-3xl font-bold">Authentication Debug Page</h1>
      
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Auth State (from Redux)</h2>
        <div className="space-y-2 font-mono text-sm">
          <div><strong>Loading:</strong> {isLoading ? "Yes" : "No"}</div>
          <div><strong>Authenticated:</strong> {isAuthenticated ? "Yes" : "No"}</div>
          <div><strong>User:</strong> {user ? JSON.stringify(user, null, 2) : "null"}</div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Cookies</h2>
        <div className="space-y-2 font-mono text-sm">
          {Object.entries(parseCookies()).map(([key, value]) => (
            <div key={key}>
              <strong>{key}:</strong> {value}
            </div>
          ))}
          {Object.keys(parseCookies()).length === 0 && (
            <div className="text-muted-foreground">No cookies found</div>
          )}
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">LocalStorage</h2>
        <div className="space-y-2 font-mono text-sm">
          {Object.entries(localStorage).map(([key, value]) => (
            <div key={key}>
              <strong>{key}:</strong> {value.substring(0, 50)}{value.length > 50 ? "..." : ""}
            </div>
          ))}
          {Object.keys(localStorage).length === 0 && (
            <div className="text-muted-foreground">No localStorage items found</div>
          )}
        </div>
      </Card>

      <Card className="p-6 bg-yellow-50 dark:bg-yellow-950">
        <h2 className="text-xl font-semibold mb-4">Expected State for Admin</h2>
        <div className="space-y-2 font-mono text-sm">
          <div><strong>Cookie &quot;auth&quot;:</strong> Should be &quot;1&quot;</div>
          <div><strong>Cookie &quot;role&quot;:</strong> Should be &quot;ADMIN&quot;</div>
          <div><strong>LocalStorage &quot;accessToken&quot;:</strong> Should exist</div>
          <div><strong>LocalStorage &quot;refreshToken&quot;:</strong> Should exist</div>
          <div><strong>User object role:</strong> Should be &quot;ADMIN&quot;</div>
        </div>
      </Card>
    </div>
  );
}
