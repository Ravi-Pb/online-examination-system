const Subject = ({
    subject,
    onEdit,
    onDelete
}) => {

    return (

        <div
            className="
                rounded-xl
                border border-slate-200
                bg-white
                p-6
                shadow-sm
                transition
                hover:shadow-md
            "
        >

            {/* ======================================== */}
            {/* SUBJECT HEADER */}
            {/* ======================================== */}

            <div
                className="
                    flex
                    items-center
                    justify-between
                "
            >

                {/* Subject Code */}

                <span
                    className="
                        inline-flex
                        items-center
                        rounded-md
                        bg-blue-50
                        px-3 py-1
                        text-sm
                        font-semibold
                        text-blue-700
                    "
                >

                    {subject.subjectCode}

                </span>


                {/* Subject ID */}

                <span
                    className="
                        text-xs
                        text-slate-400
                    "
                >

                    ID: {subject.subjectId}

                </span>

            </div>



            {/* ======================================== */}
            {/* SUBJECT NAME */}
            {/* ======================================== */}

            <h3
                className="
                    mt-5
                    text-lg
                    font-semibold
                    text-slate-800
                "
            >

                {subject.subjectName}

            </h3>



            {/* ======================================== */}
            {/* ACTIONS */}
            {/* ======================================== */}

            <div
                className="
                    mt-6
                    flex
                    gap-2
                "
            >

                {/* Edit */}

                <button
                    type="button"
                    onClick={() =>
                        onEdit(
                            subject.subjectId
                        )
                    }
                    className="
                        rounded-lg
                        border border-slate-300
                        px-4 py-2
                        text-sm
                        font-medium
                        text-slate-700
                        transition
                        hover:bg-slate-50
                    "
                >

                    Edit

                </button>



                {/* Delete */}

                <button
                    type="button"
                    onClick={() =>
                        onDelete(
                            subject.subjectId
                        )
                    }
                    className="
                        rounded-lg
                        border border-red-200
                        px-4 py-2
                        text-sm
                        font-medium
                        text-red-600
                        transition
                        hover:bg-red-50
                    "
                >

                    Delete

                </button>

            </div>

        </div>

    );

};


export default Subject;