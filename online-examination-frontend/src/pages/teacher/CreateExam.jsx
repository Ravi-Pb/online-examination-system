import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateExam = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        subjectId: "",
        examDescription: "",
        durationMinutes: "",
        startAt: "",
        endAt: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    // ================= HANDLE INPUT =================

    const handleChange = (event) => {

        const { name, value } = event.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

    };


    // ================= CREATE EXAM =================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");

        try {

            setLoading(true);

            const response = await api.post(
                "/api/exams",
                {
                    title: formData.title,

                    subjectId: Number(formData.subjectId),

                    examDescription:
                        formData.examDescription,

                    durationMinutes:
                        Number(formData.durationMinutes),

                    startAt:
                        formData.startAt,

                    endAt:
                        formData.endAt
                },
                // {
                //     headers: {
                //         Authorization:
                //             `Bearer ${localStorage.getItem("token")}`
                //     }
                // }
            );


            console.log(
                "Exam created:",
                response.data
            );


            setSuccess(
                "Exam created successfully."
            );


            // Clear form

            setFormData({
                title: "",
                subjectId: "",
                examDescription: "",
                durationMinutes: "",
                startAt: "",
                endAt: ""
            });


        } catch (error) {

            console.error(
                "Failed to create exam:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to create exam."
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="min-h-screen bg-slate-100">

            {/* ================= HEADER ================= */}

            <div
                className="
                    bg-white
                    border-b
                    border-slate-200
                    px-8
                    py-5
                "
            >

                <div
                    className="
                        max-w-4xl
                        mx-auto
                        flex
                        items-center
                        justify-between
                    "
                >

                    <div>

                        <h1
                            className="
                                text-2xl
                                font-bold
                                text-slate-800
                            "
                        >
                            Create Exam
                        </h1>

                        <p
                            className="
                                text-sm
                                text-slate-500
                                mt-1
                            "
                        >
                            Create a new examination.
                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={() =>
                            navigate("/teacher/dashboard")
                        }
                        className="
                            px-4
                            py-2
                            rounded-lg
                            border
                            border-slate-300
                            text-sm
                            font-medium
                            text-slate-700
                            hover:bg-slate-50
                            transition
                        "
                    >
                        ← Dashboard
                    </button>

                </div>

            </div>


            {/* ================= FORM ================= */}

            <main className="max-w-4xl mx-auto p-8">

                <div
                    className="
                        bg-white
                        rounded-xl
                        shadow-sm
                        border
                        border-slate-200
                        p-8
                    "
                >


                    {/* ERROR */}

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


                    {/* SUCCESS */}

                    {success && (

                        <div
                            className="
                                mb-6
                                rounded-lg
                                border
                                border-green-200
                                bg-green-50
                                px-4
                                py-3
                                text-sm
                                text-green-700
                            "
                        >
                            {success}
                        </div>

                    )}


                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6"
                    >


                        {/* TITLE */}

                        <div>

                            <label
                                className="
                                    block
                                    text-sm
                                    font-medium
                                    text-slate-700
                                    mb-2
                                "
                            >
                                Exam Title
                            </label>

                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                placeholder="Enter exam title"
                                className="
                                    w-full
                                    rounded-lg
                                    border
                                    border-slate-300
                                    px-4
                                    py-3
                                    text-sm
                                    outline-none
                                    focus:ring-2
                                    focus:ring-slate-400
                                "
                            />

                        </div>


                        {/* SUBJECT + DURATION */}

                        <div
                            className="
                                grid
                                grid-cols-1
                                md:grid-cols-2
                                gap-5
                            "
                        >

                            <div>

                                <label
                                    className="
                                        block
                                        text-sm
                                        font-medium
                                        text-slate-700
                                        mb-2
                                    "
                                >
                                    Subject ID
                                </label>

                                <input
                                    type="number"
                                    name="subjectId"
                                    value={formData.subjectId}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter subject ID"
                                    className="
                                        w-full
                                        rounded-lg
                                        border
                                        border-slate-300
                                        px-4
                                        py-3
                                        text-sm
                                        outline-none
                                        focus:ring-2
                                        focus:ring-slate-400
                                    "
                                />

                            </div>


                            <div>

                                <label
                                    className="
                                        block
                                        text-sm
                                        font-medium
                                        text-slate-700
                                        mb-2
                                    "
                                >
                                    Duration (minutes)
                                </label>

                                <input
                                    type="number"
                                    name="durationMinutes"
                                    value={formData.durationMinutes}
                                    onChange={handleChange}
                                    required
                                    min="1"
                                    placeholder="e.g. 60"
                                    className="
                                        w-full
                                        rounded-lg
                                        border
                                        border-slate-300
                                        px-4
                                        py-3
                                        text-sm
                                        outline-none
                                        focus:ring-2
                                        focus:ring-slate-400
                                    "
                                />

                            </div>

                        </div>


                        {/* DESCRIPTION */}

                        <div>

                            <label
                                className="
                                    block
                                    text-sm
                                    font-medium
                                    text-slate-700
                                    mb-2
                                "
                            >
                                Exam Description
                            </label>

                            <textarea
                                name="examDescription"
                                value={
                                    formData.examDescription
                                }
                                onChange={handleChange}
                                rows="4"
                                placeholder="Enter exam description"
                                className="
                                    w-full
                                    rounded-lg
                                    border
                                    border-slate-300
                                    px-4
                                    py-3
                                    text-sm
                                    outline-none
                                    resize-none
                                    focus:ring-2
                                    focus:ring-slate-400
                                "
                            />

                        </div>


                        {/* START + END */}

                        <div
                            className="
                                grid
                                grid-cols-1
                                md:grid-cols-2
                                gap-5
                            "
                        >

                            <div>

                                <label
                                    className="
                                        block
                                        text-sm
                                        font-medium
                                        text-slate-700
                                        mb-2
                                    "
                                >
                                    Start Date & Time
                                </label>

                                <input
                                    type="datetime-local"
                                    name="startAt"
                                    value={formData.startAt}
                                    onChange={handleChange}
                                    required
                                    className="
                                        w-full
                                        rounded-lg
                                        border
                                        border-slate-300
                                        px-4
                                        py-3
                                        text-sm
                                        outline-none
                                        focus:ring-2
                                        focus:ring-slate-400
                                    "
                                />

                            </div>


                            <div>

                                <label
                                    className="
                                        block
                                        text-sm
                                        font-medium
                                        text-slate-700
                                        mb-2
                                    "
                                >
                                    End Date & Time
                                </label>

                                <input
                                    type="datetime-local"
                                    name="endAt"
                                    value={formData.endAt}
                                    onChange={handleChange}
                                    required
                                    className="
                                        w-full
                                        rounded-lg
                                        border
                                        border-slate-300
                                        px-4
                                        py-3
                                        text-sm
                                        outline-none
                                        focus:ring-2
                                        focus:ring-slate-400
                                    "
                                />

                            </div>

                        </div>


                        {/* ACTIONS */}

                        <div
                            className="
                                pt-4
                                border-t
                                border-slate-200
                                flex
                                justify-end
                                gap-3
                            "
                        >

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/teacher/dashboard"
                                    )
                                }
                                className="
                                    px-5
                                    py-2.5
                                    rounded-lg
                                    border
                                    border-slate-300
                                    text-sm
                                    font-medium
                                    text-slate-700
                                    hover:bg-slate-50
                                "
                            >
                                Cancel
                            </button>


                            <button
                                type="submit"
                                disabled={loading}
                                className="
                                    px-5
                                    py-2.5
                                    rounded-lg
                                    bg-slate-900
                                    text-white
                                    text-sm
                                    font-medium
                                    hover:bg-slate-800
                                    disabled:opacity-50
                                    disabled:cursor-not-allowed
                                "
                            >

                                {loading
                                    ? "Creating..."
                                    : "Create Exam"
                                }

                            </button>

                        </div>

                    </form>

                </div>

            </main>

        </div>

    );
};

export default CreateExam;