"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
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
import { Eye, EyeOff, Loader2, Mail, Lock, User } from "lucide-react";
import {
  updateUserPassword,
  updateUserProfile,
  validateCurrentSellerPassword,
} from "@/app/seller/[orgId]/dashboard/profile/action";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema } from "@/lib/schema/profileSchema";
import {
  currentPasswordSchema,
  newPasswordSchema,
} from "@/lib/schema/passwordSchema";
import { cn } from "@/lib/utils";
import { InputField } from "@/components/Auth/FormFields";

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
  const initialName = AffiliateData
    ? AffiliateData.name
    : (UserData?.name ?? "");
  const initialEmail = AffiliateData
    ? AffiliateData.email
    : (UserData?.email ?? "");

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: initialName,
      email: initialEmail,
    },
  });
  const currrentPasswordForm = useForm({
    resolver: zodResolver(currentPasswordSchema),
    defaultValues: {
      currentPassword: "",
    },
  });
  const newPasswordForm = useForm({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });
  const currentName = profileForm.watch("name");
  const currentEmail = profileForm.watch("email");
  const isFormUnchanged =
    currentName.trim() === initialName.trim() &&
    currentEmail.trim() === initialEmail.trim();
  const { toast } = useToast();

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [step, setStep] = useState<"current" | "new">("current");

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
        newPasswordForm.reset({ newPassword: "", confirmPassword: "" });
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
  const onSubmitValidateCurrent = (data: any) => {
    validatePassword.mutate(data.currentPassword);
  };
  const onSubmitUpdatePassword = (data: any) => {
    updatePassword.mutate(data.newPassword);
  };
  const resetPasswordModal = () => {
    setShowPasswordModal(false);
    setStep("current");
    currrentPasswordForm.reset();
    newPasswordForm.reset();
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
          <Form {...profileForm}>
            <form
              id="profile-form"
              onSubmit={profileForm.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <InputField
                control={profileForm.control}
                name="name"
                label="Username"
                placeholder="Enter your name"
                type="text"
                icon={User}
                profile
              />

              <InputField
                control={profileForm.control}
                name="email"
                label="Email Address"
                placeholder="john@example.com"
                type="email"
                icon={Mail}
                profile
              />

              <div className="pt-6 border-t mt-8">
                <h3 className="font-medium mb-4">Password</h3>
                <Button
                  type="button"
                  onClick={() => setShowPasswordModal(true)}
                >
                  Change Password
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-end border-t pt-6">
          <Button
            form="profile-form"
            type="submit"
            disabled={updateProfile.isPending || isFormUnchanged}
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
            <Form {...currrentPasswordForm}>
              <form
                onSubmit={currrentPasswordForm.handleSubmit(
                  onSubmitValidateCurrent,
                )}
                className="space-y-4"
              >
                <InputField
                  control={currrentPasswordForm.control}
                  name="currentPassword"
                  label="Current Password"
                  placeholder="Enter current password"
                  type="password"
                  icon={Lock}
                  showPasswordToggle={true}
                />
                <DialogFooter>
                  <Button type="submit" disabled={validatePassword.isPending}>
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
              </form>
            </Form>
          ) : (
            <Form {...newPasswordForm}>
              <form
                key={step}
                onSubmit={newPasswordForm.handleSubmit(onSubmitUpdatePassword)}
                className="space-y-4"
              >
                <InputField
                  control={newPasswordForm.control}
                  name="newPassword"
                  label="New Password"
                  placeholder="Enter new password"
                  type="password"
                  icon={Lock}
                  showPasswordToggle
                />

                <InputField
                  control={newPasswordForm.control}
                  name="confirmPassword"
                  label="Confirm Password"
                  placeholder="Re-enter password"
                  type="password"
                  icon={Lock}
                  showPasswordToggle
                />

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
            </Form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
