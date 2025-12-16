import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const login = async (email, password, rememberMe = false) => {
        try {
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
            
            // Store session data in sessionStorage
            sessionStorage.setItem("userData", JSON.stringify(userData));
            
            // Set authentication state
            setUser(userData);
            setIsAuthenticated(true);
            
            // Store remember me preference (only email)
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
            return { 
                success: false, 
                message: error.message || "Login failed. Please check your credentials."
            };
        }
    };

    const logout = () => {
        // Clear all auth-related data
        sessionStorage.removeItem("userData");
        localStorage.removeItem("rememberMe");
        localStorage.removeItem("savedEmail");
        
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            login, 
            logout, 
            isAuthenticated 
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}