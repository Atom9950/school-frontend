import { useAuth } from "@/lib/use-auth";
import { signOut } from "@/lib/auth-client";
import { useNavigate } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { LogOut, Mail, User as UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const Settings = () => {
  const { session, isLoading } = useAuth();
  const navigate = useNavigate();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleLogoutConfirm = async () => {
    setShowLogoutDialog(false);
    await signOut();
    navigate("/login");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">No session found</p>
      </div>
    );
  }

  const admin = session.user;

  return (
    <div className="settings-container space-y-6">
      {/* Settings Header */}
      <div className="settings-header">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground text-lg">
          Manage your admin account and preferences
        </p>
      </div>

      <Separator />

      {/* Admin Profile Section */}
      <div className="profile-section">
        <h2 className="text-xl font-bold mb-4">Admin Profile</h2>
        
        <Card className="p-6">
          <CardHeader className="px-0 pt-0 pb-6">
            <CardTitle className="text-2xl">Account Information</CardTitle>
            <CardDescription>
              Your admin account details
            </CardDescription>
          </CardHeader>

          <CardContent className="px-0 space-y-6">
            {/* Name Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "flex items-center justify-center w-12 h-12 rounded-lg",
                  "bg-primary/10"
                )}>
                  <UserIcon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Full Name
                  </p>
                  <p className="text-lg font-semibold">
                    {admin.name}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Email Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "flex items-center justify-center w-12 h-12 rounded-lg",
                  "bg-primary/10"
                )}>
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Email Address
                  </p>
                  <p className="text-lg font-semibold">
                    {admin.email}
                  </p>
                </div>
              </div>
            </div>

            {/* <Separator /> */}

            {/* Email Verification Status */}
            {/* <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <p className="text-sm font-medium">Email Verification</p>
                <p className="text-xs text-muted-foreground">
                  Your email is {admin.emailVerified ? "verified" : "not verified"}
                </p>
              </div>
              <div className={cn(
                "px-3 py-1 rounded-full text-xs font-medium",
                admin.emailVerified
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
              )}>
                {admin.emailVerified ? "Verified" : "Unverified"}
              </div>
            </div> */}
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Logout Section */}
      <div className="logout-section">
        <h2 className="text-xl font-bold mb-4">Session Management</h2>
        
        <Card className="p-6 border-destructive/20 bg-destructive/5">
          <CardHeader className="px-0 pt-0 pb-6">
            <CardTitle className="text-lg text-destructive">Logout</CardTitle>
            <CardDescription>
              Sign out of your admin account on this device
            </CardDescription>
          </CardHeader>

          <CardContent className="px-0">
            <Button
              onClick={() => setShowLogoutDialog(true)}
              variant="destructive"
              size="lg"
              className="w-full sm:w-auto gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
            <p className="text-xs text-muted-foreground mt-3">
              You will be redirected to the login page after logout.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Logout Confirmation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to logout? You will need to sign in again to access the dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogoutConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Settings;