"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { authApi } from "@/lib/api";

export default function OTPPage() {
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6); // Only allow digits, max 6
    setToken(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    if (token.length !== 6) {
      setError("Please enter a 6-digit OTP code");
      setIsLoading(false);
      return;
    }

    try {
      const data = await authApi.authenticate({ token });
      setMessage(data.message);
      // Update auth context and redirect to home page after successful authentication
      login();
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/50 to-background p-4">
      <Card className="w-full max-w-md bg-card/80 border backdrop-blur-sm">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Enter OTP Code</CardTitle>
          <CardDescription>
            Check your email for the 6-digit verification code
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="token" className="text-center block">
                Verification Code
              </Label>
              <Input
                id="token"
                name="token"
                type="text"
                placeholder="000000"
                value={token}
                onChange={handleChange}
                required
                maxLength={6}
                className="text-center text-2xl tracking-widest font-mono py-4"
                autoComplete="one-time-code"
              />
              <p className="text-xs text-muted-foreground text-center">
                Enter the 6-digit code sent to your email
              </p>
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
              disabled={isLoading || token.length !== 6}
            >
              {isLoading ? "Verifying..." : "Verify & Sign In"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center text-sm text-slate-400">
          Didn&apos;t receive the code?{" "}
          <Link 
            href="/auth/login" 
            className="text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Try logging in again
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
