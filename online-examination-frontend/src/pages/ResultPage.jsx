import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getExamResult } from "../api/examApi";
import { useAuth } from "../context/AuthContext";

const ResultPage = () => {

    const navigate = useNavigate();
    const { attemptId } = useParams();

    const { logout } = useAuth();

    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadResult();
    }, [attemptId]);

    const loadResult = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await getExamResult(attemptId);

            setResult(response.data);

        } catch (error) {

            console.error(
                "Failed to load result:",
                error
            );

            if (
                error.response?.status === 401 ||
                error.response?.status === 403
            ) {

                logout();

                navigate("/login", {
                    replace: true
                });

                return;
            }

            setError(
                error.response?.data?.message ||
                "Unable to load exam result."
            );

        } finally {

            setLoading(false);

        }
    };


    // =========================
    // LOADING
    // =========================

    if (loading) {

        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">

                <div className="text-center">

                    <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

                    <p className="text-sm text-slate-500">
                        Loading result...
                    </p>

                </div>

            </div>
        );
    }


    // =========================
    // ERROR
    // =========================

    if (error) {

        return (
            <div className="min-h-screen bg-slate-50 px-4 py-10">

                <div className="mx-auto max-w-2xl">

                    <div className="rounded-xl border border-red-200 bg-white p-8 text-center shadow-sm">

                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-xl font-bold text-red-600">
                            !
                        </div>

                        <h1 className="mt-4 text-xl font-bold text-slate-900">
                            Unable to Load Result
                        </h1>

                        <p className="mt-2 text-sm text-slate-500">
                            {error}
                        </p>

                        <div className="mt-6 flex justify-center gap-3">

                            <button
                                type="button"
                                onClick={loadResult}
                                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                            >
                                Try Again
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    navigate("/dashboard")
                                }
                                className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                                Dashboard
                            </button>

                        </div>

                    </div>

                </div>

            </div>
        );
    }


    if (!result) {
        return null;
    }


    // =========================
    // RESULT DATA
    // =========================

    const isPassed =
        result.resultStatus === "PASS";

    const percentage =
        Number(result.percentage || 0);

    const obtainedMarks =
        Number(result.obtainedMarks || 0);

    const totalMarks =
        Number(result.totalMarks || 0);


    // =========================
    // MAIN UI
    // =========================

    return (

        <div className="min-h-screen bg-slate-50 text-slate-800">

            {/* =========================
                HEADER
            ========================= */}

            <header className="border-b border-slate-200 bg-white">

                <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">

                    <div>

                        <h1 className="text-lg font-bold text-slate-900 sm:text-xl">
                            Examination Result
                        </h1>

                        <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                            Attempt #{result.attemptNumber}
                        </p>

                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/dashboard")
                        }
                        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                        Dashboard
                    </button>

                </div>

            </header>


            {/* =========================
                MAIN
            ========================= */}

            <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">


                {/* Exam title */}

                <div className="mb-6">

                    <p className="text-sm font-semibold text-blue-600">
                        RESULT
                    </p>

                    <h2 className="mt-1 text-2xl font-bold text-slate-900">
                        {result.examTitle}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Attempt #{result.attemptNumber}
                    </p>

                </div>


                {/* =========================
                    SCORE
                ========================= */}

                <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

                    <div className="grid gap-8 md:grid-cols-2 md:items-center">


                        {/* Score */}

                        <div className="text-center md:text-left">

                            <p className="text-sm font-medium text-slate-500">
                                Your Score
                            </p>

                            <div className="mt-2">

                                <span className="text-5xl font-bold text-slate-900">
                                    {obtainedMarks}
                                </span>

                                <span className="ml-2 text-xl text-slate-400">
                                    / {totalMarks}
                                </span>

                            </div>

                            <p className="mt-2 text-lg font-semibold text-slate-600">
                                {percentage.toFixed(2)}%
                            </p>

                        </div>


                        {/* Status */}

                        <div className="flex justify-center md:justify-end">

                            <div
                                className={
                                    isPassed
                                        ? "rounded-xl border border-emerald-200 bg-emerald-50 px-10 py-6 text-center"
                                        : "rounded-xl border border-red-200 bg-red-50 px-10 py-6 text-center"
                                }
                            >

                                <p
                                    className={
                                        isPassed
                                            ? "text-sm font-medium text-emerald-700"
                                            : "text-sm font-medium text-red-700"
                                    }
                                >
                                    Result Status
                                </p>

                                <p
                                    className={
                                        isPassed
                                            ? "mt-1 text-3xl font-bold text-emerald-700"
                                            : "mt-1 text-3xl font-bold text-red-700"
                                    }
                                >
                                    {result.resultStatus}
                                </p>

                            </div>

                        </div>

                    </div>

                </section>


                {/* =========================
                    STATISTICS
                ========================= */}

                <section className="mt-6">

                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">


                        {/* Total */}

                        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                Questions
                            </p>

                            <p className="mt-2 text-2xl font-bold text-slate-900">
                                {result.totalQuestions}
                            </p>

                        </div>


                        {/* Correct */}

                        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">

                            <p className="text-xs font-medium uppercase tracking-wide text-emerald-700">
                                Correct
                            </p>

                            <p className="mt-2 text-2xl font-bold text-emerald-700">
                                {result.correctAnswers}
                            </p>

                        </div>


                        {/* Wrong */}

                        <div className="rounded-xl border border-red-200 bg-red-50 p-5">

                            <p className="text-xs font-medium uppercase tracking-wide text-red-700">
                                Wrong
                            </p>

                            <p className="mt-2 text-2xl font-bold text-red-700">
                                {result.wrongAnswers}
                            </p>

                        </div>


                        {/* Unanswered */}

                        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                Unanswered
                            </p>

                            <p className="mt-2 text-2xl font-bold text-slate-700">
                                {result.unanswered}
                            </p>

                        </div>

                    </div>

                </section>


                {/* =========================
                    ACTIONS
                ========================= */}

                <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    `/review/${attemptId}`
                                )
                            }
                            className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                        >
                            Review Answers
                        </button>


                        <button
                            type="button"
                            onClick={() =>
                                navigate("/dashboard")
                            }
                            className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                            Back to Dashboard
                        </button>

                    </div>

                </section>

            </main>

        </div>
    );
};

export default ResultPage;