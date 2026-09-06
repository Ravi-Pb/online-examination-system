import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import {
    createExam,
    getSubjects
} from "../../api/examApi";

import TeacherSidebar from "../../components/teacher/TeacherSidebar";


const CreateExam = () => {

    const navigate = useNavigate();

    const {
        logout
    } = useAuth();


    // ========================================
    // STATE
    // ========================================

    const [title, setTitle] = useState("");

    const [description, setDescription] = useState("");

    const [subjectId, setSubjectId] = useState("");

    const [duration, setDuration] = useState("");

    const [startDateTime, setStartDateTime] = useState("");

    const [endDateTime, setEndDateTime] = useState("");

    const [subjects, setSubjects] = useState([]);

    const [loadingSubjects, setLoadingSubjects] =
        useState(true);

    const [submitting, setSubmitting] =
        useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");



    // ========================================
    // LOAD SUBJECTS
    // ========================================

    useEffect(() => {

        const loadSubjects = async () => {

            try {

                setLoadingSubjects(true);
                setError("");


                // --------------------------------
                // CHECK TOKEN
                // --------------------------------

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


                // --------------------------------
                // GET SUBJECTS
                // --------------------------------

                const data =
                    await getSubjects();


                setSubjects(
                    Array.isArray(data)
                        ? data
                        : []
                );


            } catch (error) {

                console.error(
                    "Failed to load subjects:",
                    error
                );


                const status =
                    error.response?.status;


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
                    "Unable to load subjects."
                );


            } finally {

                setLoadingSubjects(false);

            }

        };


        loadSubjects();

    }, [
        navigate,
        logout
    ]);



    // ========================================
    // VALIDATE DATE AND TIME
    // ========================================

    const validateDateTime = () => {

        // --------------------------------
        // CHECK VALUES
        // --------------------------------

        if (
            !startDateTime ||
            !endDateTime
        ) {

            setError(
                "Start date and time and end date and time are required."
            );

            return false;
        }


        // --------------------------------
        // CONVERT TO DATE
        // --------------------------------

        const start =
            new Date(startDateTime);

        const end =
            new Date(endDateTime);


        // --------------------------------
        // CHECK VALID DATES
        // --------------------------------

        if (
            isNaN(start.getTime()) ||
            isNaN(end.getTime())
        ) {

            setError(
                "Please enter valid start and end date and time."
            );

            return false;
        }


        // --------------------------------
        // END MUST BE AFTER START
        // --------------------------------

        if (end <= start) {

            setError(
                "End date and time must be after the start date and time."
            );

            return false;
        }


        // --------------------------------
        // DIFFERENCE IN MINUTES
        // --------------------------------

        const differenceInMinutes =
            (end.getTime() - start.getTime()) /
            (1000 * 60);


        // --------------------------------
        // CHECK EXAM DURATION
        // --------------------------------

        if (
            differenceInMinutes <
            Number(duration)
        ) {

            setError(
                `The difference between start and end time must be at least ${duration} minutes.`
            );

            return false;
        }


        return true;

    };



    // ========================================
    // CREATE EXAM
    // ========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");


        // --------------------------------
        // CHECK TOKEN
        // --------------------------------

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


        // --------------------------------
        // TITLE
        // --------------------------------

        if (!title.trim()) {

            setError(
                "Exam title is required."
            );

            return;
        }


        // --------------------------------
        // SUBJECT
        // --------------------------------

        if (!subjectId) {

            setError(
                "Please select a subject."
            );

            return;
        }


        // --------------------------------
        // DURATION
        // --------------------------------

        if (
            !duration ||
            Number(duration) <= 0
        ) {

            setError(
                "Duration must be greater than 0 minutes."
            );

            return;
        }


        // --------------------------------
        // DATE / TIME
        // --------------------------------

        if (!validateDateTime()) {

            return;
        }


        setSubmitting(true);


        try {

            // ========================================
            // EXAM DATA
            // ========================================

            const examData = {

                title:
                    title.trim(),

                description:
                    description.trim(),

                subjectId:
                    Number(subjectId),

                durationMinutes:
                    Number(duration),

                startDateTime:
                    startDateTime,

                endDateTime:
                    endDateTime

            };


            console.log(
                "Creating exam:",
                examData
            );


            // ========================================
            // CREATE EXAM
            // ========================================

            const createdExam =
                await createExam(
                    examData
                );


            console.log(
                "Exam created:",
                createdExam
            );


            // ========================================
            // GET CREATED EXAM ID
            // ========================================

            const newExamId =
                createdExam?.examId;


            if (!newExamId) {

                setError(
                    "Exam was created, but exam ID was not returned by the server."
                );

                return;
            }


            // ========================================
            // SUCCESS
            // ========================================

            setSuccess(
                "Exam created successfully."
            );


            // ========================================
            // GO TO QUESTIONS
            // ========================================

            setTimeout(() => {

                navigate(
                    `/teacher/exams/${newExamId}/questions`
                );

            }, 700);


        } catch (error) {

            console.error(
                "Failed to create exam:",
                error
            );


            const status =
                error.response?.status;


            // --------------------------------
            // SESSION EXPIRED
            // --------------------------------

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


            // --------------------------------
            // CREATION ERROR
            // --------------------------------

            setError(
                error.response?.data?.message ||
                "Unable to create exam."
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

                <div className="mb-8">

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/teacher/dashboard"
                            )
                        }
                        className="
                            mb-3
                            text-sm
                            text-slate-500
                            hover:text-slate-800
                        "
                    >

                        ← Back to Dashboard

                    </button>


                    <h1
                        className="
                            text-3xl
                            font-bold
                            text-slate-800
                        "
                    >

                        Create Exam

                    </h1>


                    <p
                        className="
                            mt-2
                            text-slate-500
                        "
                    >

                        Create a new examination and add questions to it.

                    </p>

                </div>



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

                <form
                    onSubmit={handleSubmit}
                    className="
                        max-w-4xl
                        rounded-xl
                        border border-slate-200
                        bg-white
                        p-8
                        shadow-sm
                    "
                >


                    {/* ================================= */}
                    {/* EXAM TITLE */}
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

                            Exam Title

                        </label>


                        <input
                            type="text"
                            value={title}
                            onChange={(e) =>
                                setTitle(
                                    e.target.value
                                )
                            }
                            placeholder="Enter exam title"
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



                    {/* ================================= */}
                    {/* SUBJECT */}
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

                            Subject

                        </label>


                        <select
                            value={subjectId}
                            onChange={(e) =>
                                setSubjectId(
                                    e.target.value
                                )
                            }
                            required
                            disabled={
                                loadingSubjects
                            }
                            className="
                                w-full
                                rounded-lg
                                border border-slate-300
                                bg-white
                                px-4 py-3
                                text-sm
                                text-slate-700
                                outline-none
                                transition
                                focus:border-slate-500
                                focus:ring-2
                                focus:ring-slate-200
                                disabled:cursor-not-allowed
                                disabled:bg-slate-100
                            "
                        >

                            <option value="">

                                {loadingSubjects
                                    ? "Loading subjects..."
                                    : "Select a subject"
                                }

                            </option>


                            {subjects.map(
                                (subject) => (

                                    <option
                                        key={
                                            subject.subjectId
                                        }
                                        value={
                                            subject.subjectId
                                        }
                                    >

                                        {subject.subjectCode
                                            ? `${subject.subjectCode} - `
                                            : ""
                                        }

                                        {subject.subjectName}

                                    </option>

                                )
                            )}

                        </select>


                        {!loadingSubjects &&
                            subjects.length === 0 && (

                            <p
                                className="
                                    mt-2
                                    text-xs
                                    text-red-500
                                "
                            >

                                No subjects are available.

                            </p>

                        )}

                    </div>



                    {/* ================================= */}
                    {/* DESCRIPTION */}
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

                            Description

                            <span
                                className="
                                    ml-2
                                    text-xs
                                    font-normal
                                    text-slate-400
                                "
                            >

                                Optional

                            </span>

                        </label>


                        <textarea
                            value={description}
                            onChange={(e) =>
                                setDescription(
                                    e.target.value
                                )
                            }
                            placeholder="Enter exam description..."
                            rows="4"
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



                    {/* ================================= */}
                    {/* DURATION */}
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

                            Duration

                        </label>


                        <div className="relative">

                            <input
                                type="number"
                                min="1"
                                value={duration}
                                onChange={(e) =>
                                    setDuration(
                                        e.target.value
                                    )
                                }
                                placeholder="Enter duration"
                                required
                                className="
                                    w-full
                                    rounded-lg
                                    border border-slate-300
                                    px-4 py-3
                                    pr-24
                                    text-sm
                                    text-slate-800
                                    outline-none
                                    transition
                                    focus:border-slate-500
                                    focus:ring-2
                                    focus:ring-slate-200
                                "
                            />


                            <span
                                className="
                                    absolute
                                    right-4
                                    top-1/2
                                    -translate-y-1/2
                                    text-sm
                                    text-slate-400
                                "
                            >

                                minutes

                            </span>

                        </div>


                        <p
                            className="
                                mt-1
                                text-xs
                                text-slate-500
                            "
                        >

                            Duration students have to complete
                            the examination.

                        </p>

                    </div>



                    {/* ================================= */}
                    {/* START + END */}
                    {/* ================================= */}

                    <div
                        className="
                            mb-8
                            grid
                            grid-cols-1
                            gap-6
                            md:grid-cols-2
                        "
                    >


                        {/* START DATE TIME */}

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

                                Start Date & Time

                            </label>


                            <input
                                type="datetime-local"
                                value={startDateTime}
                                onChange={(e) =>
                                    setStartDateTime(
                                        e.target.value
                                    )
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
                                    transition
                                    focus:border-slate-500
                                    focus:ring-2
                                    focus:ring-slate-200
                                "
                            />


                            <p
                                className="
                                    mt-1
                                    text-xs
                                    text-slate-500
                                "
                            >

                                When students can start
                                the examination.

                            </p>

                        </div>



                        {/* END DATE TIME */}

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

                                End Date & Time

                            </label>


                            <input
                                type="datetime-local"
                                value={endDateTime}
                                onChange={(e) =>
                                    setEndDateTime(
                                        e.target.value
                                    )
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
                                    transition
                                    focus:border-slate-500
                                    focus:ring-2
                                    focus:ring-slate-200
                                "
                            />


                            <p
                                className="
                                    mt-1
                                    text-xs
                                    text-slate-500
                                "
                            >

                                When the examination will
                                no longer be available.

                            </p>

                        </div>

                    </div>



                    {/* ================================= */}
                    {/* TIME WINDOW INFORMATION */}
                    {/* ================================= */}

                    {startDateTime &&
                        endDateTime &&
                        duration && (

                        <div
                            className="
                                mb-8
                                rounded-lg
                                border border-slate-200
                                bg-slate-50
                                px-4 py-3
                                text-sm
                                text-slate-600
                            "
                        >

                            <p>

                                The examination window must
                                be at least{" "}

                                <span
                                    className="
                                        font-semibold
                                        text-slate-800
                                    "
                                >

                                    {duration} minutes

                                </span>

                                {" "}long.

                            </p>

                        </div>

                    )}



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
                                    "/teacher/dashboard"
                                )
                            }
                            className="
                                rounded-lg
                                border border-slate-300
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
                            disabled={
                                submitting ||
                                loadingSubjects ||
                                subjects.length === 0
                            }
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
                                ? "Creating..."
                                : "Create Exam"
                            }

                        </button>

                    </div>

                </form>

            </main>

        </div>

    );

};


export default CreateExam;