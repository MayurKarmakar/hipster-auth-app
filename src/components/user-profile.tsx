import { Edit, Key, LogOut, Mail, Shield, User as UserIcon, X, Check } from "lucide-react";
import { useState } from "react";
import { useAppStore, type User } from "storeApp/store";
import "../App.css";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";

export default function UserProfileView() {
  const removeUserData = useAppStore((state: any) => state.removeUserData);
  const updateUser = useAppStore((state: any) => state.updateUser);
  const user = useAppStore((state: any) => state.user) as User;

  const [isEditingName, setIsEditingName] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");

  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  function handleLogout() {
    removeUserData();
  }

  function getInitials() {
    const firstName = user.firstName || "";
    const lastName = user.lastName || "";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "U";
  }

  function getFullName() {
    return `${user.firstName} ${user.lastName}`.trim() || "No name";
  }

  function handleEditName() {
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setIsEditingName(true);
  }

  function handleSaveName() {
    if (!firstName.trim() || !lastName.trim()) {
      return;
    }
    updateUser(user.userId, { firstName: firstName.trim(), lastName: lastName.trim() });
    setIsEditingName(false);
  }

  function handleCancelEdit() {
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setIsEditingName(false);
  }

  function handlePasswordUpdate() {
    setPasswordError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All fields are required");
      return;
    }

    if (currentPassword !== user.password) {
      setPasswordError("Current password is incorrect");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    updateUser(user.userId, { password: newPassword });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setIsPasswordDialogOpen(false);
  }

  if (!user) {
    return (
      <div className={cn("flex items-center justify-center min-h-[400px] max-w-md mx-auto px-4")}>
        <Card className={cn("w-full max-w-md")}>
          <CardContent className={cn("text-center py-6 px-4 sm:px-6")}>
            <p className={cn("text-sm sm:text-base text-muted-foreground")}>
              You must login to view this page
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("w-full max-w-lg mx-auto py-4 sm:py-8 px-4")}>
      <Card className={cn("w-full md:max-w-md")}>
        <CardHeader className={cn("px-4 sm:px-6")}>
          <CardTitle className={cn("text-xl sm:text-2xl")}>User Profile</CardTitle>
          <CardDescription className={cn("text-xs sm:text-sm")}>
            View your account information and details
          </CardDescription>
        </CardHeader>
        <CardContent className={cn("space-y-6 pt-6 px-4 sm:px-6")}>
          <div className={cn("flex flex-col items-center space-y-3")}>
            <Avatar className={cn("h-20 w-20 sm:h-32 sm:w-32")}>
              <AvatarFallback className={cn("text-2xl sm:text-3xl font-semibold bg-primary/10 text-primary")}>
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div className={cn("text-center space-y-2")}>
              {!isEditingName ? (
                <>
                  <div className={cn("flex items-center justify-center gap-2")}>
                    <h3 className={cn("text-lg sm:text-2xl font-semibold")}>{getFullName()}</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleEditName}
                      className={cn("h-8 w-8 p-0")}
                    >
                      <Edit className={cn("h-4 w-4")} />
                    </Button>
                  </div>
                  <p className={cn("text-xs sm:text-sm text-muted-foreground break-all")}>{user.email}</p>
                </>
              ) : (
                <>
                  <div className={cn("flex flex-col gap-2 items-center")}>
                    <div className={cn("flex flex-col sm:flex-row gap-2")}>
                      <Input
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="First Name"
                        className={cn("w-full sm:w-32")}
                      />
                      <Input
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Last Name"
                        className={cn("w-full sm:w-32")}
                      />
                    </div>
                    <div className={cn("flex gap-2")}>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={handleSaveName}
                        className={cn("h-8")}
                      >
                        <Check className={cn("h-4 w-4 mr-1")} />
                        Save
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancelEdit}
                        className={cn("h-8")}
                      >
                        <X className={cn("h-4 w-4 mr-1")} />
                        Cancel
                      </Button>
                    </div>
                  </div>
                  <p className={cn("text-xs sm:text-sm text-muted-foreground break-all")}>{user.email}</p>
                </>
              )}
            </div>
          </div>

          <Separator />

          <div className={cn("grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2")}>
            <div className={cn("flex items-start space-x-3")}>
              <Mail className={cn("h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground mt-0.5")} />
              <div className={cn("flex-1 space-y-1")}>
                <p className={cn("text-xs sm:text-sm font-medium")}>Email Address</p>
                <p className={cn("text-xs sm:text-sm text-muted-foreground break-all")}>
                  {user.email}
                </p>
              </div>
            </div>

            <div className={cn("flex items-start space-x-3")}>
              <UserIcon className={cn("h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground mt-0.5")} />
              <div className={cn("flex-1 space-y-1")}>
                <p className={cn("text-xs sm:text-sm font-medium")}>User ID</p>
                <p className={cn("text-[10px] sm:text-xs text-muted-foreground font-mono break-all")}>
                  {user.userId}
                </p>
              </div>
            </div>

            <div className={cn("flex items-start space-x-3")}>
              <Shield className={cn("h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground mt-0.5")} />
              <div className={cn("flex-1 space-y-1")}>
                <p className={cn("text-xs sm:text-sm font-medium")}>Role</p>
                <Badge
                  variant={user.role === "admin" ? "default" : "secondary"}
                  className={cn("text-xs")}
                >
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          <div className={cn("flex flex-col sm:flex-row justify-center gap-3 pt-2")}>
            <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className={cn("w-full sm:w-auto")}>
                  <Key className={cn("mr-2 h-4 w-4")} />
                  Change Password
                </Button>
              </DialogTrigger>
              <DialogContent className={cn("w-[90vw] max-w-[425px] mx-auto")}>
                <DialogHeader>
                  <DialogTitle className={cn("text-lg sm:text-xl")}>Change Password</DialogTitle>
                  <DialogDescription className={cn("text-xs sm:text-sm")}>
                    Update your password. Make sure it's at least 6 characters long.
                  </DialogDescription>
                </DialogHeader>
                <div className={cn("grid gap-4 py-4")}>
                  <div className={cn("grid gap-2")}>
                    <label htmlFor="current-password" className={cn("text-sm font-medium")}>
                      Current Password
                    </label>
                    <Input
                      id="current-password"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                    />
                  </div>
                  <div className={cn("grid gap-2")}>
                    <label htmlFor="new-password" className={cn("text-sm font-medium")}>
                      New Password
                    </label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                    />
                  </div>
                  <div className={cn("grid gap-2")}>
                    <label htmlFor="confirm-password" className={cn("text-sm font-medium")}>
                      Confirm New Password
                    </label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                    />
                  </div>
                  {passwordError && (
                    <p className={cn("text-sm text-destructive")}>{passwordError}</p>
                  )}
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsPasswordDialogOpen(false);
                      setCurrentPassword("");
                      setNewPassword("");
                      setConfirmPassword("");
                      setPasswordError("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="button" onClick={handlePasswordUpdate}>
                    Update Password
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button
              onClick={handleLogout}
              variant="destructive"
              className={cn("w-full sm:w-auto")}
            >
              <LogOut className={cn("mr-2 h-4 w-4")} />
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
