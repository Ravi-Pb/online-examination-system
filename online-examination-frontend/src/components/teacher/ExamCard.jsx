import { useNavigate } from "react-router-dom";


const ExamCard = ({
    exam,
    onDelete,
    onPublish,
    actionLoading
}) => {

    const navigate = useNavigate();


    // ========================================
    // DATE FORMAT
    // ========================================

    const formatDateTime = (dateTime) => {

        if (!dateTime) {
            return "N/A";
        }

        return new Date(dateTime).toLocaleString();

    };


    // ========================================
    // STATUS STYLE
    // ========================================

    const getStatusStyle = (status) => {

        switch (status) {

            case "PUBLISHED":
                return "bg-green-100 text-green-700";

            case "DRAFT":
                return "bg-yellow-100 text-yellow-700";

            case "COMPLETED":
                return "bg-blue-100 text-blue-700";

            case "EXPIRED":
                return "bg-red-100 text-red-700";

            default:
                return "bg-slate-100 text-slate-600";

        }

    };


    // ========================================
    // UI
    // ========================================

    return (

        <div
            className="
                h-full
                bg-white
                rounded-xl
                border border-slate-200
                shadow-sm
                hover:shadow-md
                transition
                p-5
                flex
                flex-col
            "
        >

            {/* ================================= */}
            {/* HEADER */}
            {/* ================================= */}

            <div>

                <div className="flex items-start justify-between gap-3">

                    <h4
                        className="
                            text-lg
                            font-semibold
                            text-slate-800
                            leading-tight
                        "
                    >
                        {exam.title}
                    </h4>


                    {exam.examStatus && (

                        <span
                            className={`
                                shrink-0
                                px-2.5
                                py-1
                                rounded-full
                                text-xs
                                font-semibold
                                ${getStatusStyle(
                                    exam.examStatus
                                )}
                            `}
                        >
                            {exam.examStatus}
                        </span>

                    )}

                </div>


                {/* Subject */}

                <p className="mt-2 text-sm text-slate-500">

                    {exam.subjectCode || "N/A"}

                    {exam.subjectName && (
                        <>
                            {" • "}
                            {exam.subjectName}
                        </>
                    )}

                </p>

            </div>


            {/* ================================= */}
            {/* EXAM DETAILS */}
            {/* ================================= */}

            <div className="mt-5 space-y-3">

                {/* Duration */}

                <div
                    className="
                        rounded-lg
                        bg-slate-50
                        border border-slate-100
                        p-3
                    "
                >

                    <p className="text-xs text-slate-500">
                        Duration
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-700">

                        {exam.durationMinutes
                            ? `${exam.durationMinutes} minutes`
                            : "N/A"
                        }

                    </p>

                </div>


                {/* Starts */}

                <div
                    className="
                        rounded-lg
                        bg-slate-50
                        border border-slate-100
                        p-3
                    "
                >

                    <p className="text-xs text-slate-500">
                        Starts
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-700">

                        {formatDateTime(
                            exam.startAt
                        )}

                    </p>

                </div>


                {/* Ends */}

                <div
                    className="
                        rounded-lg
                        bg-slate-50
                        border border-slate-100
                        p-3
                    "
                >

                    <p className="text-xs text-slate-500">
                        Ends
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-700">

                        {formatDateTime(
                            exam.endAt
                        )}

                    </p>

                </div>

            </div>


            {/* ================================= */}
            {/* ACTIONS */}
            {/* ================================= */}

            <div
                className="
                    mt-5
                    pt-4
                    border-t border-slate-200
                    flex
                    flex-wrap
                    gap-2
                "
            >

                {/* Questions */}

                <button
                    onClick={() =>
                        navigate(
                            `/teacher/exams/${exam.examId}/questions`
                        )
                    }
                    className="
                        flex-1
                        min-w-[100px]
                        px-3
                        py-2
                        rounded-lg
                        border
                        border-slate-300
                        text-slate-700
                        text-sm
                        font-medium
                        hover:bg-slate-100
                        transition
                    "
                >
                    Questions
                </button>

                {/* Delete */}

                <button
                    onClick={() =>
                        onDelete(
                            exam.examId
                        )
                    }
                    disabled={
                        actionLoading ===
                        `delete-${exam.examId}`
                    }
                    className="
                        flex-1
                        min-w-[90px]
                        px-3
                        py-2
                        rounded-lg
                        bg-red-600
                        text-white
                        text-sm
                        font-medium
                        hover:bg-red-700
                        disabled:opacity-50
                        disabled:cursor-not-allowed
                        transition
                    "
                >

                    {actionLoading ===
                    `delete-${exam.examId}`
                        ? "Deleting..."
                        : "Delete"
                    }

                </button>


                {/* Publish */}

                {exam.examStatus === "DRAFT" && (

                    <button
                        onClick={() =>
                            onPublish(
                                exam.examId
                            )
                        }
                        disabled={
                            actionLoading ===
                            `publish-${exam.examId}`
                        }
                        className="
                            flex-1
                            min-w-[90px]
                            px-3
                            py-2
                            rounded-lg
                            bg-green-600
                            text-white
                            text-sm
                            font-medium
                            hover:bg-green-700
                            disabled:opacity-50
                            disabled:cursor-not-allowed
                            transition
                        "
                    >

                        {actionLoading ===
                        `publish-${exam.examId}`
                            ? "Publishing..."
                            : "Publish"
                        }

                    </button>

                )}


                

            </div>

        </div>

    );

};


export default ExamCard;