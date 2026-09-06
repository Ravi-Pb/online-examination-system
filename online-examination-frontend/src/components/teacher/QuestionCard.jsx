import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";


const QuestionCard = ({
    question,
    onDelete
}) => {

    const navigate = useNavigate();

    const { examId } = useParams();

    const [showDeleteConfirm, setShowDeleteConfirm] =
        useState(false);


    // ========================================
    // SORT OPTIONS
    // ========================================

    const options =
        [...(question.options || [])]
            .sort(
                (a, b) =>
                    a.optionOrder -
                    b.optionOrder
            );


    // ========================================
    // EDIT QUESTION
    // ========================================

    const handleEdit = () => {

        navigate(
            `/teacher/exams/${examId}/questions/${question.questionId}/edit`
        );

    };


    // ========================================
    // DELETE QUESTION
    // ========================================

    const handleDeleteConfirm = () => {

        setShowDeleteConfirm(false);

        onDelete(
            question.questionId
        );

    };


    // ========================================
    // UI
    // ========================================

    return (

        <div
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


                {/* ================================= */}
                {/* QUESTION NUMBER */}
                {/* ================================= */}

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



                {/* ================================= */}
                {/* QUESTION CONTENT */}
                {/* ================================= */}

                <div className="flex-1 min-w-0">


                    {/* Question + Actions */}

                    <div
                        className="
                            flex
                            items-start
                            justify-between
                            gap-4
                        "
                    >

                        <div className="min-w-0">

                            <p
                                className="
                                    text-sm
                                    font-medium
                                    text-slate-800
                                "
                            >

                                {question.questionText}

                            </p>


                            {/* Marks */}

                            <p
                                className="
                                    mt-1
                                    text-xs
                                    text-slate-400
                                "
                            >

                                {question.marks}{" "}

                                {question.marks === 1
                                    ? "mark"
                                    : "marks"
                                }

                            </p>

                        </div>



                        {/* ================================= */}
                        {/* ACTION BUTTONS */}
                        {/* ================================= */}

                        <div
                            className="
                                flex
                                items-center
                                gap-2
                                shrink-0
                            "
                        >

                            {/* Edit */}

                            <button
                                type="button"
                                onClick={handleEdit}
                                className="
                                    rounded-lg
                                    border
                                    border-slate-300
                                    bg-white
                                    px-3
                                    py-2
                                    text-sm
                                    font-medium
                                    text-slate-700
                                    transition
                                    hover:bg-slate-100
                                "
                            >

                                Edit

                            </button>



                            {/* Delete */}

                            <button
                                type="button"
                                onClick={() =>
                                    setShowDeleteConfirm(true)
                                }
                                className="
                                    rounded-lg
                                    bg-red-50
                                    px-3
                                    py-2
                                    text-sm
                                    font-medium
                                    text-red-600
                                    transition
                                    hover:bg-red-100
                                "
                            >

                                Delete

                            </button>

                        </div>

                    </div>



                    {/* ================================= */}
                    {/* OPTIONS */}
                    {/* ================================= */}

                    {options.length > 0 && (

                        <div
                            className="
                                mt-4
                                grid
                                grid-cols-1
                                md:grid-cols-2
                                gap-2
                            "
                        >

                            {options.map(
                                (option) => (

                                    <div
                                        key={
                                            option.optionId
                                        }
                                        className="
                                            rounded-lg
                                            border
                                            border-slate-200
                                            bg-slate-50
                                            px-3
                                            py-2
                                            text-sm
                                        "
                                    >

                                        <span
                                            className="
                                                font-semibold
                                                text-slate-500
                                                mr-2
                                            "
                                        >

                                            {option.optionLabel}.

                                        </span>


                                        <span
                                            className="
                                                text-slate-700
                                            "
                                        >

                                            {option.optionText}

                                        </span>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </div>

            </div>



            {/* ========================================= */}
            {/* DELETE CONFIRMATION BOX */}
            {/* ========================================= */}

            {showDeleteConfirm && (

                <div
                    className="
                        mt-5
                        rounded-lg
                        border
                        border-red-200
                        bg-red-50
                        px-4
                        py-4
                    "
                >

                    <div
                        className="
                            flex
                            flex-col
                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                            gap-4
                        "
                    >

                        {/* Message */}

                        <div>

                            <p
                                className="
                                    text-sm
                                    font-semibold
                                    text-red-700
                                "
                            >

                                Delete this question?

                            </p>


                            <p
                                className="
                                    mt-1
                                    text-xs
                                    text-red-600
                                "
                            >

                                This action cannot be undone.

                            </p>

                        </div>



                        {/* Yes / No */}

                        <div
                            className="
                                flex
                                items-center
                                gap-2
                            "
                        >

                            {/* No */}

                            <button
                                type="button"
                                onClick={() =>
                                    setShowDeleteConfirm(false)
                                }
                                className="
                                    rounded-lg
                                    border
                                    border-slate-300
                                    bg-white
                                    px-4
                                    py-2
                                    text-sm
                                    font-medium
                                    text-slate-700
                                    transition
                                    hover:bg-slate-50
                                "
                            >

                                No

                            </button>



                            {/* Yes */}

                            <button
                                type="button"
                                onClick={
                                    handleDeleteConfirm
                                }
                                className="
                                    rounded-lg
                                    bg-red-600
                                    px-4
                                    py-2
                                    text-sm
                                    font-medium
                                    text-white
                                    transition
                                    hover:bg-red-700
                                "
                            >

                                Yes, Delete

                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );

};


export default QuestionCard;