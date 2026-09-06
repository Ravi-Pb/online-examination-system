import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../api/axios";

import { useAuth } from "../../context/AuthContext";
import TeacherSidebar from "../../components/teacher/TeacherSidebar";


const TeacherStudentProfile = () => {

    const navigate = useNavigate();

    const { studentId } = useParams();

    const {
        user,
        logout
    } = useAuth();


    // ========================================
    // STATE
    // ========================================

    const [student, setStudent] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // ========================================
    // LOAD STUDENT
    // ========================================

    useEffect(() => {

        const fetchStudent = async () => {

            try {

                setLoading(true);
                setError("");


                // ========================================
                // CHECK TOKEN
                // ========================================

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


                // ========================================
                // CHECK STUDENT ID
                // ========================================

                if (!studentId) {

                    setError(
                        "Student ID is missing."
                    );

                    return;
                }


                // ========================================
                // GET STUDENT
                // ========================================

                const response =
                    await api.get(
                        `/teachers/students/${studentId}`
                    );


                console.log(
                    "Student profile response:",
                    response
                );


                setStudent(
                    response.data
                );


            } catch (error) {

                console.error(
                    "Failed to load student profile:",
                    error
                );


                const status =
                    error.response?.status;


                // ========================================
                // SESSION EXPIRED
                // ========================================

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


                // ========================================
                // STUDENT NOT FOUND
                // ========================================

                if (status === 404) {

                    setError(
                        "Student profile was not found."
                    );

                    return;
                }


                // ========================================
                // OTHER ERROR
                // ========================================

                setError(
                    error.response?.data?.message ||
                    "Unable to load student profile."
                );


            } finally {

                setLoading(false);

            }

        };


        fetchStudent();

    }, [
        studentId,
        navigate,
        logout
    ]);


    // ========================================
    // TEACHER NAME
    // ========================================

    const teacherName =
        user?.fullName ||
        user?.name ||
        "Teacher";


    // ========================================
    // STUDENT INITIAL
    // ========================================

    const studentInitial =
        student?.fullName
            ?.charAt(0)
            ?.toUpperCase() ||
        "S";


    // ========================================
    // RENDER
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

            <main className="flex-1 min-w-0">


                {/* ================================================= */}
                {/* HEADER */}
                {/* ================================================= */}

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

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/teacher/students"
                                )
                            }
                            className="
                                mb-2
                                text-sm
                                text-slate-500
                                transition
                                hover:text-slate-800
                            "
                        >

                            ← Back to Students

                        </button>


                        <h1
                            className="
                                text-2xl
                                font-bold
                                text-slate-800
                            "
                        >

                            Student Profile

                        </h1>


                        <p
                            className="
                                mt-1
                                text-sm
                                text-slate-500
                            "
                        >

                            View student information and examination statistics.

                        </p>

                    </div>


                    {/* ========================================= */}
                    {/* TEACHER */}
                    {/* ========================================= */}

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



                {/* ================================================= */}
                {/* CONTENT */}
                {/* ================================================= */}

                <section className="p-8">


                    {/* ================================================= */}
                    {/* LOADING */}
                    {/* ================================================= */}

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

                                Loading student profile...

                            </p>

                        </div>

                    )}



                    {/* ================================================= */}
                    {/* ERROR */}
                    {/* ================================================= */}

                    {!loading && error && (

                        <div
                            className="
                                rounded-xl
                                border
                                border-red-200
                                bg-red-50
                                p-6
                            "
                        >

                            <p
                                className="
                                    text-sm
                                    text-red-700
                                "
                            >

                                {error}

                            </p>


                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/teacher/students"
                                    )
                                }
                                className="
                                    mt-4
                                    rounded-lg
                                    bg-slate-800
                                    px-5 py-2.5
                                    text-sm
                                    font-semibold
                                    text-white
                                    hover:bg-slate-700
                                "
                            >

                                Back to Students

                            </button>

                        </div>

                    )}



                    {/* ================================================= */}
                    {/* PROFILE */}
                    {/* ================================================= */}

                    {!loading &&
                        !error &&
                        student && (

                        <>

                            {/* ========================================= */}
                            {/* PROFILE CARD */}
                            {/* ========================================= */}

                            <div
                                className="
                                    rounded-xl
                                    border border-slate-200
                                    bg-white
                                    p-8
                                    shadow-sm
                                "
                            >

                                <div
                                    className="
                                        flex
                                        flex-col
                                        gap-6
                                        md:flex-row
                                        md:items-center
                                        md:justify-between
                                    "
                                >

                                    {/* ================================= */}
                                    {/* STUDENT INFO */}
                                    {/* ================================= */}

                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-5
                                        "
                                    >

                                        {/* Avatar */}

                                        <div
                                            className="
                                                flex
                                                h-20 w-20
                                                shrink-0
                                                items-center
                                                justify-center
                                                rounded-full
                                                bg-slate-100
                                                text-2xl
                                                font-bold
                                                text-slate-700
                                            "
                                        >

                                            {studentInitial}

                                        </div>


                                        {/* Name / Email */}

                                        <div>

                                            <h2
                                                className="
                                                    text-2xl
                                                    font-bold
                                                    text-slate-800
                                                "
                                            >

                                                {student.fullName}

                                            </h2>


                                            <p
                                                className="
                                                    mt-1
                                                    text-sm
                                                    text-slate-500
                                                "
                                            >

                                                {student.email}

                                            </p>


                                            <p
                                                className="
                                                    mt-2
                                                    text-xs
                                                    text-slate-400
                                                "
                                            >

                                                Student ID: {
                                                    student.userId
                                                }

                                            </p>

                                        </div>

                                    </div>


                                    {/* ================================= */}
                                    {/* STATUS */}
                                    {/* ================================= */}

                                    <div>

                                        <span
                                            className={`
                                                inline-flex
                                                rounded-full
                                                px-4 py-2
                                                text-sm
                                                font-semibold
                                                ${
                                                    student.accountStatus
                                                        ?.toUpperCase() ===
                                                    "ACTIVE"
                                                        ? "bg-green-50 text-green-700"
                                                        : "bg-slate-100 text-slate-600"
                                                }
                                            `}
                                        >

                                            {student.accountStatus ||
                                                "UNKNOWN"
                                            }

                                        </span>

                                    </div>

                                </div>

                            </div>



                            {/* ================================================= */}
                            {/* STATISTICS */}
                            {/* ================================================= */}

                            <div
                                className="
                                    mt-6
                                    grid
                                    grid-cols-1
                                    gap-5
                                    sm:grid-cols-2
                                    lg:grid-cols-4
                                "
                            >

                                {/* Total Exams */}

                                <div
                                    className="
                                        rounded-xl
                                        border border-slate-200
                                        bg-white
                                        p-6
                                        shadow-sm
                                    "
                                >

                                    <p
                                        className="
                                            text-sm
                                            text-slate-500
                                        "
                                    >

                                        Total Exams

                                    </p>


                                    <p
                                        className="
                                            mt-2
                                            text-3xl
                                            font-bold
                                            text-slate-800
                                        "
                                    >

                                        {student.totalExams ?? 0}

                                    </p>

                                </div>



                                {/* Completed */}

                                <div
                                    className="
                                        rounded-xl
                                        border border-slate-200
                                        bg-white
                                        p-6
                                        shadow-sm
                                    "
                                >

                                    <p
                                        className="
                                            text-sm
                                            text-slate-500
                                        "
                                    >

                                        Completed Exams

                                    </p>


                                    <p
                                        className="
                                            mt-2
                                            text-3xl
                                            font-bold
                                            text-slate-800
                                        "
                                    >

                                        {student.completedExams ?? 0}

                                    </p>

                                </div>



                                {/* Upcoming */}

                                <div
                                    className="
                                        rounded-xl
                                        border border-slate-200
                                        bg-white
                                        p-6
                                        shadow-sm
                                    "
                                >

                                    <p
                                        className="
                                            text-sm
                                            text-slate-500
                                        "
                                    >

                                        Upcoming Exams

                                    </p>


                                    <p
                                        className="
                                            mt-2
                                            text-3xl
                                            font-bold
                                            text-slate-800
                                        "
                                    >

                                        {student.upcomingExams ?? 0}

                                    </p>

                                </div>



                                {/* Average */}

                                <div
                                    className="
                                        rounded-xl
                                        border border-slate-200
                                        bg-white
                                        p-6
                                        shadow-sm
                                    "
                                >

                                    <p
                                        className="
                                            text-sm
                                            text-slate-500
                                        "
                                    >

                                        Average Score

                                    </p>


                                    <p
                                        className="
                                            mt-2
                                            text-3xl
                                            font-bold
                                            text-slate-800
                                        "
                                    >

                                        {student.averageScore != null
                                            ? `${student.averageScore}%`
                                            : "0%"
                                        }

                                    </p>

                                </div>

                            </div>



                            {/* ================================================= */}
                            {/* ACCOUNT DETAILS */}
                            {/* ================================================= */}

                            <div
                                className="
                                    mt-6
                                    rounded-xl
                                    border border-slate-200
                                    bg-white
                                    p-8
                                    shadow-sm
                                "
                            >

                                <h2
                                    className="
                                        text-lg
                                        font-semibold
                                        text-slate-800
                                    "
                                >

                                    Account Information

                                </h2>


                                <div
                                    className="
                                        mt-6
                                        grid
                                        grid-cols-1
                                        gap-6
                                        md:grid-cols-2
                                    "
                                >

                                    {/* Full Name */}

                                    <div>

                                        <p
                                            className="
                                                text-xs
                                                font-semibold
                                                uppercase
                                                tracking-wide
                                                text-slate-400
                                            "
                                        >

                                            Full Name

                                        </p>


                                        <p
                                            className="
                                                mt-2
                                                text-sm
                                                font-medium
                                                text-slate-800
                                            "
                                        >

                                            {student.fullName}

                                        </p>

                                    </div>



                                    {/* Email */}

                                    <div>

                                        <p
                                            className="
                                                text-xs
                                                font-semibold
                                                uppercase
                                                tracking-wide
                                                text-slate-400
                                            "
                                        >

                                            Email

                                        </p>


                                        <p
                                            className="
                                                mt-2
                                                text-sm
                                                font-medium
                                                text-slate-800
                                            "
                                        >

                                            {student.email}

                                        </p>

                                    </div>



                                    {/* User ID */}

                                    <div>

                                        <p
                                            className="
                                                text-xs
                                                font-semibold
                                                uppercase
                                                tracking-wide
                                                text-slate-400
                                            "
                                        >

                                            User ID

                                        </p>


                                        <p
                                            className="
                                                mt-2
                                                text-sm
                                                font-medium
                                                text-slate-800
                                            "
                                        >

                                            {student.userId}

                                        </p>

                                    </div>



                                    {/* Role */}

                                    <div>

                                        <p
                                            className="
                                                text-xs
                                                font-semibold
                                                uppercase
                                                tracking-wide
                                                text-slate-400
                                            "
                                        >

                                            Role

                                        </p>


                                        <p
                                            className="
                                                mt-2
                                                text-sm
                                                font-medium
                                                text-slate-800
                                            "
                                        >

                                            {student.userRole ||
                                                "STUDENT"
                                            }

                                        </p>

                                    </div>



                                    {/* Status */}

                                    <div>

                                        <p
                                            className="
                                                text-xs
                                                font-semibold
                                                uppercase
                                                tracking-wide
                                                text-slate-400
                                            "
                                        >

                                            Account Status

                                        </p>


                                        <p
                                            className="
                                                mt-2
                                                text-sm
                                                font-medium
                                                text-slate-800
                                            "
                                        >

                                            {student.accountStatus}

                                        </p>

                                    </div>

                                </div>

                            </div>



                            {/* ================================================= */}
                            {/* ACTIONS */}
                            {/* ================================================= */}

                            <div
                                className="
                                    mt-6
                                    flex
                                    justify-end
                                "
                            >

                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate(
                                            "/teacher/students"
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

                                    ← Back to Students

                                </button>

                            </div>

                        </>

                    )}

                </section>

            </main>

        </div>

    );

};


export default TeacherStudentProfile;