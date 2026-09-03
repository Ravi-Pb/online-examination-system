import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

import {
    getExams,
    startExam,
    getMyAttempts
} from "../api/examApi";

import { useAuth } from "../context/AuthContext";


const StudentDashboard = () => {

    const navigate = useNavigate();

    const {
        user,
        logout
    } = useAuth();

    const location = useLocation();

const [examExpiredMessage, setExamExpiredMessage] =
    useState(false);

useEffect(() => {

    if (location.state?.examExpired) {

        setExamExpiredMessage(true);

        const timer = setTimeout(() => {
            setExamExpiredMessage(false);
        }, 4000);

        // Remove navigation state so refreshing
        // the dashboard doesn't show it again
        window.history.replaceState(
            {},
            document.title,
            window.location.pathname
        );

        return () => clearTimeout(timer);
    }

}, [location]);


    // ========================================
    // STATE
    // ========================================

    const [exams, setExams] = useState([]);
    const [attempts, setAttempts] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [startingExamId, setStartingExamId] =
        useState(null);


    // ========================================
    // LOAD DASHBOARD
    // ========================================

    useEffect(() => {

        loadDashboard();

    }, []);


    const loadDashboard = async () => {

        try {

            setLoading(true);
            setError("");


            const [
                examsResponse,
                attemptsResponse
            ] = await Promise.all([
                getExams(),
                getMyAttempts()
            ]);


            setExams(
                Array.isArray(examsResponse.data)
                    ? examsResponse.data
                    : []
            );


            setAttempts(
                Array.isArray(attemptsResponse.data)
                    ? attemptsResponse.data
                    : []
            );


        } catch (error) {

            console.error(
                "Failed to load dashboard:",
                error
            );


            if (
                error.response?.status === 401 ||
                error.response?.status === 403
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


            setError(
                error.response?.data?.message ||
                "Unable to load dashboard."
            );


        } finally {

            setLoading(false);

        }
    };


    // ========================================
    // START / RESUME EXAM
    // ========================================

    const handleStartExam = async (examId) => {

    try {

        setStartingExamId(examId);
        setError("");

        const response =
            await startExam(examId);

        const attempt =
            response.data;

        navigate(
            `/exam/${attempt.attemptId}`
        );

    } catch (error) {

        console.error(
            "Failed to start exam:",
            error
        );

        const status = error.response?.status;
        const message = error.response?.data?.message;

        // --------------------------------
        // EXAM EXPIRED
        // --------------------------------
       if (
    status === 403 &&
    message === "This exam has already ended"
) {
    navigate("/dashboard", {
        replace: true,
        state: {
            examExpired: true
        }
    });

    return;
}

        // --------------------------------
        // AUTHENTICATION / AUTHORIZATION
        // --------------------------------
        if (
            status === 401 ||
            status === 403
        ) {

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
            message ||
            "Unable to start the exam."
        );

    } finally {

        setStartingExamId(null);

    }
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
    // FILTER ATTEMPTS
    // ========================================

    const inProgressAttempts =
        attempts.filter(
            (attempt) =>
                String(
                    attempt.attemptStatus || ""
                ).toUpperCase() ===
                "IN_PROGRESS"
        );


    const completedAttempts =
        attempts.filter(
            (attempt) =>
                String(
                    attempt.attemptStatus || ""
                ).toUpperCase() ===
                "SUBMITTED"
        );


    // ========================================
    // AVAILABLE / PUBLISHED EXAMS
    // ========================================

    const publishedExams =
        exams.filter(
            (exam) =>
                String(
                    exam.examStatus || ""
                ).toUpperCase() ===
                "PUBLISHED"
        );


    // ========================================
    // LOADING SCREEN
    // ========================================

    if (loading) {

        return (

            <div className="min-h-screen bg-slate-50">

                <header className="border-b border-slate-200 bg-white">

                    <div className="mx-auto flex max-w-7xl items-center px-4 py-4 sm:px-6 lg:px-8">

                        <div>

                            <h1 className="text-lg font-bold text-slate-900">
                                Online Examination System
                            </h1>

                            <p className="text-xs text-slate-500">
                                Student Portal
                            </p>

                        </div>

                    </div>

                </header>


                <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

                    <div className="flex min-h-[50vh] items-center justify-center">

                        <div className="text-center">

                            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

                            <p className="mt-4 text-sm text-slate-500">
                                Loading dashboard...
                            </p>

                        </div>

                    </div>

                </main>

            </div>

        );
    }


    // ========================================
    // MAIN DASHBOARD
    // ========================================

    return (

        <div className="min-h-screen bg-slate-50 text-slate-800">
                

            {/* ==================================
                HEADER
            ================================== */}

            <header className="sticky top-0 z-30 border-b border-slate-200 bg-white shadow-sm">

                <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">


                    {/* Brand */}

                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white">
                            OE
                        </div>


                        <div>

                            <h1 className="text-sm font-bold text-slate-900 sm:text-base">
                                Online Examination System
                            </h1>

                            <p className="text-xs text-slate-500">
                                Student Portal
                            </p>

                        </div>

                    </div>


                    {/* User */}

                    <div className="flex items-center gap-3">


                        <div className="hidden items-center gap-3 sm:flex">

                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">

                                {user?.fullName
                                    ?.charAt(0)
                                    ?.toUpperCase() ||
                                    "S"}

                            </div>


                            <div className="leading-tight">

                                <p className="text-sm font-semibold text-slate-900">

                                    {user?.fullName ||
                                        "Student"}

                                </p>

                                <p className="text-xs text-slate-500">
                                    Student
                                </p>

                            </div>

                        </div>


                        <button
                            type="button"
                            onClick={handleLogout}
                            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                            Logout
                        </button>

                    </div>

                </div>

            </header>


            {/* ==================================
                MAIN
            ================================== */}

            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">


                {/* ==================================
                    WELCOME
                ================================== */}

                <section className="mb-8">

                    <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                        Student Dashboard
                    </p>
                     {/* Exam expired message */}
        {examExpiredMessage && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                <p className="font-medium">
                    Exam expired
                </p>

                <p className="text-sm">
                    You cannot start this exam because the exam window has ended.
                </p>
            </div>
        )}

                    <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">

                        Welcome back,{" "}

                        {user?.fullName?.split(" ")[0] ||
                            "Student"}!

                    </h2>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">

                        Manage your examinations, continue
                        in-progress attempts, and review
                        your completed results.

                    </p>

                </section>


                {/* ==================================
                    ERROR
                ================================== */}

                {error && (

                    <div className="mb-6 flex items-start justify-between gap-4 rounded-xl border border-red-200 bg-red-50 p-4">

                        <div>

                            <p className="text-sm font-semibold text-red-800">
                                Something went wrong
                            </p>

                            <p className="mt-1 text-sm text-red-700">
                                {error}
                            </p>

                        </div>


                        <button
                            type="button"
                            onClick={loadDashboard}
                            className="shrink-0 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-red-700 shadow-sm ring-1 ring-red-200 hover:bg-red-50"
                        >
                            Retry
                        </button>

                    </div>

                )}


                {/* ==================================
                    STATISTICS
                ================================== */}

                <section className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">


                    {/* Available */}

                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                        <div className="flex items-center justify-between">

                            <span className="text-2xl">
                                📚
                            </span>

                            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                                Available
                            </span>

                        </div>


                        <p className="mt-5 text-sm text-slate-500">
                            Available Exams
                        </p>

                        <p className="mt-1 text-2xl font-bold text-slate-900">
                            {publishedExams.length}
                        </p>

                    </div>


                    {/* In Progress */}

                    <div className="rounded-xl border border-amber-200 bg-white p-5 shadow-sm">

                        <div className="flex items-center justify-between">

                            <span className="text-2xl">
                                ⏱
                            </span>

                            <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                                Active
                            </span>

                        </div>


                        <p className="mt-5 text-sm text-slate-500">
                            In Progress
                        </p>

                        <p className="mt-1 text-2xl font-bold text-slate-900">
                            {inProgressAttempts.length}
                        </p>

                    </div>


                    {/* Completed */}

                    <div className="rounded-xl border border-emerald-200 bg-white p-5 shadow-sm">

                        <div className="flex items-center justify-between">

                            <span className="text-2xl">
                                ✓
                            </span>

                            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                                Done
                            </span>

                        </div>


                        <p className="mt-5 text-sm text-slate-500">
                            Completed
                        </p>

                        <p className="mt-1 text-2xl font-bold text-slate-900">
                            {completedAttempts.length}
                        </p>

                    </div>


                    {/* Total Attempts */}

                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                        <div className="flex items-center justify-between">

                            <span className="text-2xl">
                                📝
                            </span>

                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                                Total
                            </span>

                        </div>


                        <p className="mt-5 text-sm text-slate-500">
                            Total Attempts
                        </p>

                        <p className="mt-1 text-2xl font-bold text-slate-900">
                            {attempts.length}
                        </p>

                    </div>

                </section>


                {/* ==================================
                    IN PROGRESS
                ================================== */}

                <section className="mb-8">

                    <div className="mb-4">

                        <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">
                            Continue
                        </p>

                        <h2 className="mt-1 text-xl font-bold text-slate-900">
                            In Progress Exams
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Continue an examination you have
                            already started.
                        </p>

                    </div>


                    {inProgressAttempts.length === 0 ? (

                        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center">

                            <p className="text-sm font-medium text-slate-600">
                                No exams are currently in progress.
                            </p>

                        </div>

                    ) : (

                        <div className="grid gap-4 md:grid-cols-2">

                            {inProgressAttempts.map(
                                (attempt) => (

                                    <article
                                        key={
                                            attempt.attemptId
                                        }
                                        className="rounded-xl border border-amber-200 bg-white p-5 shadow-sm"
                                    >

                                        <div className="flex items-start justify-between gap-4">

                                            <div>

                                                <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                                                    IN PROGRESS
                                                </span>

                                                <h3 className="mt-3 text-lg font-semibold text-slate-900">
                                                    {
                                                        attempt.examTitle
                                                    }
                                                </h3>

                                            </div>


                                            <span className="text-xs font-medium text-slate-500">
                                                Attempt #
                                                {
                                                    attempt.attemptNumber
                                                }
                                            </span>

                                        </div>


                                        <div className="mt-5 grid grid-cols-2 gap-3">

                                            <div className="rounded-lg bg-slate-50 p-3">

                                                <p className="text-xs text-slate-500">
                                                    Started
                                                </p>

                                                <p className="mt-1 text-sm font-semibold text-slate-700">
                                                    {
                                                        attempt.startedAt
                                                            ? new Date(
                                                                attempt.startedAt
                                                            ).toLocaleString()
                                                            : "—"
                                                    }
                                                </p>

                                            </div>
                                             {/* Ends */}
                                                <div className="rounded-lg bg-slate-50 p-3">

                                                    <p className="text-xs text-slate-500">
                                                        Ends
                                                    </p>

                                                    <p className="mt-1 text-sm font-semibold text-slate-700">
                                                        {
                                                            attempt.endAt
                                                                ? new Date(
                                                                    attempt.endAt
                                                                ).toLocaleString()
                                                                : "—"
                                                        }
                                                    </p>

                                                </div>



                                            <div className="rounded-lg bg-slate-50 p-3">

                                                <p className="text-xs text-slate-500">
                                                    Status
                                                </p>

                                                <p className="mt-1 text-sm font-semibold text-amber-700">
                                                    In Progress
                                                </p>

                                            </div>

                                        </div>


                                        <button
                                            type="button"
                                            onClick={() =>
                                                navigate(
                                                    `/exam/${attempt.attemptId}`
                                                )
                                            }
                                            className="mt-5 w-full rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-600"
                                        >
                                            Resume Exam →
                                        </button>

                                    </article>

                                )
                            )}

                        </div>

                    )}

                </section>


                {/* ==================================
                    AVAILABLE EXAMS
                ================================== */}

                <section className="mb-8">

                    <div className="mb-5 flex items-end justify-between gap-4">

                        <div>

                            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                                Examinations
                            </p>

                            <h2 className="mt-1 text-xl font-bold text-slate-900">
                                Available Exams
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Choose an examination to begin.
                            </p>

                        </div>


                        <button
                            type="button"
                            onClick={loadDashboard}
                            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                            ↻ Refresh
                        </button>

                    </div>


                    {publishedExams.length === 0 ? (

                        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">

                            <div className="text-4xl">
                                📋
                            </div>

                            <h3 className="mt-4 text-lg font-semibold text-slate-900">
                                No exams available
                            </h3>

                            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                                There are currently no published
                                examinations available to attempt.
                            </p>

                        </div>

                    ) : (

                        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

                            {publishedExams.map(
                                (exam) => {

                                    const isStarting =
                                        startingExamId ===
                                        exam.examId;


                                    return (

                                        <article
                                            key={
                                                exam.examId
                                            }
                                            className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                                        >


                                            {/* Card Header */}

                                            <div className="border-b border-slate-100 p-5">

                                                <div className="flex items-start justify-between gap-3">

                                                    <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
                                                        {
                                                            exam.subjectCode ||
                                                            "EXAM"
                                                        }
                                                    </span>


                                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">

                                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                                                        PUBLISHED

                                                    </span>

                                                </div>


                                                <h3 className="mt-4 text-lg font-bold leading-6 text-slate-900">
                                                    {
                                                        exam.title
                                                    }
                                                </h3>


                                                {exam.subjectName && (

                                                    <p className="mt-1 text-sm font-medium text-slate-500">
                                                        {
                                                            exam.subjectName
                                                        }
                                                    </p>

                                                )}


                                                {exam.examDescription && (

                                                    <p className="mt-3 line-clamp-3 text-sm leading-5 text-slate-500">
                                                        {
                                                            exam.examDescription
                                                        }
                                                    </p>

                                                )}

                                            </div>


                                            {/* Metadata */}

                                            <div className="grid grid-cols-2 gap-3 p-5">

                                                {exam.durationMinutes && (

                                                    <div className="rounded-lg bg-slate-50 p-3">

                                                        <p className="text-xs text-slate-500">
                                                            Duration
                                                        </p>

                                                        <p className="mt-1 text-sm font-semibold text-slate-800">
                                                            {
                                                                exam.durationMinutes
                                                            }{" "}
                                                            min
                                                        </p>

                                                    </div>

                                                )}


                                                <div className="rounded-lg bg-slate-50 p-3">

                                                    <p className="text-xs text-slate-500">
                                                        Subject
                                                    </p>

                                                    <p className="mt-1 text-sm font-semibold text-slate-800">
                                                        {exam.subjectCode || "N/A"}
                                                    </p>

                                                </div>


                                                <div className="rounded-lg bg-slate-50 p-3">

                                                    <p className="text-xs text-slate-500">
                                                        Starts
                                                    </p>

                                                    <p className="mt-1 text-sm font-semibold text-slate-800">
                                                        {
                                                            exam.startAt
                                                                ? new Date(exam.startAt).toLocaleString()
                                                                : "N/A"
                                                        }
                                                    </p>

                                                </div>


                                                <div className="rounded-lg bg-slate-50 p-3">

                                                    <p className="text-xs text-slate-500">
                                                        Ends
                                                    </p>

                                                    <p className="mt-1 text-sm font-semibold text-slate-800">
                                                        {
                                                            exam.endAt
                                                                ? new Date(exam.endAt).toLocaleString()
                                                                : "N/A"
                                                        }
                                                    </p>

                                                </div>

                                           

                                            </div>


                                            {/* Footer */}

                                            <div className="mt-auto border-t border-slate-100 p-5">

                                                <button
                                                    type="button"
                                                    disabled={
                                                        isStarting
                                                    }
                                                    onClick={() =>
                                                        handleStartExam(
                                                            exam.examId
                                                        )
                                                    }
                                                    className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                                >

                                                    {isStarting
                                                        ? "Starting..."
                                                        : "Start Exam →"}

                                                </button>

                                            </div>

                                        </article>

                                    );

                                }
                            )}

                        </div>

                    )}

                </section>


                {/* ==================================
                    COMPLETED EXAMS
                ================================== */}

                <section>

                    <div className="mb-5">

                        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
                            History
                        </p>

                        <h2 className="mt-1 text-xl font-bold text-slate-900">
                            Completed Exams
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            View your results and review submitted answers.
                        </p>

                    </div>


                    {completedAttempts.length === 0 ? (

                        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">

                            <p className="text-sm text-slate-500">
                                You have not completed any examinations yet.
                            </p>

                        </div>

                    ) : (

                        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

                            <div className="divide-y divide-slate-100">

                                {completedAttempts.map(
                                    (attempt) => (

                                        <div
                                            key={
                                                attempt.attemptId
                                            }
                                            className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                                        >

                                            <div>

                                                <div className="flex flex-wrap items-center gap-2">

                                                    <h3 className="font-semibold text-slate-900">
                                                        {
                                                            attempt.examTitle
                                                        }
                                                    </h3>

                                                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                                                        SUBMITTED
                                                    </span>

                                                </div>


                                                <p className="mt-1 text-sm text-slate-500">

                                                    Attempt #
                                                    {
                                                        attempt.attemptNumber
                                                    }

                                                    {" • "}

                                                    {attempt.submittedAt
                                                        ? new Date(
                                                            attempt.submittedAt
                                                        ).toLocaleString()
                                                        : "Submitted"}

                                                </p>

                                            </div>


                                            <div className="flex flex-wrap gap-2">

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        navigate(
                                                            `/result/${attempt.attemptId}`
                                                        )
                                                    }
                                                    className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                                                >
                                                    View Result
                                                </button>


                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        navigate(
                                                            `/review/${attempt.attemptId}`
                                                        )
                                                    }
                                                    className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                                                >
                                                    Review Answers
                                                </button>

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        </div>

                    )}

                </section>

            </main>

        </div>

    );

};


export default StudentDashboard;