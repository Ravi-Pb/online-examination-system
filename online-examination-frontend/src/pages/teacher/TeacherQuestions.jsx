import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import { getQuestionsForTeacher } from "../../api/questionApi";
import { getMyExams } from "../../api/examApi";
import TeacherSidebar from "../../components/teacher/TeacherSidebar";


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

    const [exams, setExams] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // ========================================
    // LOAD DATA
    // ========================================

    useEffect(() => {

        const fetchData = async () => {

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
                // LOAD QUESTIONS + EXAMS
                // --------------------------------

                const [
                    questionsResponse,
                    examsResponse
                ] = await Promise.all([
                    getQuestionsForTeacher(),
                    getMyExams()
                ]);


                setQuestions(
                    Array.isArray(questionsResponse.data)
                        ? questionsResponse.data
                        : []
                );


                setExams(
                    Array.isArray(examsResponse.data)
                        ? examsResponse.data
                        : []
                );


            } catch (error) {

                console.error(
                    "Failed to load teacher questions:",
                    error
                );


                const status =
                    error.response?.status;


                // --------------------------------
                // AUTHENTICATION ERROR
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


        fetchData();

    }, [navigate, logout]);


    // ========================================
    // FIND EXAM
    // ========================================

    const getExamById = (examId) => {

        return exams.find(
            exam =>
                exam.examId === examId
        );

    };


    // ========================================
    // GROUP QUESTIONS BY EXAM
    // ========================================

    const groupedQuestions =
        questions.reduce(
            (groups, question) => {

                const examId =
                    question.examId;

                if (!groups[examId]) {

                    groups[examId] = [];

                }

                groups[examId].push(question);

                return groups;

            },
            {}
        );


    // ========================================
    // EXAM IDS
    // ========================================

    const examIds =
        Object.keys(groupedQuestions);


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

                        <h2 className="text-3xl font-bold text-slate-800">
                            Questions
                        </h2>

                        <p className="mt-2 text-slate-500">
                            Manage questions for your exams.
                        </p>

                    </div>


                    <div className="text-right">

                        <p className="text-sm text-slate-500">
                            Welcome back
                        </p>

                        <p className="text-xl font-bold text-slate-800">
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
                            bg-white
                            rounded-xl
                            border border-slate-200
                            shadow-sm
                            px-6 py-12
                            text-center
                        "
                    >

                        <p className="text-slate-500">
                            Loading questions...
                        </p>

                    </div>

                )}


                {/* ================================================= */}
                {/* EMPTY */}
                {/* ================================================= */}

                {!loading &&
                    !error &&
                    questions.length === 0 && (

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

                            <h3 className="text-xl font-semibold text-slate-700">
                                No questions yet
                            </h3>

                            <p className="mt-2 text-sm text-slate-500">
                                Create questions for one of your exams
                                to see them here.
                            </p>


                            <button
                                onClick={() =>
                                    navigate("/teacher/exams")
                                }
                                className="
                                    mt-6
                                    px-5 py-2.5
                                    rounded-lg
                                    bg-slate-900
                                    text-white
                                    text-sm
                                    font-medium
                                    hover:bg-slate-800
                                    transition
                                "
                            >

                                View My Exams

                            </button>

                        </div>

                    )}


                {/* ================================================= */}
                {/* QUESTION GROUPS */}
                {/* ================================================= */}

                {!loading &&
                    questions.length > 0 && (

                        <div className="space-y-6">

                            {examIds.map((examId) => {

                                const examQuestions =
                                    groupedQuestions[examId];

                                const exam =
                                    getExamById(
                                        Number(examId)
                                    );


                                return (

                                    <div
                                        key={examId}
                                        className="
                                            bg-white
                                            rounded-xl
                                            border border-slate-200
                                            shadow-sm
                                            overflow-hidden
                                        "
                                    >


                                        {/* Exam Header */}

                                        <div
                                            className="
                                                px-6 py-5
                                                border-b border-slate-200
                                                flex
                                                flex-col
                                                sm:flex-row
                                                sm:items-center
                                                sm:justify-between
                                                gap-4
                                            "
                                        >

                                            <div>

                                                <div className="flex items-center gap-3">

                                                    <h3 className="text-lg font-semibold text-slate-800">

                                                        {exam?.title ||
                                                            `Exam #${examId}`
                                                        }

                                                    </h3>

                                                    {exam?.examStatus && (

                                                        <span
                                                            className="
                                                                px-2.5 py-1
                                                                rounded-full
                                                                bg-slate-100
                                                                text-slate-600
                                                                text-xs
                                                                font-semibold
                                                            "
                                                        >

                                                            {exam.examStatus}

                                                        </span>

                                                    )}

                                                </div>


                                                {exam && (

                                                    <p className="mt-1 text-sm text-slate-500">

                                                        {exam.subjectCode || "N/A"}

                                                        {exam.subjectName && (
                                                            <>
                                                                {" • "}
                                                                {exam.subjectName}
                                                            </>
                                                        )}

                                                    </p>

                                                )}

                                                <p className="mt-2 text-xs text-slate-400">

                                                    {examQuestions.length}{" "}
                                                    {examQuestions.length === 1
                                                        ? "question"
                                                        : "questions"
                                                    }

                                                </p>

                                            </div>


                                            {/* Manage Exam */}

                                            <button
                                                onClick={() =>
                                                    navigate(
                                                        `/teacher/exams/${examId}/questions`
                                                    )
                                                }
                                                className="
                                                    px-4 py-2
                                                    rounded-lg
                                                    bg-slate-900
                                                    text-white
                                                    text-sm
                                                    font-medium
                                                    hover:bg-slate-800
                                                    transition
                                                    whitespace-nowrap
                                                "
                                            >

                                                Manage Questions

                                            </button>

                                        </div>


                                        {/* Questions */}

                                        <div className="divide-y divide-slate-200">

                                            {examQuestions
                                                .sort(
                                                    (a, b) =>
                                                        a.questionOrder -
                                                        b.questionOrder
                                                )
                                                .map((question) => (

                                                    <div
                                                        key={
                                                            question.questionId
                                                        }
                                                        className="
                                                            px-6 py-5
                                                            hover:bg-slate-50
                                                            transition
                                                        "
                                                    >

                                                        <div
                                                            className="
                                                                flex
                                                                items-start
                                                                gap-4
                                                            "
                                                        >

                                                            {/* Question Number */}

                                                            <div
                                                                className="
                                                                    flex-shrink-0
                                                                    w-9 h-9
                                                                    rounded-lg
                                                                    bg-slate-100
                                                                    flex
                                                                    items-center
                                                                    justify-center
                                                                    text-sm
                                                                    font-bold
                                                                    text-slate-600
                                                                "
                                                            >

                                                                {question.questionOrder}

                                                            </div>


                                                            {/* Question */}

                                                            <div className="flex-1 min-w-0">

                                                                <p className="text-sm font-medium text-slate-800">

                                                                    {question.questionText}

                                                                </p>


                                                                <p className="mt-1 text-xs text-slate-400">

                                                                    {question.marks}{" "}
                                                                    {question.marks === 1
                                                                        ? "mark"
                                                                        : "marks"
                                                                    }

                                                                </p>


                                                                {/* Options */}

                                                                {question.options &&
                                                                    question.options.length > 0 && (

                                                                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">

                                                                            {question.options
                                                                                .sort(
                                                                                    (a, b) =>
                                                                                        a.optionOrder -
                                                                                        b.optionOrder
                                                                                )
                                                                                .map((option) => (

                                                                                    <div
                                                                                        key={
                                                                                            option.optionId
                                                                                        }
                                                                                        className="
                                                                                            rounded-lg
                                                                                            border border-slate-200
                                                                                            bg-slate-50
                                                                                            px-3 py-2
                                                                                            text-sm
                                                                                        "
                                                                                    >

                                                                                        <span className="font-semibold text-slate-500 mr-2">

                                                                                            {option.optionLabel}.

                                                                                        </span>

                                                                                        <span className="text-slate-700">

                                                                                            {option.optionText}

                                                                                        </span>

                                                                                    </div>

                                                                                ))}

                                                                        </div>

                                                                    )}

                                                            </div>

                                                        </div>

                                                    </div>

                                                ))}

                                        </div>

                                    </div>

                                );

                            })}

                        </div>

                    )}

            </main>

        </div>

    );

};


export default TeacherQuestions;