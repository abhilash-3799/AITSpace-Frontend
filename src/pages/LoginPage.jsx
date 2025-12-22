import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Checkbox from "../components/ui/Checkbox";
import { Building } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const email = e.target.email.value;
    const password = e.target.password.value;
    const rememberMe = e.target.remember?.checked || false;

    try {
      // Call backend API directly
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Invalid email or password");
      }

      const userData = await response.json();
      
      // Store user data in sessionStorage including employee ID
      const userSessionData = {
        ...userData,
        employeeId: userData.employeeId, 
        isAuthenticated: true
      };
      
      sessionStorage.setItem('userData', JSON.stringify(userSessionData));
      
      // Store remember me preference (only email)
      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
        localStorage.setItem("savedEmail", email);
      } else {
        localStorage.removeItem("rememberMe");
        localStorage.removeItem("savedEmail");
      }

      // Navigate to dashboard after successful login
      navigate("/dashboard");

    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleLogin}
        className="flex flex-col items-center text-center gap-6"
      >
        <div className="flex flex-col items-center gap-2">
          <div className="bg-blue-600 text-white rounded-xl p-4">
            <span className="text-3xl">
              <Building />
            </span>
          </div>

          <h2 className="text-xl font-semibold text-gray-900">AITSpace</h2>
          <p className="text-gray-500 text-sm">
            Smart workspace management for hybrid teams
          </p>
        </div>

        <div className="w-full max-w-md bg-white shadow-md rounded-2xl p-8 border border-gray-100">
          <h1 className="text-xl font-semibold text-left mb-6">
            Sign in to your account
          </h1>

          {/* Error Message - Only shown when there's an error */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-4 text-left">
            <Input 
              id="email" 
              name="email" 
              label="Email address" 
              type="email" 
              required 
              disabled={loading}
            />
            <Input 
              id="password" 
              name="password"
              label="Password" 
              type="password" 
              required 
              disabled={loading}
            />

            <div className="flex justify-between items-center">
              <Checkbox 
                id="remember" 
                name="remember" 
                label="Remember me" 
                disabled={loading}
              />
              <a href="#" className="text-blue-600 text-sm">
                Forgot password?
              </a>
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </div>

          <p className="text-center text-sm mt-6 text-gray-600">
            Don't have an account?{" "}
            <span className="text-blue-600 cursor-pointer">
              Contact your admin
            </span>
          </p>
        </div>

        <p className="text-gray-400 text-xs">
          © 2025 AITSpace. Enterprise workspace solutions.
        </p>
      </form>
    </div>
  );
}