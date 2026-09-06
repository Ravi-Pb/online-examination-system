import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import {
    createQuestion,
    updateQuestion,
    getQuestionById,
    getQuestionsByExam
} from "../../api/questionApi";

import TeacherSidebar from "../../components/teacher/TeacherSidebar";


const AddQuestion = () => {

    const navigate = useNavigate();

    const {
        examId,
        questionId
    } = useParams();

    const {
        logout
    } = useAuth();


    // ========================================
    // EDIT MODE
    // ========================================

    const isEditMode = Boolean(questionId);


    // ========================================
    // STATE
    // ========================================

    const [question, setQuestion] = useState("");

    const [optionA, setOptionA] = useState("");
    const [optionB, setOptionB] = useState("");
    const [optionC, setOptionC] = useState("");
    const [optionD, setOptionD] = useState("");

    const [correctOption, setCorrectOption] = useState("");

    const [marks, setMarks] = useState(1);

    const [questionOrder, setQuestionOrder] = useState(null);

    const [loading, setLoading] = useState(true);

    const [submitting, setSubmitting] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");


    // ========================================
    // LOAD QUESTION / DETERMINE ORDER
    // ========================================

    useEffect(() => {

        const loadQuestionData = async () => {

            try {

                setLoading(true);
                setError("");
                setSuccess("");


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


                // =================================================
                // EDIT MODE
                // =================================================

                if (isEditMode) {

                    // --------------------------------
                    // GET EXISTING QUESTION
                    // --------------------------------

                    const response =
                        await getQuestionById(questionId);


                    const existingQuestion =
                        response?.data || response;


                    if (!existingQuestion) {

                        setError(
                            "Question not found or you are not authorized to edit this question."
                        );

                        return;
                    }


                    // --------------------------------
                    // VERIFY EXAM
                    // --------------------------------

                    if (
                        String(existingQuestion.examId) !==
                        String(examId)
                    ) {

                        setError(
                            "This question does not belong to this exam."
                        );

                        return;
                    }


                    // --------------------------------
                    // LOAD QUESTION
                    // --------------------------------

                    setQuestion(
                        existingQuestion.questionText || ""
                    );


                    setMarks(
                        existingQuestion.marks || 1
                    );


                    setQuestionOrder(
                        existingQuestion.questionOrder
                    );


                    // --------------------------------
                    // LOAD OPTIONS
                    // --------------------------------

                    const options =
                        Array.isArray(
                            existingQuestion.options
                        )
                            ? [
                                ...existingQuestion.options
                            ].sort(
                                (a, b) =>
                                    Number(a.optionOrder) -
                                    Number(b.optionOrder)
                            )
                            : [];


                    const optionAData =
                        options.find(
                            option =>
                                option.optionLabel === "A"
                        );


                    const optionBData =
                        options.find(
                            option =>
                                option.optionLabel === "B"
                        );


                    const optionCData =
                        options.find(
                            option =>
                                option.optionLabel === "C"
                        );


                    const optionDData =
                        options.find(
                            option =>
                                option.optionLabel === "D"
                        );


                    setOptionA(
                        optionAData?.optionText || ""
                    );


                    setOptionB(
                        optionBData?.optionText || ""
                    );


                    setOptionC(
                        optionCData?.optionText || ""
                    );


                    setOptionD(
                        optionDData?.optionText || ""
                    );


                    // --------------------------------
                    // FIND CORRECT OPTION
                    // --------------------------------

                    const correct =
                        options.find(
                            option =>
                                option.correct === true
                        );


                    setCorrectOption(
                        correct?.optionLabel || ""
                    );


                    return;
                }



                // =================================================
                // ADD MODE
                // =================================================

                // --------------------------------
                // GET ALL QUESTIONS
                // --------------------------------

                const response =
                    await getQuestionsByExam(examId);


                const allQuestions =
                    Array.isArray(response?.data)
                        ? response.data
                        : Array.isArray(response)
                            ? response
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


                // --------------------------------
                // FIND HIGHEST ORDER
                // --------------------------------

                let highestOrder = 0;


                examQuestions.forEach(
                    question => {

                        const order =
                            Number(
                                question.questionOrder
                            );


                        if (
                            !isNaN(order) &&
                            order > highestOrder
                        ) {

                            highestOrder = order;

                        }

                    }
                );


                // --------------------------------
                // NEXT QUESTION ORDER
                // --------------------------------

                setQuestionOrder(
                    highestOrder + 1
                );


            } catch (error) {

                console.error(
                    "Failed to load question data:",
                    error
                );


                const status =
                    error.response?.status;


                // ========================================
                // SESSION EXPIRED / FORBIDDEN
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


                setError(
                    error.response?.data?.message ||
                    (
                        isEditMode
                            ? "Unable to load question."
                            : "Unable to determine question order."
                    )
                );


            } finally {

                setLoading(false);

            }

        };


        loadQuestionData();

    }, [
        examId,
        questionId,
        isEditMode,
        navigate,
        logout
    ]);



    // ========================================
    // SUBMIT
    // ========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");


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
        // CHECK EXAM
        // ========================================

        if (!examId) {

            setError(
                "Exam ID is missing."
            );

            return;
        }


        // ========================================
        // CHECK QUESTION ORDER
        // ========================================

        if (!questionOrder) {

            setError(
                "Unable to determine question order."
            );

            return;
        }


        setSubmitting(true);


        try {

            // ========================================
            // QUESTION DATA
            // ========================================

            const questionData = {

                questionText:
                    question,

                marks:
                    Number(marks),

                questionOrder:
                    Number(questionOrder),

                options: [

                    {
                        optionLabel: "A",

                        optionText:
                            optionA,

                        correct:
                            correctOption === "A",

                        optionOrder: 1
                    },

                    {
                        optionLabel: "B",

                        optionText:
                            optionB,

                        correct:
                            correctOption === "B",

                        optionOrder: 2
                    },

                    {
                        optionLabel: "C",

                        optionText:
                            optionC,

                        correct:
                            correctOption === "C",

                        optionOrder: 3
                    },

                    {
                        optionLabel: "D",

                        optionText:
                            optionD,

                        correct:
                            correctOption === "D",

                        optionOrder: 4
                    }

                ]

            };


            console.log(
                isEditMode
                    ? "Updating question:"
                    : "Creating question:",
                questionData
            );



            // =================================================
            // EDIT QUESTION
            // =================================================

            if (isEditMode) {

                console.log("question id is", {questionId});

                await updateQuestion(
                    questionId,
                    questionData
                );


                setSuccess(
                    "Question updated successfully."
                );


                return;
            }



            // =================================================
            // CREATE QUESTION
            // =================================================

            await createQuestion(
                examId,
                questionData
            );


            setSuccess(
                "Question added successfully."
            );


            // ========================================
            // CLEAR FORM
            // ========================================

            setQuestion("");

            setOptionA("");
            setOptionB("");
            setOptionC("");
            setOptionD("");

            setCorrectOption("");

            setMarks(1);


            // ========================================
            // NEXT QUESTION NUMBER
            // ========================================

            setQuestionOrder(
                previousOrder =>
                    Number(previousOrder) + 1
            );


        } catch (error) {

            console.error(
                isEditMode
                    ? "Failed to update question:"
                    : "Failed to create question:",
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
            // ERROR MESSAGE
            // ========================================

            setError(
                error.response?.data?.message ||
                (
                    isEditMode
                        ? "Unable to update question."
                        : "Unable to add question."
                )
            );


        } finally {

            setSubmitting(false);

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

            <TeacherSidebar />



            {/* ================================================= */}
            {/* MAIN */}
            {/* ================================================= */}

            <main className="flex-1 p-8">


                {/* ========================================= */}
                {/* HEADER */}
                {/* ========================================= */}

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

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    `/teacher/exams/${examId}/questions`
                                )
                            }
                            className="
                                mb-3
                                text-sm
                                text-slate-500
                                hover:text-slate-800
                            "
                        >

                            ← Back to Questions

                        </button>


                        <h1
                            className="
                                text-3xl
                                font-bold
                                text-slate-800
                            "
                        >

                            {isEditMode
                                ? "Edit Question"
                                : "Add Question"
                            }

                        </h1>


                        <p className="mt-2 text-slate-500">

                            {isEditMode
                                ? `Edit question in examination #${examId}`
                                : `Add a new question to examination #${examId}`
                            }

                        </p>

                    </div>



                    {/* ========================================= */}
                    {/* QUESTION NUMBER */}
                    {/* ========================================= */}

                    {!loading &&
                        questionOrder && (

                        <div
                            className="
                                rounded-xl
                                border border-slate-200
                                bg-white
                                px-5 py-4
                                shadow-sm
                            "
                        >

                            <p
                                className="
                                    text-xs
                                    text-slate-500
                                "
                            >

                                Question Number

                            </p>


                            <p
                                className="
                                    mt-1
                                    text-2xl
                                    font-bold
                                    text-slate-800
                                "
                            >

                                {questionOrder}

                            </p>

                        </div>

                    )}

                </div>



                {/* ========================================= */}
                {/* LOADING */}
                {/* ========================================= */}

                {loading && (

                    <div
                        className="
                            mb-6
                            rounded-xl
                            border border-slate-200
                            bg-white
                            px-6 py-5
                            text-slate-500
                            shadow-sm
                        "
                    >

                        {isEditMode
                            ? "Loading question..."
                            : "Determining question number..."
                        }

                    </div>

                )}



                {/* ========================================= */}
                {/* ERROR */}
                {/* ========================================= */}

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



                {/* ========================================= */}
                {/* SUCCESS */}
                {/* ========================================= */}

                {success && (

                    <div
                        className="
                            mb-6
                            rounded-lg
                            border border-green-200
                            bg-green-50
                            px-4 py-3
                            text-sm
                            text-green-700
                        "
                    >

                        {success}

                    </div>

                )}



                {/* ========================================= */}
                {/* FORM */}
                {/* ========================================= */}

                {!loading && !error && (

                    <form
                        onSubmit={handleSubmit}
                        className="
                            rounded-xl
                            border border-slate-200
                            bg-white
                            p-8
                            shadow-sm
                        "
                    >


                        {/* ================================= */}
                        {/* QUESTION */}
                        {/* ================================= */}

                        <div className="mb-8">

                            <label
                                className="
                                    mb-2
                                    block
                                    text-sm
                                    font-semibold
                                    text-slate-700
                                "
                            >

                                Question

                            </label>


                            <textarea
                                value={question}
                                onChange={(e) =>
                                    setQuestion(
                                        e.target.value
                                    )
                                }
                                placeholder="Enter your question..."
                                rows="4"
                                required
                                className="
                                    w-full
                                    rounded-lg
                                    border
                                    border-slate-300
                                    px-4 py-3
                                    text-sm
                                    text-slate-800
                                    outline-none
                                    transition
                                    focus:border-slate-500
                                    focus:ring-2
                                    focus:ring-slate-200
                                "
                            />

                        </div>



                        {/* ================================= */}
                        {/* OPTIONS */}
                        {/* ================================= */}

                        <div className="mb-8">

                            <h2
                                className="
                                    mb-4
                                    text-lg
                                    font-semibold
                                    text-slate-800
                                "
                            >

                                Answer Options

                            </h2>


                            {/* A */}

                            <div className="mb-4">

                                <label
                                    className="
                                        mb-2
                                        block
                                        text-sm
                                        font-medium
                                        text-slate-600
                                    "
                                >

                                    Option A

                                </label>


                                <input
                                    type="text"
                                    value={optionA}
                                    onChange={(e) =>
                                        setOptionA(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter option A"
                                    required
                                    className="
                                        w-full
                                        rounded-lg
                                        border
                                        border-slate-300
                                        px-4 py-3
                                        text-sm
                                        outline-none
                                        focus:border-slate-500
                                        focus:ring-2
                                        focus:ring-slate-200
                                    "
                                />

                            </div>


                            {/* B */}

                            <div className="mb-4">

                                <label
                                    className="
                                        mb-2
                                        block
                                        text-sm
                                        font-medium
                                        text-slate-600
                                    "
                                >

                                    Option B

                                </label>


                                <input
                                    type="text"
                                    value={optionB}
                                    onChange={(e) =>
                                        setOptionB(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter option B"
                                    required
                                    className="
                                        w-full
                                        rounded-lg
                                        border
                                        border-slate-300
                                        px-4 py-3
                                        text-sm
                                        outline-none
                                        focus:border-slate-500
                                        focus:ring-2
                                        focus:ring-slate-200
                                    "
                                />

                            </div>


                            {/* C */}

                            <div className="mb-4">

                                <label
                                    className="
                                        mb-2
                                        block
                                        text-sm
                                        font-medium
                                        text-slate-600
                                    "
                                >

                                    Option C

                                </label>


                                <input
                                    type="text"
                                    value={optionC}
                                    onChange={(e) =>
                                        setOptionC(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter option C"
                                    required
                                    className="
                                        w-full
                                        rounded-lg
                                        border
                                        border-slate-300
                                        px-4 py-3
                                        text-sm
                                        outline-none
                                        focus:border-slate-500
                                        focus:ring-2
                                        focus:ring-slate-200
                                    "
                                />

                            </div>


                            {/* D */}

                            <div>

                                <label
                                    className="
                                        mb-2
                                        block
                                        text-sm
                                        font-medium
                                        text-slate-600
                                    "
                                >

                                    Option D

                                </label>


                                <input
                                    type="text"
                                    value={optionD}
                                    onChange={(e) =>
                                        setOptionD(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter option D"
                                    required
                                    className="
                                        w-full
                                        rounded-lg
                                        border
                                        border-slate-300
                                        px-4 py-3
                                        text-sm
                                        outline-none
                                        focus:border-slate-500
                                        focus:ring-2
                                        focus:ring-slate-200
                                    "
                                />

                            </div>

                        </div>



                        {/* ================================= */}
                        {/* CORRECT ANSWER + MARKS */}
                        {/* ================================= */}

                        <div
                            className="
                                grid
                                grid-cols-1
                                gap-6
                                md:grid-cols-2
                            "
                        >

                            {/* Correct Answer */}

                            <div>

                                <label
                                    className="
                                        mb-2
                                        block
                                        text-sm
                                        font-semibold
                                        text-slate-700
                                    "
                                >

                                    Correct Answer

                                </label>


                                <select
                                    value={correctOption}
                                    onChange={(e) =>
                                        setCorrectOption(
                                            e.target.value
                                        )
                                    }
                                    required
                                    className="
                                        w-full
                                        rounded-lg
                                        border
                                        border-slate-300
                                        bg-white
                                        px-4 py-3
                                        text-sm
                                        text-slate-700
                                        outline-none
                                        focus:border-slate-500
                                        focus:ring-2
                                        focus:ring-slate-200
                                    "
                                >

                                    <option value="">
                                        Select correct option
                                    </option>

                                    <option value="A">
                                        Option A
                                    </option>

                                    <option value="B">
                                        Option B
                                    </option>

                                    <option value="C">
                                        Option C
                                    </option>

                                    <option value="D">
                                        Option D
                                    </option>

                                </select>

                            </div>


                            {/* Marks */}

                            <div>

                                <label
                                    className="
                                        mb-2
                                        block
                                        text-sm
                                        font-semibold
                                        text-slate-700
                                    "
                                >

                                    Marks

                                </label>


                                <input
                                    type="number"
                                    min="1"
                                    value={marks}
                                    onChange={(e) =>
                                        setMarks(
                                            e.target.value
                                        )
                                    }
                                    required
                                    className="
                                        w-full
                                        rounded-lg
                                        border
                                        border-slate-300
                                        px-4 py-3
                                        text-sm
                                        outline-none
                                        focus:border-slate-500
                                        focus:ring-2
                                        focus:ring-slate-200
                                    "
                                />

                            </div>

                        </div>



                        {/* ================================= */}
                        {/* BUTTONS */}
                        {/* ================================= */}

                        <div
                            className="
                                mt-10
                                flex
                                justify-end
                                gap-3
                                border-t
                                border-slate-200
                                pt-6
                            "
                        >

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        `/teacher/exams/${examId}/questions`
                                    )
                                }
                                className="
                                    rounded-lg
                                    border
                                    border-slate-300
                                    bg-white
                                    px-5 py-3
                                    text-sm
                                    font-semibold
                                    text-slate-700
                                    transition
                                    hover:bg-slate-50
                                "
                            >

                                Cancel

                            </button>


                            <button
                                type="submit"
                                disabled={submitting}
                                className="
                                    rounded-lg
                                    bg-slate-800
                                    px-6 py-3
                                    text-sm
                                    font-semibold
                                    text-white
                                    shadow-sm
                                    transition
                                    hover:bg-slate-700
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                "
                            >

                                {submitting
                                    ? (
                                        isEditMode
                                            ? "Updating..."
                                            : "Adding..."
                                    )
                                    : (
                                        isEditMode
                                            ? "Update Question"
                                            : "Add Question"
                                    )
                                }

                            </button>

                        </div>

                    </form>

                )}

            </main>

        </div>

    );

};


export default AddQuestion;