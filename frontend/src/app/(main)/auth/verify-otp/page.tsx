"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authApi } from "@/lib/api/auth";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { ArrowRight, RefreshCw } from "lucide-react";
import Link from "next/link";
import { GuestGuard } from "@/components/guards/auth-guards";

function VerifyOtpContent() {
  const { t } = useTranslation();
  const [otp, setOtp] = useState(["", "", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const router = useRouter();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const verifyOtpMutation = useMutation({
    mutationKey: ["auth/verify-otp"],
    mutationFn: authApi.verifyOtp,
    onSuccess: () => {
      toast.success(t("auth.otpVerificationSuccess"));
      setTimeout(() => {
        router.push("/");
      }, 1000);
    },
    retry: false,
    onError: (error: Error) => {
      setError(error.message);
      toast.error(error.message);
    },
  });

  const resendOtpMutation = useMutation({
    mutationKey: ["auth/resend-otp"],
    mutationFn: authApi.resendOtp,
    onSuccess: () => {
      toast.success(t("auth.newOtpSent"));
      setOtp(["", "", "", "", "", "", ""]);
      setError("");
      // Focus the first input
      inputRefs.current[0]?.focus();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (error) setError("");

    // Auto-focus next input
    if (value && index < 6) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").slice(0, 7);
    const newOtp = pasteData.split("").concat(Array(7).fill("")).slice(0, 7);
    setOtp(newOtp);

    // Focus the last filled input or the first empty one
    const lastFilledIndex = newOtp.findIndex((val) => !val);
    const focusIndex =
      lastFilledIndex === -1 ? 5 : Math.max(0, lastFilledIndex - 1);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join("");

    if (otpString.length !== 7) {
      setError(t("auth.otpRequired"));
      return;
    }

    verifyOtpMutation.mutate({ token: otpString });
  };

  const isComplete = otp.every((digit) => digit !== "");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            {t("auth.verifyOtp")}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t("auth.otpSentToEmail")}
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-semibold text-center">
              {t("auth.enterOtp")}
            </CardTitle>
            <CardDescription className="text-center">
              {t("auth.otpInstructions")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label className="sr-only">{t("auth.otpCode")}</Label>
                <div className="flex justify-center gap-2">
                  {otp.map((digit, index) => (
                    <Input
                      key={index}
                      ref={(el) => {
                        inputRefs.current[index] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) =>
                        handleOtpChange(
                          index,
                          e.target.value.replace(/\D/g, ""),
                        )
                      }
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      className={`w-12 h-12 text-center text-lg font-semibold ${
                        error ? "border-red-500 focus-visible:ring-red-500" : ""
                      }`}
                      disabled={verifyOtpMutation.isPending}
                      aria-label={t("auth.otpDigit", { digit: index + 1 })}
                    />
                  ))}
                </div>
                {error && (
                  <p className="text-sm text-red-500 text-center">{error}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={!isComplete || verifyOtpMutation.isPending}
              >
                {verifyOtpMutation.isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    {t("auth.verifying")}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {t("auth.verifyCode")}
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </Button>
            </form>

            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  {t("auth.didntReceiveCode")}
                </p>
                <Button
                  variant="link"
                  className="p-0 h-auto text-primary"
                  onClick={() => resendOtpMutation.mutate()}
                  disabled={resendOtpMutation.isPending}
                >
                  <RefreshCw className={`h-4 w-4 mr-1 ${resendOtpMutation.isPending ? 'animate-spin' : ''}`} />
                  {resendOtpMutation.isPending ? t("auth.sendingCode") : t("auth.resendCode")}
                </Button>
              </div>

              <div className="text-center pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  {t("auth.wrongEmail")}{" "}
                  <Link
                    href="/auth/login"
                    className="text-primary hover:underline font-medium"
                  >
                    {t("auth.backToLogin")}
                  </Link>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <GuestGuard>
      <VerifyOtpContent />
    </GuestGuard>
  );
}
