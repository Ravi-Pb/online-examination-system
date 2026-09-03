import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const AddQuestion = () => {

    const navigate = useNavigate();

    const { examId } = useParams();

    const [question, setQuestion] = useState("");

    const [optionA, setOptionA] = useState("");
    const [optionB, setOptionB] = useState("");
    const [optionC, setOptionC] = useState("");
    const [optionD, setOptionD] = useState("");

    const [correctOption, setCorrectOption] = useState("");

    const [marks, setMarks] = useState(1);

    const [questionOrder, setQuestionOrder] = useState(1);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");


    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");

        const token = localStorage.getItem("token");

        if (!token) {

            navigate("/login", {
                replace: true
            });

            return;
        }


        if (!examId) {

            setError("Exam ID is missing.");

            return;
        }


        setLoading(true);


        try {

            const questionData = {

                questionText: question,

                marks: Number(marks),

                questionOrder: Number(questionOrder),

                options: [

                    {
                        optionLabel: "A",
                        optionText: optionA,
                        correct: correctOption === "A",
                        optionOrder: 1
                    },

                    {
                        optionLabel: "B",
                        optionText: optionB,
                        correct: correctOption === "B",
                        optionOrder: 2
                    },

                    {
                        optionLabel: "C",
                        optionText: optionC,
                        correct: correctOption === "C",
                        optionOrder: 3
                    },

                    {
                        optionLabel: "D",
                        optionText: optionD,
                        correct: correctOption === "D",
                        optionOrder: 4
                    }

                ]

            };


            console.log(
                "Creating question:",
                questionData
            );


            const response = await axios.post(

                `http://localhost:8080/api/exams/${examId}/questions`,

                questionData,

                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }

            );


            console.log(
                "Question created:",
                response.data
            );


            setSuccess("Question added successfully.");


            // Go back to questions after a short delay

            setTimeout(() => {

                navigate("/teacher/questions");

            }, 1000);


        } catch (error) {

            console.error(
                "Failed to create question:",
                error
            );


            const status =
                error.response?.status;


            if (status === 401 || status === 403) {

                navigate("/login", {
                    replace: true
                });

                return;
            }


            setError(
                error.response?.data?.message ||
                "Unable to create question."
            );


        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="min-h-screen bg-slate-100">

            {/* Header */}

            <header className="border-b border-slate-200 bg-white">

                <div className="flex items-center justify-between px-8 py-5">

                    <div>

                        <h1 className="text-2xl font-bold text-slate-800">
                            Add Question
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            Add a new question to examination #{examId}
                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={() =>
                            navigate("/teacher/questions")
                        }
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
                        Question Bank
                    </button>

                </div>

            </header>


            {/* Main Content */}

            <main className="mx-auto max-w-4xl px-6 py-10">

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


                    {/* Success */}

                    {success && (

                        <div className="
                            mb-6
                            rounded-lg
                            border border-green-200
                            bg-green-50
                            px-4 py-3
                            text-sm
                            text-green-700
                        ">
                            {success}
                        </div>

                    )}


                    {/* Question */}

                    <div className="mb-8">

                        <label className="
                            mb-2 block
                            text-sm font-semibold
                            text-slate-700
                        ">
                            Question
                        </label>

                        <textarea
                            value={question}
                            onChange={(e) =>
                                setQuestion(e.target.value)
                            }
                            placeholder="Enter your question..."
                            rows="4"
                            required
                            className="
                                w-full
                                rounded-lg
                                border border-slate-300
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


                    {/* Question Order */}

                    <div className="mb-8">

                        <label className="
                            mb-2 block
                            text-sm font-semibold
                            text-slate-700
                        ">
                            Question Order
                        </label>

                        <input
                            type="number"
                            min="1"
                            value={questionOrder}
                            onChange={(e) =>
                                setQuestionOrder(e.target.value)
                            }
                            required
                            className="
                                w-full
                                rounded-lg
                                border border-slate-300
                                px-4 py-3
                                text-sm
                                outline-none
                                focus:border-slate-500
                                focus:ring-2
                                focus:ring-slate-200
                            "
                        />

                        <p className="mt-1 text-xs text-slate-500">
                            Position of this question in the exam.
                        </p>

                    </div>


                    {/* Options */}

                    <div className="mb-8">

                        <h2 className="
                            mb-4
                            text-lg font-semibold
                            text-slate-800
                        ">
                            Answer Options
                        </h2>


                        {/* A */}

                        <div className="mb-4">

                            <label className="
                                mb-2 block
                                text-sm font-medium
                                text-slate-600
                            ">
                                Option A
                            </label>

                            <input
                                type="text"
                                value={optionA}
                                onChange={(e) =>
                                    setOptionA(e.target.value)
                                }
                                placeholder="Enter option A"
                                required
                                className="
                                    w-full
                                    rounded-lg
                                    border border-slate-300
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

                            <label className="
                                mb-2 block
                                text-sm font-medium
                                text-slate-600
                            ">
                                Option B
                            </label>

                            <input
                                type="text"
                                value={optionB}
                                onChange={(e) =>
                                    setOptionB(e.target.value)
                                }
                                placeholder="Enter option B"
                                required
                                className="
                                    w-full
                                    rounded-lg
                                    border border-slate-300
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

                            <label className="
                                mb-2 block
                                text-sm font-medium
                                text-slate-600
                            ">
                                Option C
                            </label>

                            <input
                                type="text"
                                value={optionC}
                                onChange={(e) =>
                                    setOptionC(e.target.value)
                                }
                                placeholder="Enter option C"
                                required
                                className="
                                    w-full
                                    rounded-lg
                                    border border-slate-300
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

                            <label className="
                                mb-2 block
                                text-sm font-medium
                                text-slate-600
                            ">
                                Option D
                            </label>

                            <input
                                type="text"
                                value={optionD}
                                onChange={(e) =>
                                    setOptionD(e.target.value)
                                }
                                placeholder="Enter option D"
                                required
                                className="
                                    w-full
                                    rounded-lg
                                    border border-slate-300
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


                    {/* Correct Answer + Marks */}

                    <div className="
                        grid
                        grid-cols-1
                        gap-6
                        md:grid-cols-2
                    ">

                        {/* Correct Option */}

                        <div>

                            <label className="
                                mb-2 block
                                text-sm font-semibold
                                text-slate-700
                            ">
                                Correct Answer
                            </label>

                            <select
                                value={correctOption}
                                onChange={(e) =>
                                    setCorrectOption(e.target.value)
                                }
                                required
                                className="
                                    w-full
                                    rounded-lg
                                    border border-slate-300
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

                            <label className="
                                mb-2 block
                                text-sm font-semibold
                                text-slate-700
                            ">
                                Marks
                            </label>

                            <input
                                type="number"
                                min="1"
                                value={marks}
                                onChange={(e) =>
                                    setMarks(e.target.value)
                                }
                                required
                                className="
                                    w-full
                                    rounded-lg
                                    border border-slate-300
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


                    {/* Buttons */}

                    <div className="
                        mt-10
                        flex justify-end gap-3
                        border-t border-slate-200
                        pt-6
                    ">

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/teacher/questions")
                            }
                            className="
                                rounded-lg
                                border border-slate-300
                                bg-white
                                px-5 py-3
                                text-sm font-semibold
                                text-slate-700
                                transition
                                hover:bg-slate-50
                            "
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            disabled={loading}
                            className="
                                rounded-lg
                                bg-slate-800
                                px-6 py-3
                                text-sm font-semibold
                                text-white
                                shadow-sm
                                transition
                                hover:bg-slate-700
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >

                            {loading
                                ? "Adding..."
                                : "Add Question"}

                        </button>

                    </div>

                </form>

            </main>

        </div>
    );
};

export default AddQuestion;