// app/dashboard/profile/page.tsx
"use client";
import React from "react";
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

interface UserData {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  // Add other fields from your schema as needed
}

interface ProfileProps {
  userData: UserData;
}

export default function Profile({ userData }: ProfileProps) {
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [username, setUsername] = React.useState(userData.name);
  const [email, setEmail] = React.useState(userData.email);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your profile update logic here
    console.log({
      username,
      email,
      currentPassword,
      newPassword,
    });
  };

  // Get initials for profile picture
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
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
        <Button form="profile-form" type="submit">
          Save Changes
        </Button>
      </div>

      {/* Main Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <form id="profile-form" onSubmit={handleSubmit}>
            {/* Profile Picture */}
            <div className="space-y-4">
              <div className="space-y-3">
                <Label>Profile Picture</Label>
                <div className="flex items-center gap-4">
                  {userData.image ? (
                    <img
                      src={userData.image}
                      alt="Profile"
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl">
                      {getInitials(userData.name)}
                    </div>
                  )}
                  <div className="flex flex-col gap-2">
                    <Input id="avatar" type="file" className="max-w-xs" />
                    <p className="text-xs text-muted-foreground">
                      JPG, GIF or PNG. Max size of 2MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Username */}
              <div className="space-y-1">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-[280px]"
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-[280px]"
                />
              </div>
            </div>

            {/* Password Change Section */}
            <div className="space-y-4 pt-6 border-t mt-8">
              <h3 className="font-medium">Change Password</h3>
              {/* Current Password */}
              <div className="space-y-1">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-[280px]"
                />
              </div>
              {/* New Password */}
              <div className="space-y-1">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-[280px]"
                />
              </div>
              {/* Confirm Password */}
              <div className="space-y-1">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-[280px]"
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end border-t pt-6">
          <Button form="profile-form" type="submit">
            Save Changes
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
