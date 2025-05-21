import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { User, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
  confirmPassword: z.string(),
  role: z.enum(["preparedBy", "approvedBy"]),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      role: "preparedBy",
    },
  });

  const onSubmit = async (values) => {
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          username: values.username,
          password: values.password,
          role: values.role,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(response.data.message || "Registration successful!");
      navigate("/login", {
        state: {
          username: values.username,
          newlyRegistered: true,
        },
      });
    } catch (error) {
      let errorMessage = "An error occurred during registration";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        errorMessage = Object.values(error.response.data.errors)
          .map((err) => (typeof err === "string" ? err : err.message))
          .join(", ");
      }

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-fidel-100 dark:bg-fidel-950/20 rounded-full blur-3xl opacity-60 dark:opacity-30 -z-10"></div>
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-slate-100 dark:bg-slate-800/20 rounded-full blur-3xl opacity-60 dark:opacity-30 -z-10"></div>

        <div className="w-full max-w-md space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mt-5">
              Create an account
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Join the HR Management System
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-card p-6 md:p-8 shadow-lg"
          >
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
             
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                >
                  Username
                </label>
                <div className="relative">
                  <Input
                    id="username"
                    type="text"
                    {...form.register("username")}
                    className="glass-input pl-10"
                    placeholder="hr_clerk"
                  />
                  <User
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                    size={18}
                  />
                </div>
                {form.formState.errors.username && (
                  <p className="mt-1 text-sm text-red-500">
                    {form.formState.errors.username.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                >
                  Role
                </label>
                <Select
                  value={form.watch("role")}
                  onValueChange={(value) => form.setValue("role", value)}
                >
                  <SelectTrigger className="glass-input">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <SelectItem value="preparedBy">Prepared By</SelectItem>
                    <SelectItem value="approvedBy">approvedBy</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...form.register("password")}
                    className="glass-input pl-10 pr-10"
                    placeholder="••••••••"
                  />
                  <Lock
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                    size={18}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-slate-900 dark:hover:text-white"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {form.formState.errors.password && (
                  <p className="mt-1 text-sm text-red-500">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    {...form.register("confirmPassword")}
                    className="glass-input pl-10 pr-10"
                    placeholder="••••••••"
                  />
                  <Lock
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                    size={18}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-slate-900 dark:hover:text-white"
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
                {form.formState.errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">
                    {form.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full bg-fidel-500 hover:bg-fidel-600 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </span>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </div>
            </form>
          </motion.div>

          {/* Login Link */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center text-sm text-muted-foreground"
          >
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-fidel-600 hover:text-fidel-500 font-medium"
            >
              Sign in
            </Link>
          </motion.p>
        </div>
      </div>
    </div>
  );
};

export default Signup;