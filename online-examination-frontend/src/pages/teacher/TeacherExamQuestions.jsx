import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import api from "../../api/axios";
import TeacherSidebar from "../../components/teacher/TeacherSidebar";
import QuestionCard from "../../components/teacher/QuestionCard";


const TeacherExamQuestions = () => {

    const navigate = useNavigate();
    const { examId } = useParams();

    const {
        user,
        logout
    } = useAuth();


    // ========================================
    // STATE
    // ========================================

    const [exam, setExam] = useState(null);

    const [questions, setQuestions] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");



    // ========================================
    // LOAD EXAM + QUESTIONS
    // ========================================

    useEffect(() => {

        const fetchData = async () => {

            try {

                setLoading(true);
                setError("");


                // --------------------------------
                // CHECK TOKEN
                // --------------------------------

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


                // --------------------------------
                // GET TEACHER'S EXAMS
                // --------------------------------

                const examResponse =
                    await api.get("/exams/my");


                const exams =
                    Array.isArray(examResponse.data)
                        ? examResponse.data
                        : [];


                const selectedExam =
                    exams.find(
                        exam =>
                            String(exam.examId) ===
                            String(examId)
                    );


                // --------------------------------
                // EXAM NOT FOUND / NOT OWNED
                // --------------------------------

                if (!selectedExam) {

                    setError(
                        "Exam not found or you are not authorized to access this exam."
                    );

                    return;
                }


                setExam(selectedExam);


                // --------------------------------
                // GET TEACHER QUESTIONS
                // --------------------------------

                const questionResponse =
                    await api.get("/questions");


                const allQuestions =
                    Array.isArray(questionResponse.data)
                        ? questionResponse.data
                        : [];


                // --------------------------------
                // QUESTIONS FOR THIS EXAM
                // --------------------------------

                const examQuestions =
                    allQuestions.filter(
                        question =>
                            String(question.examId) ===
                            String(examId)
                    );


                setQuestions(examQuestions);


            } catch (error) {

                console.error(
                    "Failed to load exam questions:",
                    error
                );


                const status =
                    error.response?.status;


                // --------------------------------
                // SESSION EXPIRED
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


                setError(
                    error.response?.data?.message ||
                    "Unable to load exam questions."
                );


            } finally {

                setLoading(false);

            }

        };


        fetchData();

    }, [examId, navigate, logout]);



    // ========================================
    // DELETE QUESTION
    // ========================================

    const handleDelete = async (questionId) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this question?"
            );


        if (!confirmed) {
            return;
        }


        try {

            await api.delete(
                `/questions/${questionId}`
            );


            setQuestions(
                previousQuestions =>
                    previousQuestions.filter(
                        question =>
                            question.questionId !== questionId
                    )
            );


        } catch (error) {

            console.error(
                "Failed to delete question:",
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


            alert(
                error.response?.data?.message ||
                "Unable to delete question."
            );

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
    // UI
    // ========================================

    return (

        <div className="min-h-screen bg-slate-100 flex">


            {/* ================================================= */}
            {/* SIDEBAR */}
            {/* ================================================= */}
            <TeacherSidebar/>



            {/* ================================================= */}
            {/* MAIN CONTENT */}
            {/* ================================================= */}

            <main className="flex-1 p-8">


                {/* Header */}

                <div className="mb-8 flex items-center justify-between">

                    <div>

                        <button
                            onClick={() =>
                                navigate("/teacher/dashboard")
                            }
                            className="
                                text-sm
                                text-slate-500
                                hover:text-slate-800
                                mb-3
                            "
                        >
                            ← Back to My Exams
                        </button>


                        <h2 className="text-3xl font-bold text-slate-800">
                            {exam?.title || "Exam Questions"}
                        </h2>


                        {exam && (

                            <p className="mt-2 text-slate-500">

                                {exam.subjectCode || "N/A"}

                                {exam.subjectName && (
                                    <>
                                        {" • "}
                                        {exam.subjectName}
                                    </>
                                )}

                            </p>

                        )}

                    </div>


                    <div className="text-right">

                        <p className="text-sm text-slate-500">
                            Welcome back 👋
                        </p>

                        <p className="text-lg font-semibold text-slate-800">
                            {user?.fullName || "Teacher"}
                        </p>

                    </div>

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
                            px-4 py-3
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
                            bg-white
                            rounded-xl
                            border border-slate-200
                            shadow-sm
                            px-6
                            py-12
                            text-center
                        "
                    >

                        <p className="text-slate-500">
                            Loading questions...
                        </p>

                    </div>

                )}



                {/* ================================================= */}
                {/* CONTENT */}
                {/* ================================================= */}

                {!loading && !error && (

                    <>

                        {/* Question Header */}

                        <div
                            className="
                                mb-6
                                bg-white
                                rounded-xl
                                border border-slate-200
                                shadow-sm
                                px-6 py-5
                                flex
                                items-center
                                justify-between
                            "
                        >

                            <div>

                                <h3 className="text-lg font-semibold text-slate-800">
                                    Questions
                                </h3>

                                <p className="text-sm text-slate-500 mt-1">

                                    {questions.length}{" "}
                                    {questions.length === 1
                                        ? "question"
                                        : "questions"}

                                </p>

                            </div>


                            <button
                                onClick={() =>
                                    navigate(
                                        `/teacher/exams/${examId}/questions/create`
                                    )
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
                                + Add Question
                            </button>

                        </div>



                        {/* ================================================= */}
                        {/* EMPTY */}
                        {/* ================================================= */}

                        {questions.length === 0 && (

                            <div
                                className="
                                    bg-white
                                    rounded-xl
                                    border border-slate-200
                                    shadow-sm
                                    px-6 py-14
                                    text-center
                                "
                            >

                                <div className="text-5xl mb-4">
                                    ❓
                                </div>


                                <h4 className="text-lg font-semibold text-slate-700">
                                    No questions yet
                                </h4>


                                <p className="text-sm text-slate-500 mt-2">
                                    Add questions to this exam to get started.
                                </p>


                                <button
                                    onClick={() =>
                                        navigate(
                                            `/teacher/exams/${examId}/questions/create`
                                        )
                                    }
                                    className="
                                        mt-5
                                        px-5 py-2.5
                                        bg-slate-900
                                        text-white
                                        rounded-lg
                                        text-sm
                                        font-medium
                                        hover:bg-slate-800
                                        transition
                                    "
                                >
                                    + Add First Question
                                </button>

                            </div>

                        )}



                        {/* ================================================= */}
                        {/* QUESTIONS */}
                        {/* ================================================= */}

                        {questions.length > 0 && (

                            <div
                                className="
                                    bg-white
                                    rounded-xl
                                    border border-slate-200
                                    shadow-sm
                                    overflow-hidden
                                "
                            >

                                <div className="divide-y divide-slate-200">

                                    {questions.map((question) => (

                                        <QuestionCard
                                            key={question.questionId}
                                            question={question}
                                            onDelete={handleDelete}
                                        />

                                    ))}

                                </div>

                            </div>

                        )}

                    </>

                )}

            </main>

        </div>

    );

};


export default TeacherExamQuestions;