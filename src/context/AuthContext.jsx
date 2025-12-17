import { createContext, useContext, useState } from "react";

// Create context
export const AuthContext = createContext();

// Provider component
export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        // Initialize from sessionStorage if available
        const stored = sessionStorage.getItem("userData");
        return stored ? JSON.parse(stored) : null;
    });
    const [isAuthenticated, setIsAuthenticated] = useState(!!user);

    const login = async (email, password, rememberMe = false) => {
        try {
            const response = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Invalid email or password");
            }

            const userData = await response.json();

            // Ensure employeeId exists (map backend field if necessary)
            const finalUserData = {
                ...userData,
                employeeId: userData.employeeId || userData.id || "EMP-UNKNOWN"
            };

            // Store session data
            sessionStorage.setItem("userData", JSON.stringify(finalUserData));

            // Set state
            setUser(finalUserData);
            setIsAuthenticated(true);

            // Remember me
            if (rememberMe) {
                localStorage.setItem("rememberMe", "true");
                localStorage.setItem("savedEmail", email);
            } else {
                localStorage.removeItem("rememberMe");
                localStorage.removeItem("savedEmail");
            }

            return { success: true };
        } catch (error) {
            console.error("Login error:", error);
            return { success: false, message: error.message || "Login failed." };
        }
    };

    const logout = () => {
        sessionStorage.removeItem("userData");
        localStorage.removeItem("rememberMe");
        localStorage.removeItem("savedEmail");

        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
}

// Custom hook to use AuthContext
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
