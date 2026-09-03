import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";

import { useAuth } from "../../context/AuthContext";


const TeacherQuestions = () => {

    const navigate = useNavigate();

    const {
        user,
        logout
    } = useAuth();


    // ========================================
    // STATE
    // ========================================

    const [questions, setQuestions] = useState([]);

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
    // LOAD QUESTIONS
    // ========================================

    useEffect(() => {

        const fetchQuestions = async () => {

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
                // FETCH QUESTIONS
                // --------------------------------

                const response =
                    await axios.get(
                        "http://localhost:8080/api/questions",
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`
                            }
                        }
                    );


                console.log(
                    "Questions API response:",
                    response
                );

                console.log(
                    "Questions:",
                    response.data
                );


                setQuestions(
                    Array.isArray(response.data)
                        ? response.data
                        : []
                );


            } catch (error) {

                console.error(
                    "Failed to fetch questions:",
                    error
                );


                const status =
                    error.response?.status;


                // --------------------------------
                // SESSION EXPIRED / UNAUTHORIZED
                // --------------------------------

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


                // --------------------------------
                // OTHER ERROR
                // --------------------------------

                setError(
                    error.response?.data?.message ||
                    "Unable to load questions."
                );


            } finally {

                setLoading(false);

            }

        };


        fetchQuestions();

    }, [navigate, logout]);


    // ========================================
    // LOADING
    // ========================================

    if (loading) {

        return (

            <div className="min-h-screen bg-slate-100 flex">

                {/* Sidebar */}

                <aside className="w-64 bg-slate-900 text-white flex flex-col">

                    <div className="px-6 py-6 border-b border-slate-800">

                        <h1 className="text-xl font-bold">
                            Online Examination
                        </h1>

                        <p className="mt-1 text-sm text-slate-400">
                            Teacher Panel
                        </p>

                    </div>

                </aside>


                {/* Loading */}

                <main className="flex-1 flex items-center justify-center">

                    <div className="text-center">

                        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-slate-800" />

                        <p className="mt-4 text-sm text-slate-500">
                            Loading questions...
                        </p>

                    </div>

                </main>

            </div>

        );

    }


    // ========================================
    // MAIN UI
    // ========================================

    return (

        <div className="min-h-screen bg-slate-100 flex">


            {/* =================================================
                SIDEBAR
            ================================================= */}

            <aside className="w-64 bg-slate-900 text-white flex flex-col">


                {/* Logo */}

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
                        type="button"
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
                        type="button"
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
                        type="button"
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
                        type="button"
                        onClick={() =>
                            navigate("/teacher/questions")
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

                        <span>❓</span>

                        Questions

                    </button>


                    {/* Results */}

                    <button
                        type="button"
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
                        type="button"
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
                        type="button"
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


            {/* =================================================
                MAIN CONTENT
            ================================================= */}

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
                            Question Bank
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Create and manage questions for your exams.
                        </p>

                    </div>


                    {/* Teacher */}

                    <div className="text-right">

                        <p className="text-sm text-slate-500">
                            Welcome back,
                        </p>

                        <p className="text-lg font-semibold text-slate-800">
                            {user?.fullName || "Teacher"}
                        </p>

                    </div>

                </header>


                {/* =================================================
                    PAGE CONTENT
                ================================================= */}

                <section className="p-8">


                    {/* Top section */}

                    <div className="flex items-center justify-between mb-6">

                        <div>

                            <h3 className="text-xl font-semibold text-slate-800">
                                Your Questions
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                                Manage questions from your question bank.
                            </p>

                        </div>


                        {/* <button
                            type="button"
                            onClick={() =>{
                                    console.log("Exam:", exam);
    console.log("Exam ID:", exam.examId);

    navigate(`/teacher/exams/${exam.examId}/questions/create`);}

                                // navigate(`/teacher/exams/${exam.examId}/questions/create`
                                // )
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

                            + Add Question

                        </button> */}

                    </div>


                    {/* =================================================
                        ERROR
                    ================================================= */}

                    {error && (

                        <div
                            className="
                                mb-6
                                rounded-xl
                                border border-red-200
                                bg-red-50
                                p-4
                            "
                        >

                            <p className="text-sm font-semibold text-red-800">
                                Something went wrong
                            </p>

                            <p className="mt-1 text-sm text-red-700">
                                {error}
                            </p>

                        </div>

                    )}


                    {/* =================================================
                        SEARCH / FILTER
                    ================================================= */}

                    <div
                        className="
                            bg-white
                            rounded-xl
                            border border-slate-200
                            p-5
                            mb-6
                            shadow-sm
                        "
                    >

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">


                            {/* Subject */}

                            <div>

                                <label
                                    className="
                                        block
                                        text-sm
                                        font-medium
                                        text-slate-700
                                        mb-2
                                    "
                                >
                                    Subject Code
                                </label>

                                <select
                                    className="
                                        w-full
                                        rounded-lg
                                        border border-slate-300
                                        bg-white
                                        px-3 py-2.5
                                        text-sm
                                        text-slate-700
                                        outline-none
                                        focus:border-slate-500
                                        focus:ring-2
                                        focus:ring-slate-200
                                    "
                                >

                                    <option value="">
                                        All Subjects
                                    </option>

                                    <option value="CS101">
                                        CS101
                                    </option>

                                    <option value="CS102">
                                        CS102
                                    </option>

                                </select>

                            </div>


                            {/* Search */}

                            <div>

                                <label
                                    className="
                                        block
                                        text-sm
                                        font-medium
                                        text-slate-700
                                        mb-2
                                    "
                                >
                                    Search Question
                                </label>

                                <input
                                    type="text"
                                    placeholder="Search by question text..."
                                    className="
                                        w-full
                                        rounded-lg
                                        border border-slate-300
                                        px-3 py-2.5
                                        text-sm
                                        outline-none
                                        focus:border-slate-500
                                        focus:ring-2
                                        focus:ring-slate-200
                                    "
                                />

                            </div>


                            {/* Type */}

                            <div>

                                <label
                                    className="
                                        block
                                        text-sm
                                        font-medium
                                        text-slate-700
                                        mb-2
                                    "
                                >
                                    Question Type
                                </label>

                                <select
                                    className="
                                        w-full
                                        rounded-lg
                                        border border-slate-300
                                        bg-white
                                        px-3 py-2.5
                                        text-sm
                                        text-slate-700
                                        outline-none
                                        focus:border-slate-500
                                        focus:ring-2
                                        focus:ring-slate-200
                                    "
                                >

                                    <option value="">
                                        All Types
                                    </option>

                                    <option value="MCQ">
                                        MCQ
                                    </option>

                                    <option value="TRUE_FALSE">
                                        True / False
                                    </option>

                                </select>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        QUESTION LIST
                    ================================================= */}

                    <div className="space-y-4">

                        {questions.map(
                            (question) => (

                                <div
                                    key={question.questionId}
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

                                    <div className="flex items-start justify-between gap-6">


                                        {/* Question details */}

                                        <div className="flex-1">


                                            {/* Tags */}

                                            <div className="flex items-center gap-3 mb-3">

                                                <span
                                                    className="
                                                        inline-flex
                                                        items-center
                                                        rounded-md
                                                        bg-slate-100
                                                        px-2.5 py-1
                                                        text-xs
                                                        font-semibold
                                                        text-slate-600
                                                    "
                                                >
                                                    Question #
                                                    {question.questionId}
                                                </span>


                                                <span
                                                    className="
                                                        inline-flex
                                                        items-center
                                                        rounded-md
                                                        bg-blue-50
                                                        px-2.5 py-1
                                                        text-xs
                                                        font-semibold
                                                        text-blue-700
                                                    "
                                                >
                                                    {question.subjectCode || "EXAM"}
                                                </span>

                                            </div>


                                            {/* Question */}

                                            <p className="text-base font-medium text-slate-800">
                                                {question.questionText}
                                            </p>


                                            {/* Metadata */}

                                            <div
                                                className="
                                                    mt-4
                                                    flex
                                                    items-center
                                                    gap-5
                                                    text-sm
                                                    text-slate-500
                                                "
                                            >

                                                <span>

                                                    Type:

                                                    <span className="ml-1 font-medium text-slate-700">
                                                        {question.questionType || "MCQ"}
                                                    </span>

                                                </span>


                                                <span>

                                                    Marks:

                                                    <span className="ml-1 font-medium text-slate-700">
                                                        {question.marks}
                                                    </span>

                                                </span>

                                            </div>

                                        </div>


                                        {/* Actions */}

                                        <div className="flex items-center gap-2">

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    navigate(
                                                        `/teacher/questions/edit/${question.questionId}`
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

                                </div>

                            )
                        )}

                    </div>


                    {/* =================================================
                        EMPTY STATE
                    ================================================= */}

                    {questions.length === 0 && !error && (

                        <div
                            className="
                                bg-white
                                rounded-xl
                                border border-slate-200
                                p-12
                                text-center
                            "
                        >

                            <div className="text-4xl mb-4">
                                ❓
                            </div>

                            <h3 className="text-lg font-semibold text-slate-800">
                                No questions found
                            </h3>

                            <p className="mt-2 text-sm text-slate-500">
                                Create your first question to add it to the question bank.
                            </p>

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/teacher/questions/create"
                                    )
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
                                + Add Question
                            </button>

                        </div>

                    )}

                </section>

            </main>

        </div>

    );

};


export default TeacherQuestions;