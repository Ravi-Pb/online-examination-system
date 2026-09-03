import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    getAttemptQuestions,
    getAttempt,
    saveAnswer,
    submitExam
} from "../api/examApi";

import { useAuth } from "../context/AuthContext";


const ExamPage = () => {

    const { attemptId } = useParams();
    const navigate = useNavigate();

    const { logout } = useAuth();


    // =========================================================
    // STATE
    // =========================================================

    const [questions, setQuestions] = useState([]);

    const [answers, setAnswers] = useState({});

    const [attempt, setAttempt] = useState(null);

    const [loading, setLoading] = useState(true);

    const [savingQuestionId, setSavingQuestionId] =
        useState(null);

    const [submitting, setSubmitting] =
        useState(false);

    const [error, setError] = useState("");

    const [currentQuestion, setCurrentQuestion] =
        useState(0);

    const [timeLeft, setTimeLeft] = useState(null);


    // =========================================================
    // LOAD EXAM
    // =========================================================

    useEffect(() => {

        loadExam();

    }, [attemptId]);


    const loadExam = async () => {

        try {

            setLoading(true);
            setError("");


            // -------------------------------------------------
            // Load attempt
            // -------------------------------------------------

            const attemptResponse =
                await getAttempt(attemptId);

            const attemptData =
                attemptResponse.data;

            setAttempt(attemptData);


            // -------------------------------------------------
            // Load questions
            // -------------------------------------------------

            const questionResponse =
                await getAttemptQuestions(attemptId);

            const questionData =
                questionResponse.data || [];

            setQuestions(questionData);


            // -------------------------------------------------
            // Restore existing answers
            // -------------------------------------------------

            const existingAnswers = {};

            questionData.forEach((question) => {

                if (
                    question.selectedOptionId !== null &&
                    question.selectedOptionId !== undefined
                ) {

                    existingAnswers[
                        question.questionId
                    ] = question.selectedOptionId;

                }

            });

            setAnswers(existingAnswers);


            // -------------------------------------------------
            // Calculate timer
            // -------------------------------------------------

            calculateTimeLeft(attemptData);

        } catch (error) {

            console.error(
                "Failed to load exam:",
                error
            );


            if (
                error.response?.status === 401 ||
                error.response?.status === 403
            ) {

                logout();

                navigate(
                    "/login",
                    { replace: true }
                );

                return;
            }


            setError(
                error.response?.data?.message ||
                "Unable to load exam."
            );

        } finally {

            setLoading(false);

        }

    };


    // =========================================================
    // CALCULATE REMAINING TIME
    // =========================================================

    const calculateTimeLeft = (attemptData) => {

        if (!attemptData) {
            return;
        }


        // -----------------------------------------------------
        // Prefer backend deadline
        // -----------------------------------------------------

        if (attemptData.deadline) {

            const deadline =
                new Date(attemptData.deadline);

            const remaining =
                Math.max(
                    0,
                    Math.floor(
                        (
                            deadline.getTime() -
                            Date.now()
                        ) / 1000
                    )
                );

            setTimeLeft(remaining);

            return;
        }


        // -----------------------------------------------------
        // Fallback:
        // startedAt + duration
        // -----------------------------------------------------

        const startedAt =
            attemptData.startedAt;

        const durationMinutes =
            attemptData.exam?.durationMinutes ||
            attemptData.durationMinutes;


        if (
            startedAt &&
            durationMinutes
        ) {

            const start =
                new Date(startedAt);

            const deadline =
                start.getTime() +
                durationMinutes * 60 * 1000;

            const remaining =
                Math.max(
                    0,
                    Math.floor(
                        (
                            deadline -
                            Date.now()
                        ) / 1000
                    )
                );

            setTimeLeft(remaining);

        }

    };


    // =========================================================
    // COUNTDOWN TIMER
    // =========================================================

    useEffect(() => {

        if (
            timeLeft === null ||
            timeLeft <= 0 ||
            submitting
        ) {
            return;
        }


        const timer =
            setInterval(() => {

                setTimeLeft((previous) => {

                    if (
                        previous === null ||
                        previous <= 1
                    ) {

                        clearInterval(timer);

                        handleAutoSubmit();

                        return 0;
                    }

                    return previous - 1;

                });

            }, 1000);


        return () => clearInterval(timer);

    }, [timeLeft, submitting]);


    // =========================================================
    // FORMAT TIMER
    // =========================================================

    const formatTime = (seconds) => {

        if (
            seconds === null ||
            seconds === undefined
        ) {
            return "--:--";
        }


        const minutes =
            Math.floor(seconds / 60);

        const remainingSeconds =
            seconds % 60;


        return (
            `${String(minutes).padStart(2, "0")}:` +
            `${String(remainingSeconds).padStart(2, "0")}`
        );

    };


    // =========================================================
    // SELECT OPTION
    // =========================================================

    const handleOptionChange = (
        questionId,
        optionId
    ) => {

        setAnswers((previous) => ({

            ...previous,

            [questionId]: optionId

        }));

    };


    // =========================================================
    // CLEAR ANSWER
    // =========================================================

    const handleClearSelection = (
        questionId
    ) => {

        setAnswers((previous) => {

            const updated = {
                ...previous
            };

            delete updated[questionId];

            return updated;

        });

    };


    // =========================================================
    // SAVE ANSWER
    // =========================================================

    const handleSaveAnswer = async (
        questionId
    ) => {

        const selectedOptionId =
            answers[questionId];


        if (
            selectedOptionId === null ||
            selectedOptionId === undefined
        ) {

            setError(
                "Please select an option first."
            );

            return;
        }


        try {

            setSavingQuestionId(questionId);
            setError("");


            await saveAnswer(
                attemptId,
                {
                    questionId,
                    selectedOptionId
                }
            );

        } catch (error) {

            console.error(
                "Failed to save answer:",
                error
            );


            if (
                error.response?.status === 401 ||
                error.response?.status === 403
            ) {

                logout();

                navigate(
                    "/login",
                    { replace: true }
                );

                return;
            }


            setError(
                error.response?.data?.message ||
                "Unable to save answer."
            );

        } finally {

            setSavingQuestionId(null);

        }

    };


    // =========================================================
    // AUTO SUBMIT
    // =========================================================

    const handleAutoSubmit = async () => {

        if (submitting) {
            return;
        }


        try {

            setSubmitting(true);
            setError("");


            await submitExam(attemptId);


            navigate(
                `/result/${attemptId}`,
                { replace: true }
            );

        } catch (error) {

            console.error(
                "Failed to auto-submit exam:",
                error
            );


            setError(
                "Exam time expired. Unable to submit automatically."
            );

            setSubmitting(false);

        }

    };


    // =========================================================
    // MANUAL SUBMIT
    // =========================================================

    const handleSubmitExam = async () => {

        const confirmed =
            window.confirm(
                "Are you sure you want to submit this exam? You will not be able to change your answers afterward."
            );


        if (!confirmed) {
            return;
        }


        try {

            setSubmitting(true);
            setError("");


            await submitExam(attemptId);


            navigate(
                `/result/${attemptId}`,
                { replace: true }
            );

        } catch (error) {

            console.error(
                "Failed to submit exam:",
                error
            );


            if (
                error.response?.status === 401 ||
                error.response?.status === 403
            ) {

                logout();

                navigate(
                    "/login",
                    { replace: true }
                );

                return;
            }


            setError(
                error.response?.data?.message ||
                "Unable to submit the exam."
            );


            setSubmitting(false);

        }

    };


    // =========================================================
    // QUESTION NAVIGATION
    // =========================================================

    const goToQuestion = (index) => {

        if (
            index < 0 ||
            index >= questions.length
        ) {
            return;
        }


        setCurrentQuestion(index);

    };


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (

            <div className="min-h-screen bg-slate-50">

                <div className="flex min-h-screen items-center justify-center">

                    <div className="text-center">

                        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>

                        <p className="text-sm text-slate-500">
                            Loading exam...
                        </p>

                    </div>

                </div>

            </div>

        );

    }


    // =========================================================
    // NO QUESTIONS
    // =========================================================

    if (questions.length === 0) {

        return (

            <div className="min-h-screen bg-slate-50">

                <main className="mx-auto flex min-h-screen max-w-2xl items-center justify-center px-6">

                    <section className="w-full rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">

                        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl">
                            ?
                        </div>

                        <h2 className="mb-2 text-xl font-semibold text-slate-900">
                            No Questions
                        </h2>

                        <p className="mb-6 text-sm leading-6 text-slate-500">
                            No questions were found for this exam attempt.
                        </p>

                        <button
                            type="button"
                            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                            onClick={() =>
                                navigate(
                                    "/student/dashboard"
                                )
                            }
                        >
                            Back to Dashboard
                        </button>

                    </section>

                </main>

            </div>

        );

    }


    // =========================================================
    // CURRENT QUESTION DATA
    // =========================================================

    const question =
        questions[currentQuestion];


    const selectedOptionId =
        answers[question.questionId];


    const answeredCount =
        Object.keys(answers).length;


    const unansweredCount =
        questions.length -
        answeredCount;


    // =========================================================
    // MAIN UI
    // =========================================================

    return (

        <div className="min-h-screen bg-slate-50 text-slate-800">


            {/* =================================================
                HEADER
            ================================================= */}

            <header className="sticky top-0 z-30 border-b border-slate-200 bg-white shadow-sm">

                <div className="mx-auto flex min-h-[76px] max-w-7xl items-center justify-between gap-6 px-6 py-3">

                    {/* -----------------------------------------
                        EXAM TITLE
                    ----------------------------------------- */}

                    <div className="min-w-0">

                        <h1 className="truncate text-xl font-bold text-slate-900">

                            {attempt?.exam?.title ||
                                attempt?.examTitle ||
                                "Online Examination"}

                        </h1>

                        <p className="mt-1 text-sm text-slate-500">

                            Attempt #
                            {attempt?.attemptNumber ||
                                attemptId}

                        </p>

                    </div>


                    {/* -----------------------------------------
                        HEADER RIGHT
                    ----------------------------------------- */}

                    <div className="flex shrink-0 items-center gap-3">


                        {/* Progress */}

                        <div className="hidden border-r border-slate-200 pr-4 text-right sm:block">

                            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                                Answered
                            </p>

                            <p className="mt-0.5 text-sm font-bold tabular-nums text-slate-800">

                                {answeredCount}
                                /
                                {questions.length}

                            </p>

                        </div>


                        {/* Timer */}

                        <div
                            className={`
                                min-w-[125px]
                                rounded-lg
                                border
                                px-3
                                py-2
                                text-center
                                transition-colors
                                ${
                                    timeLeft !== null &&
                                    timeLeft <= 60
                                        ? "border-red-200 bg-red-50"
                                        : "border-slate-200 bg-slate-50"
                                }
                            `}
                        >

                            <p
                                className={`
                                    text-[10px]
                                    font-medium
                                    uppercase
                                    tracking-wider
                                    ${
                                        timeLeft !== null &&
                                        timeLeft <= 60
                                            ? "text-red-500"
                                            : "text-slate-400"
                                    }
                                `}
                            >
                                Time Remaining
                            </p>

                            <p
                                className={`
                                    mt-0.5
                                    text-lg
                                    font-bold
                                    tabular-nums
                                    ${
                                        timeLeft !== null &&
                                        timeLeft <= 60
                                            ? "text-red-600"
                                            : "text-slate-800"
                                    }
                                `}
                            >
                                {formatTime(timeLeft)}
                            </p>

                        </div>


                        {/* Exit */}

                        <button
                            type="button"
                            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                            onClick={() =>
                                navigate(
                                    "/student/dashboard"
                                )
                            }
                        >
                            Exit
                        </button>

                    </div>

                </div>

            </header>


            {/* =================================================
                MAIN CONTENT
            ================================================= */}

            <main className="mx-auto max-w-7xl px-6 py-7">


                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (

                    <div className="mb-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

                        <span className="font-bold">
                            !
                        </span>

                        <p>
                            {error}
                        </p>

                    </div>

                )}


                {/* =================================================
                    MAIN GRID
                ================================================= */}

                <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_270px]">


                    {/* =================================================
                        QUESTION AREA
                    ================================================= */}

                    <section className="min-w-0">


                        {/* QUESTION CARD */}

                        <article className="rounded-xl border border-slate-200 bg-white p-7 shadow-sm">


                            {/* -----------------------------------------
                                QUESTION HEADER
                            ----------------------------------------- */}

                            <div className="flex items-start justify-between gap-5 border-b border-slate-100 pb-6">

                                <div className="min-w-0">

                                    <span className="mb-2 block text-sm font-semibold text-blue-600">

                                        Question{" "}
                                        {currentQuestion + 1}
                                        {" "}
                                        of{" "}
                                        {questions.length}

                                    </span>

                                    <h2 className="text-lg font-semibold leading-7 text-slate-900">

                                        {question.questionText}

                                    </h2>

                                </div>


                                {/* Marks */}

                                <span className="shrink-0 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">

                                    {question.marks}
                                    {" "}
                                    marks

                                </span>

                            </div>


                            {/* =================================================
                                OPTIONS
                            ================================================= */}

                            <div className="mt-6 flex flex-col gap-2.5">

                                {question.options?.map(
                                    (option) => {

                                        const selected =
                                            selectedOptionId ===
                                            option.optionId;


                                        return (

                                            <label
                                                key={
                                                    option.optionId
                                                }
                                                className={`
                                                    flex
                                                    min-h-[52px]
                                                    cursor-pointer
                                                    items-center
                                                    rounded-lg
                                                    border
                                                    px-3.5
                                                    py-2.5
                                                    transition-all
                                                    ${
                                                        selected
                                                            ? "border-blue-500 bg-blue-50 shadow-sm"
                                                            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                                                    }
                                                `}
                                            >

                                                {/* Radio */}

                                                <input
                                                    type="radio"
                                                    name={
                                                        `question-${question.questionId}`
                                                    }
                                                    value={
                                                        option.optionId
                                                    }
                                                    checked={
                                                        selected
                                                    }
                                                    onChange={() =>
                                                        handleOptionChange(
                                                            question.questionId,
                                                            option.optionId
                                                        )
                                                    }
                                                    className="h-4 w-4 shrink-0 accent-blue-600"
                                                />


                                                {/* Option Letter */}

                                                <span
                                                    className={`
                                                        ml-3
                                                        mr-3
                                                        flex
                                                        h-7
                                                        w-7
                                                        shrink-0
                                                        items-center
                                                        justify-center
                                                        rounded-full
                                                        border
                                                        bg-white
                                                        text-xs
                                                        font-bold
                                                        ${
                                                            selected
                                                                ? "border-blue-500 text-blue-600"
                                                                : "border-slate-300 text-slate-500"
                                                        }
                                                    `}
                                                >

                                                    {
                                                        option.optionLabel
                                                    }

                                                </span>


                                                {/* Option Text */}

                                                <span className="text-sm leading-6 text-slate-700">

                                                    {
                                                        option.optionText
                                                    }

                                                </span>

                                            </label>

                                        );

                                    }
                                )}

                            </div>


                            {/* =================================================
                                QUESTION ACTIONS
                            ================================================= */}

                            <div className="mt-6 flex justify-end gap-2.5 border-t border-slate-100 pt-5">


                                {/* Clear */}

                                <button
                                    type="button"
                                    className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                                    onClick={() =>
                                        handleClearSelection(
                                            question.questionId
                                        )
                                    }
                                    disabled={
                                        selectedOptionId ===
                                        undefined
                                    }
                                >
                                    Clear Selection
                                </button>


                                {/* Save */}

                                <button
                                    type="button"
                                    className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                    onClick={() =>
                                        handleSaveAnswer(
                                            question.questionId
                                        )
                                    }
                                    disabled={
                                        savingQuestionId ===
                                        question.questionId
                                    }
                                >

                                    {savingQuestionId ===
                                    question.questionId
                                        ? "Saving..."
                                        : "Save Answer"}

                                </button>

                            </div>

                        </article>


                        {/* =================================================
                            PREVIOUS / NEXT
                        ================================================= */}

                        <div className="mt-4 flex items-center justify-between gap-4">


                            {/* Previous */}

                            <button
                                type="button"
                                className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                                disabled={
                                    currentQuestion === 0
                                }
                                onClick={() =>
                                    goToQuestion(
                                        currentQuestion - 1
                                    )
                                }
                            >
                                ← Previous
                            </button>


                            {/* Question counter */}

                            <span className="text-center text-sm text-slate-500">

                                Question{" "}
                                {currentQuestion + 1}
                                {" "}
                                of{" "}
                                {questions.length}

                            </span>


                            {/* Next */}

                            <button
                                type="button"
                                className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
                                disabled={
                                    currentQuestion ===
                                    questions.length - 1
                                }
                                onClick={() =>
                                    goToQuestion(
                                        currentQuestion + 1
                                    )
                                }
                            >
                                Next →
                            </button>

                        </div>

                    </section>


                    {/* =================================================
                        SIDEBAR
                    ================================================= */}

                    <aside className="lg:sticky lg:top-[100px]">


                        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">


                            {/* -----------------------------------------
                                SIDEBAR HEADING
                            ----------------------------------------- */}

                            <div className="flex items-center justify-between border-b border-slate-100 pb-4">

                                <h3 className="text-base font-semibold text-slate-900">
                                    Questions
                                </h3>

                                <span className="text-xs font-semibold text-slate-500">

                                    {answeredCount}
                                    /
                                    {questions.length}

                                </span>

                            </div>


                            {/* -----------------------------------------
                                LEGEND
                            ----------------------------------------- */}

                            <div className="mt-4 flex flex-col gap-2 text-xs text-slate-500">

                                <span className="flex items-center gap-2">

                                    <i className="h-2 w-2 rounded-full bg-green-500"></i>

                                    Answered

                                </span>

                                <span className="flex items-center gap-2">

                                    <i className="h-2 w-2 rounded-full bg-slate-300"></i>

                                    Unanswered

                                </span>

                            </div>


                            {/* -----------------------------------------
                                QUESTION GRID
                            ----------------------------------------- */}

                            <div className="mt-5 grid grid-cols-5 gap-2">

                                {questions.map(
                                    (item, index) => {

                                        const isAnswered =
                                            answers[
                                                item.questionId
                                            ] !== undefined;


                                        const isCurrent =
                                            index ===
                                            currentQuestion;


                                        return (

                                            <button
                                                key={
                                                    item.questionId
                                                }
                                                type="button"
                                                className={`
                                                    aspect-square
                                                    rounded-md
                                                    border
                                                    text-xs
                                                    font-semibold
                                                    transition-all
                                                    ${
                                                        isAnswered
                                                            ? "border-green-300 bg-green-50 text-green-700"
                                                            : "border-slate-300 bg-white text-slate-500 hover:border-blue-500"
                                                    }
                                                    ${
                                                        isCurrent
                                                            ? "border-blue-600 ring-2 ring-blue-100"
                                                            : ""
                                                    }
                                                    ${
                                                        isCurrent &&
                                                        isAnswered
                                                            ? "border-blue-600 bg-blue-50 text-blue-600"
                                                            : ""
                                                    }
                                                `}
                                                onClick={() =>
                                                    goToQuestion(
                                                        index
                                                    )
                                                }
                                            >

                                                {index + 1}

                                            </button>

                                        );

                                    }
                                )}

                            </div>


                            {/* -----------------------------------------
                                SUMMARY
                            ----------------------------------------- */}

                            <div className="mt-5 border-t border-slate-100 pt-4">

                                <div className="flex items-center justify-between py-1.5">

                                    <span className="text-xs text-slate-500">
                                        Answered
                                    </span>

                                    <strong className="text-sm text-slate-800">
                                        {answeredCount}
                                    </strong>

                                </div>

                                <div className="flex items-center justify-between py-1.5">

                                    <span className="text-xs text-slate-500">
                                        Remaining
                                    </span>

                                    <strong className="text-sm text-slate-800">
                                        {unansweredCount}
                                    </strong>

                                </div>

                            </div>


                            {/* -----------------------------------------
                                SUBMIT
                            ----------------------------------------- */}

                            <button
                                type="button"
                                className="mt-5 w-full rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                                onClick={
                                    handleSubmitExam
                                }
                                disabled={submitting}
                            >

                                {submitting
                                    ? "Submitting..."
                                    : "Submit Exam"}

                            </button>

                        </div>

                    </aside>

                </div>

            </main>

        </div>

    );

};


export default ExamPage;