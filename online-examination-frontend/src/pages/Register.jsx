import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { registerUser } from "../api/authApi";

const Register = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");
        setLoading(true);

        try {
            await registerUser(formData);

            setSuccess(
                "Registration successful. Redirecting to login..."
            );

            setTimeout(() => {
                navigate("/login", {
                    replace: true
                });
            }, 1200);

        } catch (error) {
            console.error("Registration failed:", error);

            if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else if (error.response?.status === 409) {
                setError("An account with this email already exists.");
            } else {
                setError(
                    "Unable to register. Please check your details and try again."
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
            REGISTRATION AREA
        ========================================= */}

        <main className="flex min-h-[calc(100vh-81px)] items-center justify-center px-4 py-10">

            <div className="auth-card">

                <div className="auth-header">

                    <h1>
                        Create Account
                    </h1>

                    <p>
                        Register for the Online Examination System
                    </p>

                </div>


                {/* Error */}

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}


                {/* Success */}

                {success && (
                    <div className="success-message">
                        {success}
                    </div>
                )}


                {/* Form */}

                <form onSubmit={handleSubmit}>

                    <div className="form-group">

                        <label htmlFor="fullName">
                            Full Name
                        </label>

                        <input
                            id="fullName"
                            name="fullName"
                            type="text"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            required
                            maxLength={100}
                            autoComplete="name"
                        />

                    </div>


                    <div className="form-group">

                        <label htmlFor="email">
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
                        />

                    </div>


                    <div className="form-group">

                        <label htmlFor="password">
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
                            minLength={6}
                            autoComplete="new-password"
                        />

                    </div>


                    <button
                        type="submit"
                        className="primary-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Creating Account..."
                            : "Create Account"}
                    </button>

                </form>


                {/* Footer */}

                <div className="auth-footer">

                    <span>
                        Already have an account?
                    </span>

                    <Link to="/login">
                        Sign In
                    </Link>

                </div>

            </div>

        </main>

    </div>
);
};

export default Register;