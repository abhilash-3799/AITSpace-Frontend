
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Checkbox from "../components/ui/Checkbox";
import { Building } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const username = email.split("@")[0];

   
    if (email.toLowerCase().includes("admin")) {
      localStorage.setItem("role", "admin");
    } else {
      localStorage.setItem("role", "user");
    }
   

    login(username);
    navigate("/dashboard");
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

          <div className="flex flex-col gap-4 text-left">
            <Input id="email" name="email" label="Email address" type="email" required />
            <Input id="password" label="Password" type="password" required />

            <div className="flex justify-between items-center">
              <Checkbox id="remember" label="Remember me" />
              <a href="#" className="text-blue-600 text-sm">
                Forgot password?
              </a>
            </div>

            <Button type="submit">Sign in</Button>
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
