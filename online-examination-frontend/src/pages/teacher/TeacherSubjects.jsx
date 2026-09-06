import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import {
    getSubjects,
    deleteSubject
} from "../../api/subjectApi";

import TeacherSidebar from "../../components/teacher/TeacherSidebar";
import Subject from "../../components/teacher/Subject";


const TeacherSubject = () => {

    const navigate = useNavigate();

    const {
        user,
        logout
    } = useAuth();


    // ========================================
    // STATE
    // ========================================

    const [subjects, setSubjects] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // ========================================
    // LOAD SUBJECTS
    // ========================================

    useEffect(() => {

        const fetchSubjects = async () => {

            try {

                setLoading(true);
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


                console.log(
                    "Subjects:",
                    data
                );


                setSubjects(
                    Array.isArray(data)
                        ? data
                        : []
                );


            } catch (error) {

                console.error(
                    "Failed to fetch subjects:",
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


                setError(
                    error.response?.data?.message ||
                    "Unable to load subjects."
                );


            } finally {

                setLoading(false);

            }

        };


        fetchSubjects();

    }, [
        navigate,
        logout
    ]);



    // ========================================
    // EDIT SUBJECT
    // ========================================

    const handleEdit = (subjectId) => {

        navigate(
            `/teacher/subjects/edit/${subjectId}`
        );

    };



    // ========================================
    // DELETE SUBJECT
    // ========================================

    const handleDelete = async (subjectId) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this subject?"
            );


        if (!confirmed) {

            return;

        }


        try {

            setError("");


            await deleteSubject(
                subjectId
            );


            // --------------------------------
            // REMOVE FROM UI
            // --------------------------------

            setSubjects(
                previousSubjects =>
                    previousSubjects.filter(
                        subject =>
                            subject.subjectId !==
                            subjectId
                    )
            );


        } catch (error) {

            console.error(
                "Failed to delete subject:",
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


            setError(
                error.response?.data?.message ||
                "Unable to delete subject."
            );

        }

    };



    // ========================================
    // TEACHER NAME
    // ========================================

    const teacherName =
        user?.fullName ||
        user?.name ||
        "Teacher";



    // ========================================
    // RENDER
    // ========================================

    return (

        <div
            className="
                min-h-screen
                bg-slate-100
                flex
            "
        >


            {/* ================================================= */}
            {/* SIDEBAR */}
            {/* ================================================= */}

            <TeacherSidebar />



            {/* ================================================= */}
            {/* MAIN CONTENT */}
            {/* ================================================= */}

            <main className="flex-1">


                {/* ======================================== */}
                {/* HEADER */}
                {/* ======================================== */}

                <header
                    className="
                        bg-white
                        border-b border-slate-200
                        px-8 py-5
                        flex
                        items-center
                        justify-between
                    "
                >

                    <div>

                        <h2
                            className="
                                text-2xl
                                font-bold
                                text-slate-800
                            "
                        >

                            Subjects

                        </h2>


                        <p
                            className="
                                mt-1
                                text-sm
                                text-slate-500
                            "
                        >

                            View and manage examination subjects.

                        </p>

                    </div>



                    {/* Teacher greeting */}

                    <div className="text-right">

                        <p
                            className="
                                text-sm
                                text-slate-500
                            "
                        >

                            Welcome back,

                        </p>


                        <p
                            className="
                                text-lg
                                font-semibold
                                text-slate-800
                            "
                        >

                            {teacherName}

                        </p>

                    </div>

                </header>



                {/* ======================================== */}
                {/* PAGE CONTENT */}
                {/* ======================================== */}

                <section className="p-8">


                    {/* ======================================== */}
                    {/* TOP SECTION */}
                    {/* ======================================== */}

                    <div
                        className="
                            mb-6
                            flex
                            items-center
                            justify-between
                        "
                    >

                        <div>

                            <h3
                                className="
                                    text-xl
                                    font-semibold
                                    text-slate-800
                                "
                            >

                                Subject List

                            </h3>


                            <p
                                className="
                                    mt-1
                                    text-sm
                                    text-slate-500
                                "
                            >

                                All subjects available in the examination system.

                            </p>

                        </div>



                        {/* Add Subject */}

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/teacher/subjects/create"
                                )
                            }
                            className="
                                rounded-lg
                                bg-slate-800
                                px-5 py-3
                                text-sm
                                font-semibold
                                text-white
                                shadow-sm
                                transition
                                hover:bg-slate-700
                            "
                        >

                            + Add Subject

                        </button>

                    </div>



                    {/* ======================================== */}
                    {/* ERROR */}
                    {/* ======================================== */}

                    {error && (

                        <div
                            className="
                                mb-6
                                rounded-lg
                                border border-red-200
                                bg-red-50
                                px-5 py-4
                                text-sm
                                text-red-700
                            "
                        >

                            {error}

                        </div>

                    )}



                    {/* ======================================== */}
                    {/* LOADING */}
                    {/* ======================================== */}

                    {loading && (

                        <div
                            className="
                                rounded-xl
                                border border-slate-200
                                bg-white
                                p-12
                                text-center
                                shadow-sm
                            "
                        >

                            <p
                                className="
                                    text-sm
                                    text-slate-500
                                "
                            >

                                Loading subjects...

                            </p>

                        </div>

                    )}



                    {/* ======================================== */}
                    {/* SUBJECT LIST */}
                    {/* ======================================== */}

                    {!loading &&
                        subjects.length > 0 && (

                        <div
                            className="
                                grid
                                grid-cols-1
                                gap-5
                                md:grid-cols-2
                                lg:grid-cols-3
                            "
                        >

                            {subjects.map(
                                (subject) => (

                                    <Subject
                                        key={
                                            subject.subjectId
                                        }
                                        subject={
                                            subject
                                        }
                                        onEdit={
                                            handleEdit
                                        }
                                        onDelete={
                                            handleDelete
                                        }
                                    />

                                )
                            )}

                        </div>

                    )}



                    {/* ======================================== */}
                    {/* EMPTY STATE */}
                    {/* ======================================== */}

                    {!loading &&
                        subjects.length === 0 &&
                        !error && (

                        <div
                            className="
                                rounded-xl
                                border border-slate-200
                                bg-white
                                p-12
                                text-center
                                shadow-sm
                            "
                        >

                            <div
                                className="
                                    mb-4
                                    text-4xl
                                "
                            >

                                📚

                            </div>


                            <h3
                                className="
                                    text-lg
                                    font-semibold
                                    text-slate-800
                                "
                            >

                                No subjects found

                            </h3>


                            <p
                                className="
                                    mt-2
                                    text-sm
                                    text-slate-500
                                "
                            >

                                Create your first subject to use it in examinations.

                            </p>


                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/teacher/subjects/create"
                                    )
                                }
                                className="
                                    mt-5
                                    rounded-lg
                                    bg-slate-800
                                    px-5 py-2.5
                                    text-sm
                                    font-semibold
                                    text-white
                                    transition
                                    hover:bg-slate-700
                                "
                            >

                                + Add Subject

                            </button>

                        </div>

                    )}

                </section>

            </main>

        </div>

    );

};


export default TeacherSubject;