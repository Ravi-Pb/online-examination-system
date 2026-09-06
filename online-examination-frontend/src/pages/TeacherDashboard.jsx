import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import {
    getMyExams,
    deleteExam,
    publishExam
} from "../api/examApi";

import TeacherSidebar from "../components/teacher/TeacherSidebar";
import ExamCard from "../components/teacher/ExamCard";


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

    const [actionLoading, setActionLoading] =
        useState(null);


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
    // LOAD MY EXAMS
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
                // FETCH CURRENT TEACHER'S EXAMS
                // --------------------------------

                const response =
                    await getMyExams();


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
    // DELETE EXAM
    // ========================================

    const handleDeleteExam = async (examId) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this exam?"
            );


        if (!confirmed) {
            return;
        }


        try {

            setActionLoading(
                `delete-${examId}`
            );

            setError("");


            await deleteExam(examId);


            // Remove deleted exam
            // from current state

            setExams(
                previousExams =>
                    previousExams.filter(
                        exam =>
                            exam.examId !== examId
                    )
            );


        } catch (error) {

            console.error(
                "Failed to delete exam:",
                error
            );


            const status =
                error.response?.status;


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


            setError(
                error.response?.data?.message ||
                "Unable to delete exam."
            );


        } finally {

            setActionLoading(null);

        }

    };


    // ========================================
    // PUBLISH EXAM
    // ========================================

    const handlePublishExam = async (examId) => {

        try {

            setActionLoading(
                `publish-${examId}`
            );

            setError("");


            const response =
                await publishExam(examId);


            // Update published exam
            // in local state

            setExams(
                previousExams =>
                    previousExams.map(
                        exam =>
                            exam.examId === examId
                                ? response.data
                                : exam
                    )
            );


        } catch (error) {

            console.error(
                "Failed to publish exam:",
                error
            );


            const status =
                error.response?.status;


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


            setError(
                error.response?.data?.message ||
                "Unable to publish exam."
            );


        } finally {

            setActionLoading(null);

        }

    };


    // ========================================
    // UI
    // ========================================

    return (

        <div className="min-h-screen overflow-hidden bg-slate-100 flex">


            {/* ================================================= */}
            {/* SIDEBAR */}
            {/* ================================================= */}

            <TeacherSidebar />


            {/* ================================================= */}
            {/* MAIN CONTENT */}
            {/* ================================================= */}

            <main className="flex-1 p-8 overflow-y-auto">


                {/* ============================================= */}
                {/* HEADER */}
                {/* ============================================= */}

                <div className="mb-8 flex items-center justify-between gap-6">


                    {/* Left */}

                    <div className="flex-1">

                        <h2 className="text-3xl font-bold text-slate-800">
                            Teacher Dashboard
                        </h2>

                        <p className="mt-2 text-slate-500">
                            Manage your exams, questions and student results.
                        </p>

                    </div>


                    {/* Right */}

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


                {/* ============================================= */}
                {/* EXPIRED MESSAGE */}
                {/* ============================================= */}

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


                {/* ============================================= */}
                {/* ERROR */}
                {/* ============================================= */}

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


                {/* ============================================= */}
                {/* STATISTICS */}
                {/* ============================================= */}

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


                {/* ============================================= */}
                {/* RECENT EXAMS */}
                {/* ============================================= */}

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
                                Exams created by you.
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


                    {/* ========================================= */}
                    {/* LOADING */}
                    {/* ========================================= */}

                    {loading && (

                        <div className="px-6 py-12 text-center">

                            <p className="text-slate-500">
                                Loading exams...
                            </p>

                        </div>

                    )}


                    {/* ========================================= */}
                    {/* EMPTY */}
                    {/* ========================================= */}

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


                    {/* ========================================= */}
                    {/* EXAM LIST */}
                    {/* ========================================= */}

                    {!loading &&
                        exams.length > 0 && (

                            <div
                                className="
                                    p-6
                                    grid
                                    grid-cols-1
                                    md:grid-cols-2
                                    xl:grid-cols-3
                                    2xl:grid-cols-4
                                    gap-5
                                "
                            >

                                {exams.map((exam) => (

                                    <ExamCard
                                        key={exam.examId}
                                        exam={exam}
                                        onDelete={handleDeleteExam}
                                        onPublish={handlePublishExam}
                                        actionLoading={actionLoading}
                                    />

                                ))}

                            </div>

                        )}

                </div>

            </main>

        </div>

    );

};


export default TeacherDashboard;