import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getAnswerReview } from "../api/examApi";
import { useAuth } from "../context/AuthContext";


const AnswerReview = () => {

    const { attemptId } = useParams();
    const navigate = useNavigate();

    const { logout } = useAuth();

    const [review, setReview] = useState([]);

    const [currentQuestion, setCurrentQuestion] =
        useState(0);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // ----------------------------------------
    // Load review
    // ----------------------------------------

    useEffect(() => {

        loadReview();

    }, [attemptId]);


    const loadReview = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await getAnswerReview(attemptId);

            setReview(response.data || []);

        } catch (error) {

            console.error(
                "Failed to load answer review:",
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
                "Unable to load answer review."
            );

        } finally {

            setLoading(false);

        }
    };


    // ----------------------------------------
    // Navigation
    // ----------------------------------------

    const goToQuestion = (index) => {

        if (
            index < 0 ||
            index >= review.length
        ) {
            return;
        }

        setCurrentQuestion(index);
    };


    // ----------------------------------------
    // Loading
    // ----------------------------------------

    if (loading) {

        return (

            <div className="min-h-screen bg-slate-50">

                <div className="flex min-h-screen items-center justify-center">

                    <div className="text-center">

                        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

                        <p className="text-sm text-slate-500">
                            Loading answer review...
                        </p>

                    </div>

                </div>

            </div>

        );
    }


    // ----------------------------------------
    // Error
    // ----------------------------------------

    if (error) {

        return (

            <div className="min-h-screen bg-slate-50">

                <main className="mx-auto max-w-3xl px-4 py-12">

                    <div className="rounded-xl border border-red-200 bg-white p-8 text-center shadow-sm">

                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">

                            !

                        </div>

                        <h2 className="text-xl font-semibold text-slate-900">
                            Unable to Load Review
                        </h2>

                        <p className="mt-2 text-sm text-slate-500">
                            {error}
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    `/result/${attemptId}`
                                )
                            }
                            className="mt-6 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                        >
                            Back to Result
                        </button>

                    </div>

                </main>

            </div>

        );
    }


    // ----------------------------------------
    // No review
    // ----------------------------------------

    if (review.length === 0) {

        return (

            <div className="min-h-screen bg-slate-50">

                <main className="mx-auto max-w-3xl px-4 py-12">

                    <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">

                        <h2 className="text-xl font-semibold text-slate-900">
                            No Review Available
                        </h2>

                        <p className="mt-2 text-sm text-slate-500">
                            There are no questions available
                            for this attempt.
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    `/result/${attemptId}`
                                )
                            }
                            className="mt-6 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                        >
                            Back to Result
                        </button>

                    </div>

                </main>

            </div>

        );
    }


    const question =
        review[currentQuestion];


    // ----------------------------------------
    // Statistics
    // ----------------------------------------

    const correctCount =
        review.filter(
            item => item.correct === true
        ).length;

    const answeredCount =
        review.filter(
            item =>
                item.selectedOptionLabel !== null &&
                item.selectedOptionLabel !== undefined
        ).length;

    const unansweredCount =
        review.length -
        answeredCount;

    const obtainedMarks =
        review.reduce(
            (total, item) =>
                total +
                Number(item.marksObtained || 0),
            0
        );

    const totalMarks =
        review.reduce(
            (total, item) =>
                total +
                Number(item.questionMarks || 0),
            0
        );


    const isAnswered =
        question.selectedOptionLabel !== null &&
        question.selectedOptionLabel !== undefined;

    const isCorrect =
        question.correct === true;


    // ----------------------------------------
    // Main UI
    // ----------------------------------------

    return (

        <div className="min-h-screen bg-slate-50 text-slate-800">


            {/* ==================================
                HEADER
            ================================== */}

            <header className="sticky top-0 z-20 border-b border-slate-200 bg-white shadow-sm">

                <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">

                    <div>

                        <h1 className="text-lg font-bold text-slate-900 sm:text-xl">
                            Answer Review
                        </h1>

                        <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                            Attempt #{attemptId}
                        </p>

                    </div>


                    <div className="flex items-center gap-3">

                        <div className="hidden rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-center sm:block">

                            <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500">
                                Score
                            </p>

                            <p className="text-sm font-bold text-slate-900">
                                {obtainedMarks}
                                {" / "}
                                {totalMarks}
                            </p>

                        </div>


                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    `/result/${attemptId}`
                                )
                            }
                            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                            Back to Result
                        </button>

                    </div>

                </div>

            </header>


            {/* ==================================
                MAIN
            ================================== */}

            <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">


                {/* ==================================
                    SUMMARY
                ================================== */}

                <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">

                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">

                        <p className="text-xs text-slate-500">
                            Questions
                        </p>

                        <p className="mt-1 text-2xl font-bold text-slate-900">
                            {review.length}
                        </p>

                    </div>


                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">

                        <p className="text-xs text-emerald-700">
                            Correct
                        </p>

                        <p className="mt-1 text-2xl font-bold text-emerald-700">
                            {correctCount}
                        </p>

                    </div>


                    <div className="rounded-xl border border-red-200 bg-red-50 p-4">

                        <p className="text-xs text-red-700">
                            Incorrect
                        </p>

                        <p className="mt-1 text-2xl font-bold text-red-700">
                            {answeredCount - correctCount}
                        </p>

                    </div>


                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">

                        <p className="text-xs text-slate-500">
                            Unanswered
                        </p>

                        <p className="mt-1 text-2xl font-bold text-slate-700">
                            {unansweredCount}
                        </p>

                    </div>

                </div>


                {/* ==================================
                    LAYOUT
                ================================== */}

                <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">


                    {/* ==================================
                        QUESTION
                    ================================== */}

                    <section>

                        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">


                            {/* Question header */}

                            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5">

                                <div>

                                    <p className="text-sm font-semibold text-blue-600">
                                        Question {currentQuestion + 1}
                                        {" "}
                                        of
                                        {" "}
                                        {review.length}
                                    </p>

                                    <h2 className="mt-3 text-lg font-semibold leading-7 text-slate-900 sm:text-xl">
                                        {question.questionText}
                                    </h2>

                                </div>


                                <span className="shrink-0 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">

                                    {question.questionMarks}
                                    {" "}
                                    marks

                                </span>

                            </div>


                            {/* Status */}

                            <div className="mt-5">

                                {isCorrect ? (

                                    <div className="flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">

                                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700">
                                            ✓
                                        </span>

                                        <div>

                                            <p className="text-sm font-semibold text-emerald-800">
                                                Correct Answer
                                            </p>

                                            <p className="text-xs text-emerald-700">
                                                You earned {question.marksObtained || 0} marks.
                                            </p>

                                        </div>

                                    </div>

                                ) : isAnswered ? (

                                    <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">

                                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-100 font-bold text-red-700">
                                            ✕
                                        </span>

                                        <div>

                                            <p className="text-sm font-semibold text-red-800">
                                                Incorrect Answer
                                            </p>

                                            <p className="text-xs text-red-700">
                                                You earned {question.marksObtained || 0} marks.
                                            </p>

                                        </div>

                                    </div>

                                ) : (

                                    <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">

                                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 font-bold text-slate-500">
                                            —
                                        </span>

                                        <div>

                                            <p className="text-sm font-semibold text-slate-700">
                                                Unanswered
                                            </p>

                                            <p className="text-xs text-slate-500">
                                                No marks were awarded.
                                            </p>

                                        </div>

                                    </div>

                                )}

                            </div>


                            {/* Your answer */}

                            <div className="mt-6">

                                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Your Answer
                                </p>


                                {isAnswered ? (

                                    <div
                                        className={
                                            `rounded-lg border p-4 ${
                                                isCorrect
                                                    ? "border-emerald-200 bg-emerald-50"
                                                    : "border-red-200 bg-red-50"
                                            }`
                                        }
                                    >

                                        <div className="flex items-start gap-3">

                                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-current text-xs font-bold">

                                                {
                                                    question.selectedOptionLabel
                                                }

                                            </span>

                                            <p className="text-sm leading-6 text-slate-800">
                                                {
                                                    question.selectedOptionText
                                                }
                                            </p>

                                        </div>

                                    </div>

                                ) : (

                                    <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
                                        You did not answer this question.
                                    </div>

                                )}

                            </div>


                            {/* Correct answer */}

                            <div className="mt-5">

                                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Correct Answer
                                </p>


                                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">

                                    <div className="flex items-start gap-3">

                                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-emerald-400 text-xs font-bold text-emerald-700">

                                            {
                                                question.correctOptionLabel
                                            }

                                        </span>

                                        <p className="text-sm leading-6 text-slate-800">

                                            {
                                                question.correctOptionText
                                            }

                                        </p>

                                    </div>

                                </div>

                            </div>


                            {/* Marks */}

                            <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-5">

                                <span className="text-sm text-slate-500">
                                    Marks obtained
                                </span>

                                <span className="text-sm font-bold text-slate-900">

                                    {question.marksObtained || 0}
                                    {" / "}
                                    {question.questionMarks}

                                </span>

                            </div>

                        </div>


                        {/* Navigation */}

                        <div className="mt-4 flex items-center justify-between gap-3">

                            <button
                                type="button"
                                disabled={
                                    currentQuestion === 0
                                }
                                onClick={() =>
                                    goToQuestion(
                                        currentQuestion - 1
                                    )
                                }
                                className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                ← Previous
                            </button>


                            <span className="text-xs text-slate-500 sm:text-sm">

                                {currentQuestion + 1}
                                {" / "}
                                {review.length}

                            </span>


                            <button
                                type="button"
                                disabled={
                                    currentQuestion ===
                                    review.length - 1
                                }
                                onClick={() =>
                                    goToQuestion(
                                        currentQuestion + 1
                                    )
                                }
                                className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Next →
                            </button>

                        </div>

                    </section>


                    {/* ==================================
                        SIDEBAR
                    ================================== */}

                    <aside className="lg:sticky lg:top-24">

                        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                            <div className="flex items-center justify-between border-b border-slate-100 pb-4">

                                <div>

                                    <h3 className="text-base font-semibold text-slate-900">
                                        Questions
                                    </h3>

                                    <p className="mt-1 text-xs text-slate-500">
                                        Review your answers
                                    </p>

                                </div>

                                <span className="text-sm font-semibold text-slate-600">
                                    {correctCount}/{review.length}
                                </span>

                            </div>


                            {/* Legend */}

                            <div className="mt-4 space-y-2 text-xs text-slate-500">

                                <div className="flex items-center gap-2">

                                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />

                                    Correct

                                </div>

                                <div className="flex items-center gap-2">

                                    <span className="h-2.5 w-2.5 rounded-full bg-red-500" />

                                    Incorrect

                                </div>

                                <div className="flex items-center gap-2">

                                    <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />

                                    Unanswered

                                </div>

                            </div>


                            {/* Question grid */}

                            <div className="mt-5 grid grid-cols-5 gap-2">

                                {review.map(
                                    (item, index) => {

                                        const answered =
                                            item.selectedOptionLabel !==
                                            null &&
                                            item.selectedOptionLabel !==
                                            undefined;

                                        const correct =
                                            item.correct === true;

                                        const current =
                                            index ===
                                            currentQuestion;


                                        let classes =
                                            "border-slate-300 bg-white text-slate-600";

                                        if (correct) {

                                            classes =
                                                "border-emerald-300 bg-emerald-50 text-emerald-700";

                                        } else if (answered) {

                                            classes =
                                                "border-red-300 bg-red-50 text-red-700";

                                        }


                                        if (current) {

                                            classes +=
                                                " ring-2 ring-blue-500 ring-offset-1";

                                        }


                                        return (

                                            <button
                                                key={
                                                    item.questionId
                                                }
                                                type="button"
                                                onClick={() =>
                                                    goToQuestion(
                                                        index
                                                    )
                                                }
                                                className={
                                                    `flex aspect-square items-center justify-center rounded-lg border text-xs font-semibold transition hover:scale-105 ${classes}`
                                                }
                                            >

                                                {index + 1}

                                            </button>

                                        );

                                    }
                                )}

                            </div>


                            {/* Summary */}

                            <div className="mt-5 space-y-3 border-t border-slate-100 pt-5">

                                <div className="flex justify-between text-sm">

                                    <span className="text-slate-500">
                                        Correct
                                    </span>

                                    <span className="font-semibold text-emerald-600">
                                        {correctCount}
                                    </span>

                                </div>


                                <div className="flex justify-between text-sm">

                                    <span className="text-slate-500">
                                        Incorrect
                                    </span>

                                    <span className="font-semibold text-red-600">
                                        {answeredCount - correctCount}
                                    </span>

                                </div>


                                <div className="flex justify-between text-sm">

                                    <span className="text-slate-500">
                                        Unanswered
                                    </span>

                                    <span className="font-semibold text-slate-600">
                                        {unansweredCount}
                                    </span>

                                </div>

                            </div>


                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        `/result/${attemptId}`
                                    )
                                }
                                className="mt-5 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                                Back to Result
                            </button>

                        </div>

                    </aside>

                </div>

            </main>

        </div>

    );

};


export default AnswerReview;