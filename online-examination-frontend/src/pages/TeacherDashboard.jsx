import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import axios from "axios";

import { useAuth } from "../context/AuthContext";


const TeacherDashboard = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const {
        user,
        logout
    } = useAuth();


    // ========================================
    // STATE
    // ========================================

    const [exams, setExams] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [examExpiredMessage, setExamExpiredMessage] =
        useState(false);


    // ========================================
    // EXAM EXPIRED MESSAGE
    // ========================================

    useEffect(() => {

        if (location.state?.examExpired) {

            setExamExpiredMessage(true);

            const timer = setTimeout(() => {

                setExamExpiredMessage(false);

            }, 4000);


            // Remove navigation state
            // so refresh doesn't show message again

            window.history.replaceState(
                {},
                document.title,
                window.location.pathname
            );


            return () => clearTimeout(timer);

        }

    }, [location]);


    // ========================================
    // LOAD EXAMS
    // ========================================

    useEffect(() => {

        const fetchExams = async () => {

            try {

                setLoading(true);
                setError("");


                const token =
                    localStorage.getItem("token");


                // --------------------------------
                // NO TOKEN
                // --------------------------------

                if (!token) {

                    logout();

                    navigate(
                        "/login",
                        {
                            replace: true
                        }
                    );

                    return;
                }


                // --------------------------------
                // FETCH EXAMS
                // --------------------------------

                const response =
                    await axios.get(
                        "http://localhost:8080/api/exams",
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`
                            }
                        }
                    );


                setExams(
                    Array.isArray(response.data)
                        ? response.data
                        : []
                );


            } catch (error) {

                console.error(
                    "Failed to fetch exams:",
                    error
                );


                const status =
                    error.response?.status;


                // ==================================
                // SESSION EXPIRED / INVALID TOKEN
                // ==================================

                if (
                    status === 401 ||
                    status === 403
                ) {

                    logout();

                    navigate(
                        "/login",
                        {
                            replace: true
                        }
                    );

                    return;
                }


                // ==================================
                // OTHER ERROR
                // ==================================

                setError(
                    error.response?.data?.message ||
                    "Unable to load exams."
                );


            } finally {

                setLoading(false);

            }

        };


        fetchExams();

    }, [navigate, logout]);


    // ========================================
    // STATISTICS
    // ========================================

    const totalExams =
        exams.length;


    const publishedExams =
        exams.filter(
            exam =>
                exam.examStatus === "PUBLISHED"
        ).length;


    const draftExams =
        exams.filter(
            exam =>
                exam.examStatus === "DRAFT"
        ).length;


    const completedExams =
        exams.filter(
            exam =>
                exam.examStatus === "COMPLETED"
        ).length;


    // ========================================
    // DATE FORMAT
    // ========================================

    const formatDateTime = (dateTime) => {

        if (!dateTime) {

            return "N/A";

        }

        return new Date(
            dateTime
        ).toLocaleString();

    };


    // ========================================
    // LOGOUT
    // ========================================

    const handleLogout = () => {

        logout();

        navigate(
            "/login",
            {
                replace: true
            }
        );

    };


    // ========================================
    // STATUS STYLE
    // ========================================

    const getStatusStyle = (status) => {

        switch (status) {

            case "PUBLISHED":

                return "bg-green-100 text-green-700";


            case "DRAFT":

                return "bg-yellow-100 text-yellow-700";


            case "COMPLETED":

                return "bg-blue-100 text-blue-700";


            case "EXPIRED":

                return "bg-red-100 text-red-700";


            default:

                return "bg-slate-100 text-slate-600";

        }

    };


    // ========================================
    // UI
    // ========================================

    return (

        <div className="min-h-screen bg-slate-100 flex">


            {/* ================================================= */}
            {/* SIDEBAR */}
            {/* ================================================= */}

            <aside className="w-64 bg-slate-900 text-white flex flex-col">


                {/* Logo */}

                <div className="px-6 py-5 border-b border-slate-700">

                    <h1 className="text-xl font-bold">
                        Online Examination
                    </h1>

                    <p className="text-xs text-slate-400 mt-1">
                        Teacher Panel
                    </p>

                </div>


                {/* Navigation */}

                <nav className="flex-1 px-4 py-6 space-y-2">


                    {/* Dashboard */}

                    <button
                        onClick={() =>
                            navigate("/teacher/dashboard")
                        }
                        className="
                            w-full flex items-center gap-3
                            px-4 py-3
                            rounded-lg
                            bg-slate-700
                            text-white
                            font-medium
                            text-left
                        "
                    >

                        <span>🏠</span>

                        Dashboard

                    </button>


                    {/* My Exams */}

                    <button
                        onClick={() =>
                            navigate("/teacher/exams")
                        }
                        className="
                            w-full flex items-center gap-3
                            px-4 py-3
                            rounded-lg
                            text-slate-300
                            hover:bg-slate-800
                            hover:text-white
                            transition
                            text-left
                        "
                    >

                        <span>📝</span>

                        My Exams

                    </button>


                    {/* Create Exam */}

                    <button
                        onClick={() =>
                            navigate("/teacher/create-exam")
                        }
                        className="
                            w-full flex items-center gap-3
                            px-4 py-3
                            rounded-lg
                            text-slate-300
                            hover:bg-slate-800
                            hover:text-white
                            transition
                            text-left
                        "
                    >

                        <span>➕</span>

                        Create Exam

                    </button>


                    {/* Questions */}

                    <button
                        onClick={() =>
                            navigate("/teacher/questions")
                        }
                        className="
                            w-full flex items-center gap-3
                            px-4 py-3
                            rounded-lg
                            text-slate-300
                            hover:bg-slate-800
                            hover:text-white
                            transition
                            text-left
                        "
                    >

                        <span>❓</span>

                        Questions

                    </button>


                    {/* Results */}

                    <button
                        onClick={() =>
                            navigate("/teacher/results")
                        }
                        className="
                            w-full flex items-center gap-3
                            px-4 py-3
                            rounded-lg
                            text-slate-300
                            hover:bg-slate-800
                            hover:text-white
                            transition
                            text-left
                        "
                    >

                        <span>📊</span>

                        Results

                    </button>


                    {/* Students */}

                    <button
                        onClick={() =>
                            navigate("/teacher/students")
                        }
                        className="
                            w-full flex items-center gap-3
                            px-4 py-3
                            rounded-lg
                            text-slate-300
                            hover:bg-slate-800
                            hover:text-white
                            transition
                            text-left
                        "
                    >

                        <span>👥</span>

                        Students

                    </button>
                    <button
                        onClick={() => navigate("/teacher/subjects")}
                        className="
                            w-full flex items-center gap-3
                            px-4 py-3
                            rounded-lg
                            text-slate-300
                            hover:bg-slate-800
                            hover:text-white
                            transition
                            text-left
                        "
                    >
                        <span>📚</span>
                        Subjects
                    </button>


                    {/* Profile */}

                    <button
                        onClick={() =>
                            navigate("/teacher/profile")
                        }
                        className="
                            w-full flex items-center gap-3
                            px-4 py-3
                            rounded-lg
                            text-slate-300
                            hover:bg-slate-800
                            hover:text-white
                            transition
                            text-left
                        "
                    >

                        <span>👤</span>

                        Profile

                    </button>

                </nav>


                {/* Logout */}

                <div className="px-4 py-5 border-t border-slate-700">

                    <button
                        onClick={handleLogout}
                        className="
                            w-full flex items-center gap-3
                            px-4 py-3
                            rounded-lg
                            text-slate-300
                            hover:bg-red-600
                            hover:text-white
                            transition
                            text-left
                        "
                    >

                        <span>🚪</span>

                        Logout

                    </button>

                </div>

            </aside>


            {/* ================================================= */}
            {/* MAIN CONTENT */}
            {/* ================================================= */}

            <main className="flex-1 p-8">


                {/* Header */}

                <div className="mb-8 flex items-center justify-between gap-6">


                    {/* Left — Dashboard heading */}

                    <div className="flex-1">

                        <h2 className="text-3xl font-bold text-slate-800">
                            Teacher Dashboard
                        </h2>

                        <p className="mt-2 text-slate-500">
                            Manage your exams, questions and student results.
                        </p>

                    </div>


                    {/* Right — Teacher Greeting */}

                    <div className="flex-1 text-right">

                        <p className="text-sm font-medium text-slate-500">
                            Welcome back 👋
                        </p>

                        <p className="mt-1 text-3xl font-bold text-slate-800">
                            {user?.fullName || "Teacher"}
                        </p>

                        <p className="mt-1 text-sm text-slate-400">
                            Ready to manage your exams?
                        </p>

                    </div>

                </div>


                {/* ================================================= */}
                {/* EXPIRED MESSAGE */}
                {/* ================================================= */}

                {examExpiredMessage && (

                    <div className="
                        mb-6
                        rounded-lg
                        border border-red-200
                        bg-red-50
                        px-4 py-3
                        text-red-700
                    ">

                        <p className="font-medium">
                            Exam expired
                        </p>

                        <p className="text-sm">
                            You cannot start this exam because the exam window has ended.
                        </p>

                    </div>

                )}


                {/* ================================================= */}
                {/* ERROR */}
                {/* ================================================= */}

                {error && (

                    <div
                        className="
                            mb-6
                            rounded-lg
                            border border-red-200
                            bg-red-50
                            px-4 py-3
                            text-sm
                            text-red-700
                        "
                    >

                        {error}

                    </div>

                )}


                {/* ================================================= */}
                {/* STAT CARDS */}
                {/* ================================================= */}

                <div
                    className="
                        grid
                        grid-cols-1
                        sm:grid-cols-2
                        xl:grid-cols-4
                        gap-5
                    "
                >


                    {/* Total */}

                    <div
                        className="
                            bg-white
                            rounded-xl
                            p-5
                            shadow-sm
                            border border-slate-200
                        "
                    >

                        <p className="text-sm text-slate-500">
                            Total Exams
                        </p>

                        <p className="mt-2 text-3xl font-bold text-slate-800">
                            {loading ? "..." : totalExams}
                        </p>

                    </div>


                    {/* Published */}

                    <div
                        className="
                            bg-white
                            rounded-xl
                            p-5
                            shadow-sm
                            border border-slate-200
                        "
                    >

                        <p className="text-sm text-slate-500">
                            Published Exams
                        </p>

                        <p className="mt-2 text-3xl font-bold text-slate-800">
                            {loading ? "..." : publishedExams}
                        </p>

                    </div>


                    {/* Draft */}

                    <div
                        className="
                            bg-white
                            rounded-xl
                            p-5
                            shadow-sm
                            border border-slate-200
                        "
                    >

                        <p className="text-sm text-slate-500">
                            Draft Exams
                        </p>

                        <p className="mt-2 text-3xl font-bold text-slate-800">
                            {loading ? "..." : draftExams}
                        </p>

                    </div>


                    {/* Completed */}

                    <div
                        className="
                            bg-white
                            rounded-xl
                            p-5
                            shadow-sm
                            border border-slate-200
                        "
                    >

                        <p className="text-sm text-slate-500">
                            Completed Exams
                        </p>

                        <p className="mt-2 text-3xl font-bold text-slate-800">
                            {loading ? "..." : completedExams}
                        </p>

                    </div>

                </div>


                {/* ================================================= */}
                {/* RECENT EXAMS */}
                {/* ================================================= */}

                <div
                    className="
                        mt-8
                        bg-white
                        rounded-xl
                        shadow-sm
                        border border-slate-200
                        overflow-hidden
                    "
                >


                    {/* Section Header */}

                    <div
                        className="
                            px-6 py-5
                            border-b border-slate-200
                            flex
                            items-center
                            justify-between
                        "
                    >

                        <div>

                            <h3 className="text-lg font-semibold text-slate-800">
                                Recent Exams
                            </h3>

                            <p className="text-sm text-slate-500 mt-1">
                                Exams available in the system.
                            </p>

                        </div>


                        <button
                            onClick={() =>
                                navigate("/teacher/create-exam")
                            }
                            className="
                                px-4 py-2
                                bg-slate-900
                                text-white
                                rounded-lg
                                text-sm
                                font-medium
                                hover:bg-slate-800
                                transition
                            "
                        >

                            + Create Exam

                        </button>

                    </div>


                    {/* Loading */}

                    {loading && (

                        <div className="px-6 py-12 text-center">

                            <p className="text-slate-500">
                                Loading exams...
                            </p>

                        </div>

                    )}


                    {/* Empty */}

                    {!loading &&
                        exams.length === 0 && (

                            <div className="px-6 py-12 text-center">

                                <div className="text-4xl mb-3">
                                    📝
                                </div>

                                <h4 className="text-lg font-semibold text-slate-700">
                                    No exams yet
                                </h4>

                                <p className="text-sm text-slate-500 mt-1">
                                    Create your first exam to get started.
                                </p>

                            </div>

                        )}


                    {/* EXAM LIST */}

                    {!loading &&
                        exams.length > 0 && (

                            <div className="divide-y divide-slate-200">

                                {exams.map((exam) => (

                                    <div
                                        key={exam.examId}
                                        className="
                                            px-6 py-5
                                            hover:bg-slate-50
                                            transition
                                        "
                                    >

                                        <div
                                            className="
                                                flex
                                                flex-col
                                                lg:flex-row
                                                lg:items-center
                                                lg:justify-between
                                                gap-5
                                            "
                                        >


                                            {/* Exam Information */}

                                            <div className="min-w-0">

                                                <div className="flex items-center gap-3 flex-wrap">

                                                    <h4
                                                        className="
                                                            text-lg
                                                            font-semibold
                                                            text-slate-800
                                                        "
                                                    >
                                                        {exam.title}
                                                    </h4>


                                                    {exam.examStatus && (

                                                        <span
                                                            className={`
                                                                px-2.5
                                                                py-1
                                                                rounded-full
                                                                text-xs
                                                                font-semibold
                                                                ${getStatusStyle(
                                                                    exam.examStatus
                                                                )}
                                                            `}
                                                        >

                                                            {exam.examStatus}

                                                        </span>

                                                    )}

                                                </div>


                                                <p className="mt-1 text-sm text-slate-500">

                                                    {exam.subjectCode || "N/A"}

                                                    {exam.subjectName && (
                                                        <>
                                                            {" • "}
                                                            {exam.subjectName}
                                                        </>
                                                    )}

                                                </p>

                                            </div>


                                            {/* Exam Details */}

                                            <div
                                                className="
                                                    grid
                                                    grid-cols-1
                                                    sm:grid-cols-3
                                                    gap-3
                                                    lg:min-w-[550px]
                                                "
                                            >


                                                {/* Duration */}

                                                <div className="rounded-lg bg-slate-50 p-3">

                                                    <p className="text-xs text-slate-500">
                                                        Duration
                                                    </p>

                                                    <p className="mt-1 text-sm font-semibold text-slate-700">

                                                        {exam.durationMinutes
                                                            ? `${exam.durationMinutes} minutes`
                                                            : "N/A"
                                                        }

                                                    </p>

                                                </div>


                                                {/* Starts */}

                                                <div className="rounded-lg bg-slate-50 p-3">

                                                    <p className="text-xs text-slate-500">
                                                        Starts
                                                    </p>

                                                    <p className="mt-1 text-sm font-semibold text-slate-700">

                                                        {formatDateTime(
                                                            exam.startAt
                                                        )}

                                                    </p>

                                                </div>


                                                {/* Ends */}

                                                <div className="rounded-lg bg-slate-50 p-3">

                                                    <p className="text-xs text-slate-500">
                                                        Ends
                                                    </p>

                                                    <p className="mt-1 text-sm font-semibold text-slate-700">

                                                        {formatDateTime(
                                                            exam.endAt
                                                        )}

                                                    </p>

                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                ))}

                            </div>

                        )}

                </div>

            </main>

        </div>

    );

};


export default TeacherDashboard;