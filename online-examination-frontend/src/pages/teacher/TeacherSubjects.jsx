import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";

import { useAuth } from "../../context/AuthContext";


const TeacherSubject = () => {

    const navigate = useNavigate();

    const {
        user,
        logout
    } = useAuth();


    // ========================================
    // STATE
    // ========================================

    const [subjects, setSubjects] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


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
    // LOAD SUBJECTS
    // ========================================

    useEffect(() => {

        const fetchSubjects = async () => {

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
                // FETCH SUBJECTS
                // --------------------------------

                const response = await axios.get(
                    "http://localhost:8080/api/subjects",
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );


                console.log(
                    "Subjects API response:",
                    response
                );

                console.log(
                    "Subjects:",
                    response.data
                );


                setSubjects(
                    Array.isArray(response.data)
                        ? response.data
                        : []
                );


            } catch (error) {

                console.error(
                    "Failed to fetch subjects:",
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
                    "Unable to load subjects."
                );


            } finally {

                setLoading(false);

            }

        };


        fetchSubjects();

    }, [navigate, logout]);


    // ========================================
    // TEACHER NAME
    // ========================================

    const teacherName =
        user?.fullName ||
        user?.name ||
        "Teacher";


    // ========================================
    // RENDER
    // ========================================

    return (

        <div className="min-h-screen bg-slate-100 flex">


            {/* ================================================= */}
            {/* SIDEBAR */}
            {/* ================================================= */}

            <aside className="w-64 bg-slate-900 text-white flex flex-col">


                {/* Logo / Title */}

                <div className="px-6 py-6 border-b border-slate-800">

                    <h1 className="text-xl font-bold">
                        Online Examination
                    </h1>

                    <p className="mt-1 text-sm text-slate-400">
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
                            text-slate-300
                            hover:bg-slate-800
                            hover:text-white
                            transition
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


                    {/* Subjects */}

                    <button
                        onClick={() =>
                            navigate("/teacher/subjects")
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

                        <span>📚</span>

                        Subjects

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

                <div className="px-4 py-5 border-t border-slate-800">

                    <button
                        type="button"
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

            <main className="flex-1">


                {/* Header */}

                <header
                    className="
                        bg-white
                        border-b border-slate-200
                        px-8 py-5
                        flex items-center justify-between
                    "
                >

                    <div>

                        <h2 className="text-2xl font-bold text-slate-800">
                            Subjects
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            View and manage examination subjects.
                        </p>

                    </div>


                    {/* Teacher greeting */}

                    <div className="text-right">

                        <p className="text-sm text-slate-500">
                            Welcome back,
                        </p>

                        <p className="text-lg font-semibold text-slate-800">
                            {teacherName}
                        </p>

                    </div>

                </header>


                {/* ================================================= */}
                {/* PAGE CONTENT */}
                {/* ================================================= */}

                <section className="p-8">


                    {/* Top section */}

                    <div className="flex items-center justify-between mb-6">

                        <div>

                            <h3 className="text-xl font-semibold text-slate-800">
                                Subject List
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                                All subjects available in the examination system.
                            </p>

                        </div>


                        {/* Add Subject */}

                        <button
                            onClick={() =>
                                navigate("/teacher/subjects/create")
                            }
                            className="
                                rounded-lg
                                bg-slate-800
                                px-5 py-3
                                text-sm font-semibold
                                text-white
                                shadow-sm
                                transition
                                hover:bg-slate-700
                            "
                        >

                            + Add Subject

                        </button>

                    </div>


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
                                px-5 py-4
                                text-sm
                                text-red-700
                            "
                        >

                            {error}

                        </div>

                    )}


                    {/* ================================================= */}
                    {/* LOADING */}
                    {/* ================================================= */}

                    {loading && (

                        <div
                            className="
                                rounded-xl
                                border border-slate-200
                                bg-white
                                p-12
                                text-center
                                shadow-sm
                            "
                        >

                            <p className="text-sm text-slate-500">
                                Loading subjects...
                            </p>

                        </div>

                    )}


                    {/* ================================================= */}
                    {/* SUBJECT LIST */}
                    {/* ================================================= */}

                    {!loading && subjects.length > 0 && (

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

                            {subjects.map((subject) => (

                                <div
                                    key={subject.subjectId}
                                    className="
                                        bg-white
                                        rounded-xl
                                        border border-slate-200
                                        p-6
                                        shadow-sm
                                        hover:shadow-md
                                        transition
                                    "
                                >

                                    {/* Subject Code */}

                                    <div className="flex items-center justify-between">

                                        <span
                                            className="
                                                inline-flex
                                                items-center
                                                rounded-md
                                                bg-blue-50
                                                px-3 py-1
                                                text-sm
                                                font-semibold
                                                text-blue-700
                                            "
                                        >
                                            {subject.subjectCode}
                                        </span>


                                        <span className="text-xs text-slate-400">
                                            ID: {subject.subjectId}
                                        </span>

                                    </div>


                                    {/* Subject Name */}

                                    <h3
                                        className="
                                            mt-5
                                            text-lg
                                            font-semibold
                                            text-slate-800
                                        "
                                    >
                                        {subject.subjectName}
                                    </h3>


                                    {/* Actions */}

                                    <div className="mt-6 flex gap-2">

                                        <button
                                            onClick={() =>
                                                navigate(
                                                    `/teacher/subjects/edit/${subject.subjectId}`
                                                )
                                            }
                                            className="
                                                rounded-lg
                                                border border-slate-300
                                                px-4 py-2
                                                text-sm
                                                font-medium
                                                text-slate-700
                                                hover:bg-slate-50
                                                transition
                                            "
                                        >
                                            Edit
                                        </button>


                                        <button
                                            type="button"
                                            className="
                                                rounded-lg
                                                border border-red-200
                                                px-4 py-2
                                                text-sm
                                                font-medium
                                                text-red-600
                                                hover:bg-red-50
                                                transition
                                            "
                                        >
                                            Delete
                                        </button>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}


                    {/* ================================================= */}
                    {/* EMPTY STATE */}
                    {/* ================================================= */}

                    {!loading && subjects.length === 0 && !error && (

                        <div
                            className="
                                rounded-xl
                                border border-slate-200
                                bg-white
                                p-12
                                text-center
                                shadow-sm
                            "
                        >

                            <div className="text-4xl mb-4">
                                📚
                            </div>

                            <h3 className="text-lg font-semibold text-slate-800">
                                No subjects found
                            </h3>

                            <p className="mt-2 text-sm text-slate-500">
                                Create your first subject to use it in examinations.
                            </p>


                            <button
                                onClick={() =>
                                    navigate("/teacher/subjects/create")
                                }
                                className="
                                    mt-5
                                    rounded-lg
                                    bg-slate-800
                                    px-5 py-2.5
                                    text-sm
                                    font-semibold
                                    text-white
                                    hover:bg-slate-700
                                "
                            >
                                + Add Subject
                            </button>

                        </div>

                    )}

                </section>

            </main>

        </div>
    );
};


export default TeacherSubject;