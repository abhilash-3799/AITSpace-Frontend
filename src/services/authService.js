// const API_BASE_URL = "process.env.REACT_APP_API_BASE_URL/api/auth";
const API_BASE_URL = "http://192.168.120.15:8080/api/auth";
export const login = async (email, password) => {
    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,  // Changed from username to email
                password
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Login failed");
        }

        const data = await response.json();
        
        // Store all user data
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("username", data.username);
        localStorage.setItem("email", data.email);
        localStorage.setItem("employeeName", data.employeeName);
        localStorage.setItem("loginId", data.loginId);
        
        return data;
    } catch (error) {
        console.error("Login error:", error);
        throw error;
    }
};

export const signup = async (signupData) => {
    const response = await fetch(`${API_BASE_URL}/signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            ...signupData,
            email: signupData.email // Make sure email is included
        }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Signup failed");
    }

    return await response.json();
};

export const getCurrentUser = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    return {
        token,
        role: localStorage.getItem("role"),
        username: localStorage.getItem("username"),
        email: localStorage.getItem("email"),
        employeeName: localStorage.getItem("employeeName"),
        loginId: localStorage.getItem("loginId"),
    };
};

export const logout = () => {
    // Remove all stored data
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("employeeName");
    localStorage.removeItem("loginId");
    localStorage.removeItem("rememberMe");
    localStorage.removeItem("savedEmail");
};