import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import {
    getMyExams,
    deleteExam,
    publishExam
} from "../../api/examApi";

import TeacherSidebar from "../../components/teacher/TeacherSidebar";
import ExamCard from "../../components/teacher/ExamCard";


const TeacherExams = () => {

    const navigate = useNavigate();

    const {
        logout
    } = useAuth();


    // ========================================
    // STATE
    // ========================================

    const [exams, setExams] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [actionLoading, setActionLoading] =
        useState(null);



    // ========================================
    // LOAD MY EXAMS
    // ========================================

    const fetchExams = async () => {

        try {

            setLoading(true);
            setError("");


            // ========================================
            // CHECK TOKEN
            // ========================================

            const token =
                localStorage.getItem("token");


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


            // ========================================
            // GET CURRENT TEACHER'S EXAMS
            // ========================================

            const response =
                await getMyExams();


            console.log(
                "My Exams API response:",
                response
            );


            setExams(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );


        } catch (error) {

            console.error(
                "Failed to load exams:",
                error
            );


            const status =
                error.response?.status;


            // ========================================
            // SESSION EXPIRED
            // ========================================

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


            // ========================================
            // OTHER ERROR
            // ========================================

            setError(
                error.response?.data?.message ||
                "Unable to load exams."
            );


        } finally {

            setLoading(false);

        }

    };



    // ========================================
    // LOAD WHEN PAGE OPENS
    // ========================================

    useEffect(() => {

        fetchExams();

    }, []);



    // ========================================
    // DELETE EXAM
    // ========================================

    const handleDelete = async (examId) => {

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


            await deleteExam(
                examId
            );


            // Remove deleted exam
            // from current list

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

    const handlePublish = async (examId) => {

        try {

            setActionLoading(
                `publish-${examId}`
            );

            setError("");


            const response =
                await publishExam(
                    examId
                );


            // ========================================
            // UPDATE EXAM IN LOCAL STATE
            // ========================================

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
    // CREATE EXAM
    // ========================================

    const handleCreateExam = () => {

        navigate(
            "/teacher/create-exam"
        );

    };



    // ========================================
    // UI
    // ========================================

    return (

        <div
            className="
                min-h-screen
                bg-slate-100
                flex
            "
        >


            {/* ========================================
                SIDEBAR
            ======================================== */}

            <TeacherSidebar />



            {/* ========================================
                MAIN CONTENT
            ======================================== */}

            <main
                className="
                    flex-1
                    min-w-0
                    p-8
                    overflow-y-auto
                "
            >


                {/* ========================================
                    HEADER
                ======================================== */}

                <div
                    className="
                        mb-8
                        flex
                        items-center
                        justify-between
                        gap-6
                    "
                >

                    <div>

                        <h1
                            className="
                                text-3xl
                                font-bold
                                text-slate-800
                            "
                        >
                            My Exams
                        </h1>


                        <p
                            className="
                                mt-2
                                text-slate-500
                            "
                        >
                            Create, manage and publish your examinations.
                        </p>

                    </div>


                    {/* ========================================
                        CREATE EXAM
                    ======================================== */}

                    <button
                        onClick={
                            handleCreateExam
                        }
                        className="
                            rounded-lg
                            bg-slate-800
                            px-5
                            py-3
                            text-sm
                            font-semibold
                            text-white
                            shadow-sm
                            transition
                            hover:bg-slate-700
                        "
                    >
                        + Create Exam
                    </button>

                </div>



                {/* ========================================
                    ERROR
                ======================================== */}

                {error && (

                    <div
                        className="
                            mb-6
                            rounded-lg
                            border
                            border-red-200
                            bg-red-50
                            px-4
                            py-3
                            text-sm
                            text-red-700
                        "
                    >

                        {error}

                    </div>

                )}



                {/* ========================================
                    LOADING
                ======================================== */}

                {loading && (

                    <div
                        className="
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            p-10
                            text-center
                            shadow-sm
                        "
                    >

                        <p
                            className="
                                text-slate-500
                            "
                        >
                            Loading exams...
                        </p>

                    </div>

                )}



                {/* ========================================
                    EMPTY STATE
                ======================================== */}

                {!loading &&
                    exams.length === 0 && (

                    <div
                        className="
                            rounded-xl
                            border
                            border-dashed
                            border-slate-300
                            bg-white
                            p-12
                            text-center
                        "
                    >

                        <div
                            className="
                                text-4xl
                            "
                        >
                            📝
                        </div>


                        <h2
                            className="
                                mt-4
                                text-xl
                                font-semibold
                                text-slate-800
                            "
                        >
                            No exams yet
                        </h2>


                        <p
                            className="
                                mt-2
                                text-sm
                                text-slate-500
                            "
                        >
                            Create your first examination to get started.
                        </p>


                        <button
                            onClick={
                                handleCreateExam
                            }
                            className="
                                mt-6
                                rounded-lg
                                bg-slate-800
                                px-5
                                py-3
                                text-sm
                                font-semibold
                                text-white
                                transition
                                hover:bg-slate-700
                            "
                        >
                            Create Your First Exam
                        </button>

                    </div>

                )}



                {/* ========================================
                    EXAM CARDS
                ======================================== */}

                {!loading &&
                    exams.length > 0 && (

                    <div
                        className="
                            grid
                            grid-cols-1
                            gap-6
                            lg:grid-cols-2
                            xl:grid-cols-3
                        "
                    >

                        {exams.map(
                            (exam) => (

                            <ExamCard
                                key={
                                    exam.examId
                                }

                                exam={
                                    exam
                                }

                                onDelete={
                                    handleDelete
                                }

                                onPublish={
                                    handlePublish
                                }

                                actionLoading={
                                    actionLoading
                                }
                            />

                        ))}

                    </div>

                )}

            </main>

        </div>

    );

};


export default TeacherExams;