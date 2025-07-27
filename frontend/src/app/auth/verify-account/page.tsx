"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { authApi } from "@/lib/api";

export default function VerifyAccountPage() {
  const [formData, setFormData] = useState({
    sessionId: "",
    token: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  // Pre-fill sessionId from URL if available
  useState(() => {
    const urlSessionId = searchParams.get("token");
    if (urlSessionId) {
      setFormData(prev => ({ ...prev, sessionId: urlSessionId }));
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const data = await authApi.verifyAccount(formData);
      setMessage(data.message);
      // Redirect to login page after successful verification
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted to-background p-4">
      <Card className="w-full max-w-md backdrop-blur-sm">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Verify Your Account</CardTitle>
          <CardDescription>
            Enter the verification code sent to your email
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sessionId">Session ID</Label>
              <Input
                id="sessionId"
                name="sessionId"
                type="text"
                placeholder="Enter session ID from email link"
                value={formData.sessionId}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="token">Verification Code</Label>
              <Input
                id="token"
                name="token"
                type="text"
                placeholder="Enter 6-digit verification code"
                value={formData.token}
                onChange={handleChange}
                required
                maxLength={6}
                className="text-center text-lg tracking-widest font-mono"
              />
            </div>
            
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {message && (
              <Alert className="bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400">
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Verifying..." : "Verify Account"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center text-sm text-muted-foreground">
          Need help?{" "}
          <Link 
            href="/auth/register" 
            className="text-primary hover:text-primary/80 transition-colors"
          >
            Register again
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
