"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  updateAffiliatePassword,
  updateAffiliateProfile,
  validateCurrentPassword,
} from "@/app/affiliate/[orgId]/dashboard/profile/action";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import {
  updateUserPassword,
  updateUserProfile,
  validateCurrentSellerPassword,
} from "@/app/seller/[orgId]/dashboard/profile/action";

interface CommonData {
  id: string;
  name: string;
  email: string;
  image?: string | null;
}

interface ProfileProps {
  AffiliateData?: CommonData;
  UserData?: CommonData;
  isPreview?: boolean;
}

export default function Profile({
  AffiliateData,
  UserData,
  isPreview = false,
}: ProfileProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: AffiliateData ? AffiliateData.name : UserData?.name,
      email: AffiliateData ? AffiliateData.email : UserData?.email,
    },
  });

  const { toast } = useToast();

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [step, setStep] = useState<"current" | "new">("current");
  const [currentPassword, setCurrentPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const updateProfile = useMutation({
    mutationFn: async (data: any) => {
      if (isPreview) {
        return new Promise((resolve) =>
          setTimeout(() => resolve({ ok: true }), 1000),
        );
      }
      return AffiliateData
        ? updateAffiliateProfile(data)
        : updateUserProfile(data);
    },
    onSuccess: () => {
      toast({
        title: "Profile updated successfully",
        description: "Your profile was updated.",
      });
    },
    onError: (err: any) => {
      toast({
        variant: "destructive",
        title: "Update Error",
        description: err.message ?? "Something went wrong.",
      });
    },
  });

  const validatePassword = useMutation({
    mutationFn: async (password: string) => {
      if (isPreview) {
        return new Promise((resolve) =>
          setTimeout(() => resolve({ ok: password === "correct123" }), 1000),
        );
      }

      return AffiliateData
        ? validateCurrentPassword(password)
        : validateCurrentSellerPassword(password);
    },
    onSuccess: (res: any) => {
      if (res?.ok) {
        setStep("new");
        toast({
          title: "Password validated",
          description: "Enter your new password below.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Invalid Password",
          description: "Incorrect password.",
        });
        setPasswordError("Incorrect current password");
      }
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "Unexpected error. Please try again.",
      });
    },
  });

  const updatePassword = useMutation({
    mutationFn: async (newPassword: string) => {
      if (isPreview) {
        return new Promise((resolve) =>
          setTimeout(() => resolve({ ok: true }), 1000),
        );
      }

      return AffiliateData
        ? updateAffiliatePassword(newPassword)
        : updateUserPassword(newPassword);
    },
    onSuccess: (res: any) => {
      if (res?.ok) {
        toast({
          title: "Password updated successfully",
          description: "You can now use your new password.",
        });
        resetPasswordModal();
      } else {
        toast({
          variant: "destructive",
          title: "Update Failed",
          description: "Unable to change password.",
        });
      }
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Unexpected Error",
        description: "Please try again later.",
      });
    },
  });

  const onSubmit = (data: any) => {
    updateProfile.mutate(data);
  };

  const resetPasswordModal = () => {
    setShowPasswordModal(false);
    setStep("current");
    setCurrentPassword("");
    setPasswordError(null);
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="md:hidden" />
          <div>
            <h1 className="text-3xl font-bold">Profile Settings</h1>
            <p className="text-muted-foreground">
              Manage your account information
            </p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <form
            id="profile-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <div className="space-y-1">
              <Label htmlFor="name">Username</Label>
              <Input
                id="name"
                {...register("name", { required: true })}
                className="w-[280px]"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                {...register("email", { required: true })}
                className="w-[280px]"
              />
            </div>

            <div className="pt-6 border-t mt-8">
              <h3 className="font-medium mb-4">Password</h3>
              <Button type="button" onClick={() => setShowPasswordModal(true)}>
                Change Password
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end border-t pt-6">
          <Button
            form="profile-form"
            type="submit"
            disabled={updateProfile.isPending}
          >
            {updateProfile.isPending && (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            )}
            Save Changes
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={showPasswordModal} onOpenChange={resetPasswordModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {step === "current"
                ? "Verify Current Password"
                : "Set New Password"}
            </DialogTitle>
          </DialogHeader>

          {step === "current" ? (
            <div className="space-y-4">
              <Label htmlFor="current-password">Current Password</Label>
              <div className="relative">
                <Input
                  id="current-password"
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => {
                    setCurrentPassword(e.target.value);
                    setPasswordError(null);
                  }}
                />
                <button
                  type="button"
                  className="absolute right-3 top-2.5 text-muted-foreground"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
              {passwordError && (
                <p className="text-sm text-destructive">{passwordError}</p>
              )}
              <DialogFooter>
                <Button
                  onClick={() => {
                    if (!currentPassword) {
                      return toast({
                        variant: "destructive",
                        title: "Missing password",
                        description: "Please enter your current password.",
                      });
                    }
                    validatePassword.mutate(currentPassword);
                  }}
                  disabled={validatePassword.isPending}
                >
                  {validatePassword.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Validating
                    </>
                  ) : (
                    "Continue"
                  )}
                </Button>
              </DialogFooter>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const newPassword = e.currentTarget.newPassword.value;
                const confirmPassword = e.currentTarget.confirmPassword.value;

                if (newPassword !== confirmPassword) {
                  return toast({
                    variant: "destructive",
                    title: "Password mismatch",
                    description: "Please ensure both passwords match.",
                  });
                }

                updatePassword.mutate(newPassword);
              }}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-2.5 text-muted-foreground"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-2.5 text-muted-foreground"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={updatePassword.isPending}>
                  {updatePassword.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Updating
                    </>
                  ) : (
                    "Update Password"
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
