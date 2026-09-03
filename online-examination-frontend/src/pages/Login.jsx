import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import { loginUser } from "../api/authApi";
import { useAuth } from "../context/AuthContext";

const Login = () => {
    const navigate = useNavigate();

    const {
        login,
        isAuthenticated,
        user
    } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Already logged in
    if (isAuthenticated && user) {

        if (user.userRole === "STUDENT") {
            return (
                <Navigate
                    to="/student/dashboard"
                    replace
                />
            );
        }

        if (user.userRole === "TEACHER") {
            return (
                <Navigate
                    to="/teacher/dashboard"
                    replace
                />
            );
        }
    }

    const handleChange = (event) => {
        const {
            name,
            value
        } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {

            // Call backend login API
            const response =
                await loginUser(formData);

            // Backend response:
            //
            // {
            //     token: "...",
            //     user: {
            //         userId: 17,
            //         fullName: "...",
            //         email: "...",
            //         userRole: "STUDENT",
            //         accountStatus: "ACTIVE"
            //     }
            // }
            console.log("FULL AXIOS RESPONSE:", response);
console.log("RESPONSE DATA:", response.data);
console.log("TOKEN:", response.data?.token);
console.log("USER:", response.data?.user);
            const {
                token,
                user
            } = response.data;

            if (!token) {
                throw new Error(
                    "JWT token not found in login response"
                );
            }

            if (!user) {
                throw new Error(
                    "User information not found in login response"
                );
            }

            const role = user.userRole;

            if (
                role !== "STUDENT" &&
                role !== "TEACHER"
            ) {
                throw new Error(
                    `Unknown user role: ${role}`
                );
            }

            // Store authentication information
            login(token, user);

            // Navigate according to role
            if (role === "STUDENT") {

                navigate(
                    "/student/dashboard",
                    {
                        replace: true
                    }
                );

            } else if (role === "TEACHER") {

                navigate(
                    "/teacher/dashboard",
                    {
                        replace: true
                    }
                );
            }

        } catch (error) {

            console.error(
                "Login failed:",
                error
            );

            if (error.response?.data?.message) {

                setError(
                    error.response.data.message
                );

            } else if (
                error.response?.status === 401
            ) {

                setError(
                    "Invalid email or password."
                );

            } else if (
                error.message ===
                "JWT token not found in login response"
            ) {

                setError(
                    "Login response did not contain a JWT token."
                );

            } else if (
                error.message ===
                "User information not found in login response"
            ) {

                setError(
                    "Login response did not contain user information."
                );

            } else if (
                error.message?.startsWith(
                    "Unknown user role:"
                )
            ) {

                setError(
                    error.message
                );

            } else {

                setError(
                    "Unable to login. Please try again."
                );
            }

        } finally {

            setLoading(false);
        }
    };

return (
    <div className="min-h-screen bg-slate-50">

        {/* =========================================
            HEADER
        ========================================= */}

        <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">

            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">

                {/* Logo */}

                <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="flex items-center gap-3 text-left"
                >

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white shadow-sm">
                        OE
                    </div>

                    <div>
                        <h1 className="text-base font-bold text-slate-900">
                            Online Examination
                        </h1>

                        <p className="text-xs text-slate-500">
                            Smart Examination Platform
                        </p>
                    </div>

                </button>


                {/* Navigation */}

                <div className="flex items-center gap-3">

                    <button
                        type="button"
                        onClick={() => navigate("/login")}
                        className="
                            rounded-lg
                            px-4 py-2.5
                            text-sm font-semibold
                            text-slate-700
                            transition
                            hover:bg-slate-100
                        "
                    >
                        Login
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/register")}
                        className="
                            rounded-lg
                            bg-blue-600
                            px-4 py-2.5
                            text-sm font-semibold
                            text-white
                            shadow-sm
                            transition
                            hover:bg-blue-700
                        "
                    >
                        Register
                    </button>

                </div>

            </div>

        </header>


        {/* =========================================
            LOGIN AREA
        ========================================= */}

        <main className="flex min-h-[calc(100vh-73px)] items-center justify-center px-4 py-12 sm:px-6">

            <div className="w-full max-w-md">

                {/* Login Card */}

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8">


                    {/* Card Header */}

                    <div className="mb-8 text-center">

                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-lg font-bold text-blue-600">
                            OE
                        </div>

                        <h1 className="text-2xl font-bold text-slate-900">
                            Welcome Back
                        </h1>

                        <p className="mt-2 text-sm text-slate-500">
                            Sign in to your account
                        </p>

                    </div>


                    {/* Error */}

                    {error && (

                        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {error}
                        </div>

                    )}


                    {/* Login Form */}

                    <form onSubmit={handleSubmit} className="space-y-5">


                        {/* Email */}

                        <div>

                            <label
                                htmlFor="email"
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                Email
                            </label>

                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                required
                                autoComplete="email"
                                className="
                                    w-full
                                    rounded-lg
                                    border border-slate-300
                                    bg-white
                                    px-4 py-3
                                    text-sm text-slate-900
                                    outline-none
                                    transition
                                    placeholder:text-slate-400
                                    focus:border-blue-500
                                    focus:ring-2
                                    focus:ring-blue-100
                                "
                            />

                        </div>


                        {/* Password */}

                        <div>

                            <label
                                htmlFor="password"
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                Password
                            </label>

                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                required
                                autoComplete="current-password"
                                className="
                                    w-full
                                    rounded-lg
                                    border border-slate-300
                                    bg-white
                                    px-4 py-3
                                    text-sm text-slate-900
                                    outline-none
                                    transition
                                    placeholder:text-slate-400
                                    focus:border-blue-500
                                    focus:ring-2
                                    focus:ring-blue-100
                                "
                            />

                        </div>


                        {/* Submit */}

                        <button
                            type="submit"
                            disabled={loading}
                            className="
                                w-full
                                rounded-lg
                                bg-blue-600
                                px-4 py-3
                                text-sm font-semibold
                                text-white
                                shadow-sm
                                transition
                                hover:bg-blue-700
                                disabled:cursor-not-allowed
                                disabled:opacity-60
                            "
                        >
                            {loading
                                ? "Signing in..."
                                : "Sign In"}
                        </button>

                    </form>


                    {/* Footer */}

                    <div className="mt-6 border-t border-slate-100 pt-6 text-center">

                        <p className="text-sm text-slate-500">

                            Don't have an account?{" "}

                            <Link
                                to="/register"
                                className="font-semibold text-blue-600 hover:text-blue-700"
                            >
                                Create an account
                            </Link>

                        </p>

                    </div>

                </div>


                {/* Small footer text */}

                <p className="mt-6 text-center text-xs text-slate-400">
                    Secure online examinations made simple.
                </p>

            </div>

        </main>

    </div>
);
};

export default Login;