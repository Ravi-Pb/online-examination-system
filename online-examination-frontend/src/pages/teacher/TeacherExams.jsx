import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../../api/axios";

const TeacherExams = () => {

    const navigate = useNavigate();

    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionLoading, setActionLoading] = useState(null);


    // ============================
    // Load all exams
    // ============================

    const fetchExams = async () => {

        try {

            setLoading(true);
            setError("");

            // const response = await axios.get(
            //     "http://localhost:8080/api/exams",
            //     {
            //         headers: {
            //             Authorization:
            //                 `Bearer ${localStorage.getItem("token")}`
            //         }
            //     }
            // );
            const response = await api.get("/exams");

            setExams(response.data);

        } catch (error) {

            console.error("Failed to load exams:", error);

            if (
                error.response?.status === 401 ||
                error.response?.status === 403
            ) {

                navigate("/login", {
                    replace: true
                });

                return;
            }

            setError(
                error.response?.data?.message ||
                "Unable to load exams."
            );

        } finally {

            setLoading(false);

        }
    };


    // ============================
    // Load exams when page opens
    // ============================

    useEffect(() => {

        fetchExams();

    }, []);


    // ============================
    // Publish exam
    // ============================

    const handlePublish = async (examId) => {

        try {

            setActionLoading(examId);
            setError("");

            await api.patch(
                `/exams/${examId}/publish`,
                {},
                // {
                //     headers: {
                //         Authorization:
                //             `Bearer ${localStorage.getItem("token")}`
                //     }
                // }
            );

            await fetchExams();

        } catch (error) {

            console.error(
                "Failed to publish exam:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to publish exam."
            );

        } finally {

            setActionLoading(null);

        }
    };


    // ============================
    // Delete exam
    // ============================

    const handleDelete = async (examId) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this exam?"
        );

        if (!confirmed) {
            return;
        }


        try {

            setActionLoading(examId);
            setError("");

            await api.delete(
                `/exams/${examId}`,
                // {
                //     headers: {
                //         Authorization:
                //             `Bearer ${localStorage.getItem("token")}`
                //     }
                // }
            );

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

            setError(
                error.response?.data?.message ||
                "Unable to delete exam."
            );

        } finally {

            setActionLoading(null);

        }
    };


    // ============================
    // Edit exam
    // ============================

    const handleEdit = (examId) => {

        navigate(
            `/teacher/exams/${examId}/edit`
        );

    };


    // ============================
    // Create exam
    // ============================

    const handleCreateExam = () => {

        navigate("/teacher/create-exam");

    };


    // ============================
    // Format date/time
    // ============================

    const formatDateTime = (dateTime) => {

        if (!dateTime) {
            return "N/A";
        }

        return new Date(
            dateTime
        ).toLocaleString();

    };


    // ============================
    // Status badge
    // ============================

    const getStatusClasses = (status) => {

        switch (status?.toUpperCase()) {

            case "PUBLISHED":
                return "bg-green-100 text-green-700";

            case "DRAFT":
                return "bg-yellow-100 text-yellow-700";

            case "ONGOING":
                return "bg-blue-100 text-blue-700";

            case "ENDED":
            case "EXPIRED":
                return "bg-red-100 text-red-700";

            default:
                return "bg-slate-100 text-slate-600";
        }
    };


    return (

        <div className="min-h-screen bg-slate-100">

            {/* =====================================
                HEADER
            ====================================== */}

            <div className="border-b bg-white">

                <div className="flex items-center justify-between px-8 py-5">

                    <div>

                        <h1 className="text-3xl font-bold text-slate-800">
                            My Exams
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            Create, manage and publish your examinations.
                        </p>

                    </div>

                    <div className="flex gap-3">
                    <button
                        onClick={handleCreateExam}
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
                        + Create Exam
                    </button>
                    <button
                         onClick={() => navigate("/teacher/dashboard")}
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
                         Teacher Dashboard 
                    </button>
                    </div>

                </div>

            </div>


            {/* =====================================
                MAIN CONTENT
            ====================================== */}

            <main className="p-8">


                {/* Error */}

                {error && (

                    <div className="
                        mb-6
                        rounded-lg
                        border border-red-200
                        bg-red-50
                        px-4 py-3
                        text-sm
                        text-red-700
                    ">
                        {error}
                    </div>

                )}


                {/* Loading */}

                {loading && (

                    <div className="
                        rounded-xl
                        bg-white
                        p-10
                        text-center
                        shadow-sm
                    ">

                        <p className="text-slate-500">
                            Loading exams...
                        </p>

                    </div>

                )}


                {/* Empty state */}

                {!loading && exams.length === 0 && (

                    <div className="
                        rounded-xl
                        border
                        border-dashed
                        border-slate-300
                        bg-white
                        p-12
                        text-center
                    ">

                        <div className="text-4xl">
                            📝
                        </div>

                        <h2 className="
                            mt-4
                            text-xl
                            font-semibold
                            text-slate-800
                        ">
                            No exams yet
                        </h2>

                        <p className="
                            mt-2
                            text-sm
                            text-slate-500
                        ">
                            Create your first examination to get started.
                        </p>

                        <button
                            onClick={handleCreateExam}
                            className="
                                mt-6
                                rounded-lg
                                bg-slate-800
                                px-5 py-3
                                text-sm font-semibold
                                text-white
                                transition
                                hover:bg-slate-700
                            "
                        >
                            Create Your First Exam
                        </button>

                    </div>

                )}


                {/* =====================================
                    EXAM CARDS
                ====================================== */}

                {!loading && exams.length > 0 && (

                    <div className="
                        grid
                        grid-cols-1
                        gap-6
                        lg:grid-cols-2
                    ">

                        {exams.map((exam) => (

                            <div
                                key={exam.examId}
                                className="
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-white
                                    p-6
                                    shadow-sm
                                    transition
                                    hover:shadow-md
                                "
                            >

                                {/* Card Header */}

                                <div className="
                                    flex
                                    items-start
                                    justify-between
                                    gap-4
                                ">

                                    <div>

                                        <h2 className="
                                            text-xl
                                            font-bold
                                            text-slate-800
                                        ">
                                            {exam.title}
                                        </h2>

                                        <p className="
                                            mt-1
                                            text-sm
                                            text-slate-500
                                        ">
                                            {exam.subjectCode ||
                                                exam.subjectName ||
                                                "No subject"}
                                        </p>

                                    </div>


                                    {/* Status */}

                                    <span
                                        className={`
                                            rounded-full
                                            px-3 py-1
                                            text-xs
                                            font-semibold
                                            ${getStatusClasses(
                                                exam.examStatus
                                            )}
                                        `}
                                    >
                                        {exam.examStatus ||
                                            "UNKNOWN"}
                                    </span>

                                </div>


                                {/* Description */}

                                {exam.examDescription && (

                                    <p className="
                                        mt-4
                                        text-sm
                                        leading-6
                                        text-slate-600
                                    ">
                                        {exam.examDescription}
                                    </p>

                                )}


                                {/* Exam Information */}

                                <div className="
                                    mt-5
                                    grid
                                    grid-cols-2
                                    gap-3
                                ">


                                    {/* Subject */}

                                    <div className="
                                        rounded-lg
                                        bg-slate-50
                                        p-3
                                    ">

                                        <p className="
                                            text-xs
                                            text-slate-500
                                        ">
                                            Subject
                                        </p>

                                        <p className="
                                            mt-1
                                            text-sm
                                            font-semibold
                                            text-slate-800
                                        ">
                                            {exam.subjectCode ||
                                                "N/A"}
                                        </p>

                                    </div>


                                    {/* Duration */}

                                    <div className="
                                        rounded-lg
                                        bg-slate-50
                                        p-3
                                    ">

                                        <p className="
                                            text-xs
                                            text-slate-500
                                        ">
                                            Duration
                                        </p>

                                        <p className="
                                            mt-1
                                            text-sm
                                            font-semibold
                                            text-slate-800
                                        ">
                                            {exam.durationMinutes
                                                ? `${exam.durationMinutes} minutes`
                                                : "N/A"}
                                        </p>

                                    </div>


                                    {/* Start */}

                                    <div className="
                                        rounded-lg
                                        bg-slate-50
                                        p-3
                                    ">

                                        <p className="
                                            text-xs
                                            text-slate-500
                                        ">
                                            Starts
                                        </p>

                                        <p className="
                                            mt-1
                                            text-sm
                                            font-semibold
                                            text-slate-800
                                        ">
                                            {formatDateTime(
                                                exam.startAt
                                            )}
                                        </p>

                                    </div>


                                    {/* End */}

                                    <div className="
                                        rounded-lg
                                        bg-slate-50
                                        p-3
                                    ">

                                        <p className="
                                            text-xs
                                            text-slate-500
                                        ">
                                            Ends
                                        </p>

                                        <p className="
                                            mt-1
                                            text-sm
                                            font-semibold
                                            text-slate-800
                                        ">
                                            {formatDateTime(
                                                exam.endAt
                                            )}
                                        </p>

                                    </div>

                                </div>


                                {/* =================================
                                    ACTION BUTTONS
                                ================================== */}

                                <div className="
                                    mt-6
                                    flex
                                    flex-wrap
                                    gap-3
                                ">


                                    {/* Edit */}

                                    <button
                                        onClick={() =>
                                            handleEdit(
                                                exam.examId
                                            )
                                        }
                                        disabled={
                                            actionLoading ===
                                            exam.examId
                                        }
                                        className="
                                            rounded-lg
                                            border
                                            border-slate-300
                                            px-4 py-2
                                            text-sm
                                            font-medium
                                            text-slate-700
                                            transition
                                            hover:bg-slate-50
                                            disabled:cursor-not-allowed
                                            disabled:opacity-50
                                        "
                                    >
                                        Edit
                                    </button>


                                    {/* Publish */}

                                    {exam.examStatus?.toUpperCase() ===
                                        "DRAFT" && (

                                        <button
                                            onClick={() =>
                                                handlePublish(
                                                    exam.examId
                                                )
                                            }
                                            disabled={
                                                actionLoading ===
                                                exam.examId
                                            }
                                            className="
                                                rounded-lg
                                                bg-green-600
                                                px-4 py-2
                                                text-sm
                                                font-medium
                                                text-white
                                                transition
                                                hover:bg-green-700
                                                disabled:cursor-not-allowed
                                                disabled:opacity-50
                                            "
                                        >
                                            {actionLoading ===
                                            exam.examId
                                                ? "Publishing..."
                                                : "Publish"}
                                        </button>

                                    )}


                                    {/* Delete */}

                                    <button
                                        onClick={() =>
                                            handleDelete(
                                                exam.examId
                                            )
                                        }
                                        disabled={
                                            actionLoading ===
                                            exam.examId
                                        }
                                        className="
                                            rounded-lg
                                            border
                                            border-red-200
                                            px-4 py-2
                                            text-sm
                                            font-medium
                                            text-red-600
                                            transition
                                            hover:bg-red-50
                                            disabled:cursor-not-allowed
                                            disabled:opacity-50
                                        "
                                    >
                                        Delete
                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </main>

        </div>
    );
};

export default TeacherExams;