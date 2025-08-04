"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authApi } from "@/lib/api/auth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";
import { Eye, EyeOff, Mail, Lock, User, UserCircle, ArrowRight, Check, X, Loader2 } from "lucide-react";
import Link from "next/link";
import { GuestGuard } from "@/components/guards/auth-guards";

function RegisterContent() {
  const { t } = useTranslation();
  const formSchema = z.object({
    email: z.string().email(t("validation.invalidEmail")),
    username: z.string().min(3, t("validation.minLength", { field: t("auth.username"), min: 3 })),
    fullName: z.string().min(2, t("validation.minLength", { field: t("auth.fullName"), min: 2 })),
    password: z.string().min(8, t("validation.minLength", { field: t("common.password"), min: 8 })),
    passwordConfirm: z.string().min(8, t("validation.minLength", { field: t("auth.confirmPassword"), min: 8 })),
  }).refine((data) => data.password === data.passwordConfirm, {
    message: t("validation.passwordMatch"),
    path: ["passwordConfirm"],
  });

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    fullName: "",
    password: "",
    passwordConfirm: "",
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [debouncedEmail, setDebouncedEmail] = useState("");
  const [debouncedUsername, setDebouncedUsername] = useState("");
  const router = useRouter();

  // Debounce email and username for API checks
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedEmail(formData.email);
    }, 500);
    return () => clearTimeout(timer);
  }, [formData.email]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedUsername(formData.username);
    }, 500);
    return () => clearTimeout(timer);
  }, [formData.username]);

  // Check if email exists
  const { data: emailExists, isLoading: isEmailLoading } = useQuery({
    queryKey: ["auth/check-email", debouncedEmail],
    queryFn: () => authApi.checkEmailExists(debouncedEmail),
    enabled: debouncedEmail.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(debouncedEmail),
    staleTime: 30000, // 30 seconds
  });

  // Check if username exists
  const { data: usernameExists, isLoading: isUsernameLoading } = useQuery({
    queryKey: ["auth/check-username", debouncedUsername],
    queryFn: () => authApi.checkUsernameExists(debouncedUsername),
    enabled: debouncedUsername.length >= 3,
    staleTime: 30000, // 30 seconds
  });

  // Compute availability status
  const emailStatus = useMemo(() => {
    if (!debouncedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(debouncedEmail)) return null;
    if (isEmailLoading) return "checking";
    if (emailExists) return "taken";
    return "available";
  }, [debouncedEmail, isEmailLoading, emailExists]);

  const usernameStatus = useMemo(() => {
    if (!debouncedUsername || debouncedUsername.length < 3) return null;
    if (isUsernameLoading) return "checking";
    if (usernameExists) return "taken";
    return "available";
  }, [debouncedUsername, isUsernameLoading, usernameExists]);

  const registrationMutation = useMutation({
    mutationKey: ["auth/register"],
    mutationFn: authApi.register,
    onSuccess: () => {
      toast.success(t("auth.registrationSuccess"));
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const updateFormData = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const validateForm = () => {
    try {
      formSchema.parse(formData);
      
      // Additional validation for existing email/username
      const newErrors: Record<string, string> = {};
      
      if (emailExists) {
        newErrors.email = t("validation.emailTaken");
      }
      
      if (usernameExists) {
        newErrors.username = t("validation.usernameTaken");
      }
      
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return false;
      }
      
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.issues.forEach((issue) => {
          if (issue.path[0]) {
            newErrors[issue.path[0] as string] = issue.message;
          }
        });
        
        // Add availability errors
        if (emailExists) {
          newErrors.email = t("validation.emailTaken");
        }
        
        if (usernameExists) {
          newErrors.username = t("validation.usernameTaken");
        }
        
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      registrationMutation.mutate({
        email: formData.email,
        username: formData.username,
        fullName: formData.fullName,
        password: formData.password,
        confirmPassword: formData.passwordConfirm,
      });
    }
  };

  const renderAvailabilityIndicator = (status: string | null) => {
    switch (status) {
      case "checking":
        return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />;
      case "available":
        return <Check className="h-4 w-4 text-green-500" />;
      case "taken":
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">{t("auth.createAccount")}</h1>
          <p className="text-muted-foreground mt-2">{t("auth.registerSubtitle")}</p>
        </div>
        
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-semibold">{t("auth.signUp")}</CardTitle>
            <CardDescription>
              {t("auth.createAccountDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  {t("common.email")}
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder={t("auth.emailPlaceholder")}
                    className={`pl-10 pr-10 ${
                      errors.email 
                        ? "border-red-500 focus-visible:ring-red-500" 
                        : emailStatus === "available"
                        ? "border-green-500 focus-visible:ring-green-500"
                        : emailStatus === "taken"
                        ? "border-red-500 focus-visible:ring-red-500"
                        : ""
                    }`}
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
                    disabled={registrationMutation.isPending}
                  />
                  <div className="absolute right-3 top-3">
                    {renderAvailabilityIndicator(emailStatus)}
                  </div>
                </div>
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
                {emailStatus === "available" && !errors.email && (
                  <p className="text-sm text-green-600">{t("validation.emailAvailable")}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">
                  {t("auth.username")}
                </Label>
                <div className="relative">
                  <UserCircle className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    placeholder={t("auth.usernamePlaceholder")}
                    className={`pl-10 pr-10 ${
                      errors.username 
                        ? "border-red-500 focus-visible:ring-red-500" 
                        : usernameStatus === "available"
                        ? "border-green-500 focus-visible:ring-green-500"
                        : usernameStatus === "taken"
                        ? "border-red-500 focus-visible:ring-red-500"
                        : ""
                    }`}
                    value={formData.username}
                    onChange={(e) => updateFormData("username", e.target.value)}
                    disabled={registrationMutation.isPending}
                  />
                  <div className="absolute right-3 top-3">
                    {renderAvailabilityIndicator(usernameStatus)}
                  </div>
                </div>
                {errors.username && (
                  <p className="text-sm text-red-500">{errors.username}</p>
                )}
                {usernameStatus === "available" && !errors.username && (
                  <p className="text-sm text-green-600">{t("validation.usernameAvailable")}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-medium">
                  {t("auth.fullName")}
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder={t("auth.fullNamePlaceholder")}
                    className={`pl-10 ${errors.fullName ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                    value={formData.fullName}
                    onChange={(e) => updateFormData("fullName", e.target.value)}
                    disabled={registrationMutation.isPending}
                  />
                </div>
                {errors.fullName && (
                  <p className="text-sm text-red-500">{errors.fullName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  {t("common.password")}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={t("auth.passwordPlaceholder")}
                    className={`pl-10 pr-10 ${errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                    value={formData.password}
                    onChange={(e) => updateFormData("password", e.target.value)}
                    disabled={registrationMutation.isPending}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="passwordConfirm" className="text-sm font-medium">
                  {t("auth.confirmPassword")}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="passwordConfirm"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder={t("auth.confirmPasswordPlaceholder")}
                    className={`pl-10 pr-10 ${errors.passwordConfirm ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                    value={formData.passwordConfirm}
                    onChange={(e) => updateFormData("passwordConfirm", e.target.value)}
                    disabled={registrationMutation.isPending}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.passwordConfirm && (
                  <p className="text-sm text-red-500">{errors.passwordConfirm}</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={registrationMutation.isPending}
              >
                {registrationMutation.isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    {t("common.loading")}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {t("auth.createAccount")}
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </Button>
            </form>

            <div className="text-center pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                {t("auth.alreadyHaveAccount")}{" "}
                <Link href="/auth/login" className="text-primary hover:underline font-medium">
                  {t("auth.signIn")}
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <GuestGuard>
      <RegisterContent />
    </GuestGuard>
  );
}
