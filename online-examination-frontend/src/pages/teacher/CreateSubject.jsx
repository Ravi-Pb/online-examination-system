import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import {
    createSubject
} from "../../api/subjectApi";

import TeacherSidebar from "../../components/teacher/TeacherSidebar";


const CreateSubject = () => {

    const navigate = useNavigate();

    const {
        logout
    } = useAuth();


    // ========================================
    // STATE
    // ========================================

    const [subjectCode, setSubjectCode] =
        useState("");

    const [subjectName, setSubjectName] =
        useState("");

    const [submitting, setSubmitting] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    // ========================================
    // CREATE SUBJECT
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
        // VALIDATION
        // --------------------------------

        if (!subjectCode.trim()) {

            setError(
                "Subject code is required."
            );

            return;
        }


        if (!subjectName.trim()) {

            setError(
                "Subject name is required."
            );

            return;
        }


        setSubmitting(true);


        try {

            // ========================================
            // SUBJECT DATA
            // ========================================

            const subjectData = {

                subjectCode:
                    subjectCode.trim(),

                subjectName:
                    subjectName.trim()

            };


            console.log(
                "Creating subject:",
                subjectData
            );


            // ========================================
            // CREATE
            // ========================================

            await createSubject(
                subjectData
            );


            setSuccess(
                "Subject created successfully."
            );


            // ========================================
            // REDIRECT
            // ========================================

            setTimeout(() => {

                navigate(
                    "/teacher/subjects"
                );

            }, 700);


        } catch (error) {

            console.error(
                "Failed to create subject:",
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
            // ERROR
            // --------------------------------

            setError(
                error.response?.data?.message ||
                "Unable to create subject."
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
                                "/teacher/subjects"
                            )
                        }
                        className="
                            mb-3
                            text-sm
                            text-slate-500
                            hover:text-slate-800
                        "
                    >

                        ← Back to Subjects

                    </button>


                    <h1
                        className="
                            text-3xl
                            font-bold
                            text-slate-800
                        "
                    >

                        Create Subject

                    </h1>


                    <p
                        className="
                            mt-2
                            text-slate-500
                        "
                    >

                        Add a new subject to the examination system.

                    </p>

                </div>


                {/* ========================================= */}
                {/* ERROR */}
                {/* ========================================= */}

                {error && (

                    <div
                        className="
                            mb-6
                            max-w-3xl
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
                            max-w-3xl
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
                        max-w-3xl
                        rounded-xl
                        border border-slate-200
                        bg-white
                        p-8
                        shadow-sm
                    "
                >


                    {/* ================================= */}
                    {/* SUBJECT CODE */}
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

                            Subject Code

                        </label>


                        <input
                            type="text"
                            value={subjectCode}
                            onChange={(e) =>
                                setSubjectCode(
                                    e.target.value
                                )
                            }
                            placeholder="e.g. CS101"
                            required
                            className="
                                w-full
                                rounded-lg
                                border
                                border-slate-300
                                px-4 py-3
                                text-sm
                                text-slate-800
                                uppercase
                                outline-none
                                transition
                                focus:border-slate-500
                                focus:ring-2
                                focus:ring-slate-200
                            "
                        />


                        <p
                            className="
                                mt-2
                                text-xs
                                text-slate-400
                            "
                        >

                            A unique code used to identify the subject.

                        </p>

                    </div>


                    {/* ================================= */}
                    {/* SUBJECT NAME */}
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

                            Subject Name

                        </label>


                        <input
                            type="text"
                            value={subjectName}
                            onChange={(e) =>
                                setSubjectName(
                                    e.target.value
                                )
                            }
                            placeholder="e.g. Database Management Systems"
                            required
                            className="
                                w-full
                                rounded-lg
                                border
                                border-slate-300
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
                                    "/teacher/subjects"
                                )
                            }
                            className="
                                rounded-lg
                                border
                                border-slate-300
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
                            disabled={submitting}
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
                                : "Create Subject"
                            }

                        </button>

                    </div>

                </form>

            </main>

        </div>

    );

};


export default CreateSubject;