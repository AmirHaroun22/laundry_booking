import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../config";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        
        try {
            const csrfResponse = await fetch(`${API_URL}/csrf/`, {
                credentials: "include",
            });

            const csrfData = await csrfResponse.json();
            const csrfToken = csrfData.csrfToken;

            if (!csrfToken) {
                alert("CSRF token not found. Please check your backend settings.");
                return;
            }

            const response = await fetch(`${API_URL}/login/`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrfToken,
                },
                body: JSON.stringify({ username, password }),
            });

            const responseData = await response.text();
            const data = JSON.parse(responseData);
            
            if (response.ok) {
                navigate("/");
            } else {
                alert(data.message || "Invalid login credentials");
            }
        } catch (error) {
            console.error("Login error:", error);
            alert("An error occurred during login");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <h2>Welcome Back</h2>
                <form className="login-form" onSubmit={handleLogin}>
                    <input 
                        type="text" 
                        placeholder="Username" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        required 
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;