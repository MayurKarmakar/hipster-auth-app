import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { type User, useAppStore } from "storeApp/store";
import * as z from "zod";
import "../App.css";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { Eye, EyeOff } from "lucide-react";

// Login schema
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

// Registration schema
const registerSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Please confirm your password"),
    isUser: z.boolean(),
    isAdmin: z.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.isUser || data.isAdmin, {
    message: "Please select a role",
    path: ["isUser"],
  })
  .refine((data) => !(data.isUser && data.isAdmin), {
    message: "Please select only one role",
    path: ["isUser"],
  });

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthForm() {
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

  const registeredUsers = useAppStore(
    (state: any) => state.registeredUsers
  ) as User[];
  const addRegisteredUser = useAppStore(
    (state: any) => state.addRegisteredUser
  ) as (user: User) => void;
  const addUserData = useAppStore((state: any) => state.addUserData);

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      isUser: true,
      isAdmin: false,
    },
  });

  const onLoginSubmit = async (data: LoginFormValues) => {
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const user = registeredUsers.find(
        (u: User) => u.email === data.email && u.password === data.password
      );

      if (!user) {
        setError("Invalid email or password");
        setIsLoading(false);
        return;
      }

      setSuccess(`Welcome back, ${user.firstName}!`);
      setTimeout(() => {
        addUserData(user);
        setIsLoading(false);
        setIsLoggedIn(true);
        setLoggedInUser(user);
      }, 1000);
    } catch (err: any) {
      setError("Login failed");
      setIsLoading(false);
    }
  };

  const onRegisterSubmit = async (data: RegisterFormValues) => {
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const existingUser = registeredUsers.find(
        (u: User) => u.email === data.email
      );
      if (existingUser) {
        setError("Email already registered");
        setIsLoading(false);
        return;
      }

      const newUser: User = {
        userId: crypto.randomUUID(),
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        role: data.isAdmin ? "admin" : "user",
      };

      addRegisteredUser(newUser);

      setSuccess(
        `Account created successfully! Welcome, ${newUser.firstName}!`
      );
      setTimeout(() => {
        addUserData(newUser);
        setIsLoading(false);
        setIsLoggedIn(true);
        setLoggedInUser(newUser);
      }, 1000);
    } catch (err: any) {
      setError("Registration failed");
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setError("");
    setSuccess("");
    if (!isRegistering) {
      loginForm.reset();
    } else {
      registerForm.reset();
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoggedInUser(null);
    setError("");
    setSuccess("");
    loginForm.reset();
    registerForm.reset();
  };

  console.log(registerForm.getValues());

  if (isLoggedIn && loggedInUser) {
    return (
      <Card className="flex w-full max-w-md xl:max-w-md mx-auto px-4 sm:px-0">
        <CardHeader className="px-4 sm:px-6 text-center">
          <CardTitle className="text-xl sm:text-2xl">
            Welcome, {loggedInUser.firstName}!
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            You have successfully logged in
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-md text-center">
            <p className="text-sm font-medium">Login Successful</p>
            <p className="text-xs mt-1">You are now signed in as {loggedInUser.role}</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full text-sm sm:text-base"
          >
            Log Out
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex w-full max-w-md xl:max-w-md mx-auto px-4 sm:px-0">
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="text-xl sm:text-2xl">
          {isRegistering ? "Create Account" : "Welcome Back"}
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          {isRegistering
            ? "Enter your details to create a new account"
            : "Enter your credentials to access your account"}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        {error && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-md text-xs sm:text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md text-xs sm:text-sm">
            {success}
          </div>
        )}

        {isRegistering ? (
          <Form {...registerForm}>
            <form
              onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={registerForm.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs sm:text-sm">
                        First Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John"
                          disabled={isLoading}
                          className="text-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs sm:text-sm">
                        Last Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Doe"
                          disabled={isLoading}
                          className="text-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-3">
                <FormLabel className="text-xs sm:text-sm">Role</FormLabel>
                <div className="flex flex-col space-y-3">
                  <FormField
                    control={registerForm.control}
                    name="isUser"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                registerForm.setValue("isUser", true);
                                registerForm.setValue("isAdmin", false);
                              }
                            }}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormLabel className="text-xs sm:text-sm font-normal cursor-pointer">
                          User
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="isAdmin"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                registerForm.setValue("isAdmin", true);
                                registerForm.setValue("isUser", false);
                              }
                            }}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormLabel className="text-xs sm:text-sm font-normal cursor-pointer">
                          Admin
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="isUser"
                    render={() => (
                      <FormItem>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={registerForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs sm:text-sm">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john.doe@example.com"
                        disabled={isLoading}
                        className="text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={registerForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs sm:text-sm">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showRegisterPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          disabled={isLoading}
                          className="text-sm pr-10"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showRegisterPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={registerForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs sm:text-sm">
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          disabled={isLoading}
                          className="text-sm pr-10"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full text-sm sm:text-base"
              >
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>

              <div className="text-center text-xs sm:text-sm text-muted-foreground">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-primary hover:underline font-medium"
                >
                  Sign in
                </button>
              </div>
            </form>
          </Form>
        ) : (
          <Form {...loginForm}>
            <form
              onSubmit={loginForm.handleSubmit(onLoginSubmit)}
              className="space-y-4"
            >
              <FormField
                control={loginForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs sm:text-sm">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john.doe@example.com"
                        disabled={isLoading}
                        className="text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs sm:text-sm">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showLoginPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          disabled={isLoading}
                          className="text-sm pr-10"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowLoginPassword(!showLoginPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showLoginPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full text-sm sm:text-base"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>

              <div className="text-center text-xs sm:text-sm text-muted-foreground">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-primary hover:underline font-medium"
                >
                  Create account
                </button>
              </div>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}
