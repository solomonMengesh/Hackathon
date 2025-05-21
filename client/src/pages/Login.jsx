import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { toast } from "sonner";
import axios from "axios";
import { jwtDecode } from 'jwt-decode';
import bannerImage from '../assets/banner.png';
import loginImage from '../assets/Login-image.png';
import logoImage from '../assets/Qlogo.png';

const Login = () => {
  const [searchParams] = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchParams.get("blocked") === "true") {
      toast.error("Your account has been blocked by the administrator");
      window.history.replaceState(null, "", "/login");
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        { username, password },
        { headers: { "Content-Type": "application/json" } }
      );

      const { token, role } = response.data;
      if (!token) throw new Error("Invalid login response: Missing token");

      const decoded = jwtDecode(token);
      if (!decoded.userId || !decoded.role) {
        throw new Error("Invalid login response: Incomplete token data");
      }

      const user = {
        username: username,
        _id: decoded.userId,
        role: role || decoded.role,
      };

      toast.success(`Welcome, ${user.username}! Redirecting...`);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      if (user.role === "preparedBy") {
        navigate("/employee-management", { replace: true, state: { freshLogin: true } });
      } else if (user.role === "approvedBy") {
        navigate("/payroll-approval", { replace: true, state: { freshLogin: true } });
      } else {
        toast.error("Unknown role. Please contact the administrator.");
      }
    } catch (error) {
      let errorMessage = "Login failed. Please try again.";
      if (axios.isAxiosError(error)) {
        if (error.response) {
          switch (error.response.status) {
            case 400: errorMessage = error.response.data.message || "Invalid request data"; break;
            case 401: errorMessage = "Invalid username or password"; break;
            case 403: errorMessage = error.response.data.message || "Account restricted"; break;
            case 404: errorMessage = "User not found"; break;
            case 422: errorMessage = error.response.data.message || "Account not linked"; break;
            case 429: errorMessage = "Too many attempts. Try again later."; break;
            default: errorMessage = error.response.data.message || `Error (${error.response.status})`;
          }
        } else if (error.request) {
          errorMessage = "No server response. Check connection.";
        } else {
          errorMessage = error.message || errorMessage;
        }
      } else {
        errorMessage = error.message || errorMessage;
      }
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-r from-[#22285E] to-[#191D50]">
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8 text-left">
            <h2 className="text-2xl font-bold text-white mb-2">Sign in to your account</h2>
            <p className="text-gray-300">Enter your credentials to access the system</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
                Username
              </label>
              <div className="relative">
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full p-2 rounded-md glass-input bg-[#353E88] border-none rounded-xl text-slate-400 pl-10"
                  placeholder="Enter your username"
                />
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full p-2 rounded-md glass-input bg-[#353E88] border-none rounded-xl text-slate-400 pl-10 pr-10"
                  placeholder="Enter your password"
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-blue-400 focus:ring-blue-500"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <Link to="/forgot-password" className="text-blue-400 hover:text-blue-300 font-medium">
                  Forgot password?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#FFDB05] to-[#FD6D76] hover:from-[#FD6D76] hover:to-[#FFDB05] text-white rounded-xl py-2 px-4"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>

            <div className="text-center text-sm text-gray-300">
              Don't have an account?{" "}
              <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-medium">
                Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>

      <div className="hidden md:flex w-1/2 relative">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${loginImage})` }}
        ></div>
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 w-full flex items-center justify-center p-12">
          <div className="max-w-md text-center text-white">
            <img src={logoImage} alt="Company Logo" className="w-32 h-32 mx-auto mb-8" />
            <h1 className="text-4xl font-bold mb-4">Welcome! to Awtar.</h1>
            <p className="text-xl">Smart payroll system for Qelem Meds Technologies</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;