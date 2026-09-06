import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import TeacherSidebar from "../../components/teacher/TeacherSidebar";

import {
    getTeacherProfile
} from "../../api/teacherApi";


const TeacherProfile = () => {

    const navigate = useNavigate();

    const {
        logout
    } = useAuth();


    // ========================================
    // STATE
    // ========================================

    const [teacher, setTeacher] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // ========================================
    // LOAD PROFILE
    // ========================================

    useEffect(() => {

        const loadProfile = async () => {

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
                // GET TEACHER PROFILE
                // --------------------------------

                const data =
                    await getTeacherProfile();


                setTeacher(data);


            } catch (error) {

                console.error(
                    "Failed to load teacher profile:",
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
                    "Unable to load teacher profile."
                );


            } finally {

                setLoading(false);

            }

        };


        loadProfile();

    }, [
        navigate,
        logout
    ]);


    // ========================================
    // FORMAT DATE
    // ========================================

    const formatDate = (date) => {

        if (!date) {
            return "—";
        }


        return new Date(date).toLocaleString(
            "en-IN",
            {
                dateStyle: "medium",
                timeStyle: "short"
            }
        );

    };


    // ========================================
    // GET INITIALS
    // ========================================

    const getInitials = (name) => {

        if (!name) {
            return "T";
        }


        return name
            .trim()
            .split(" ")
            .map(word => word[0])
            .join("")
            .substring(0, 2)
            .toUpperCase();

    };


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

            <main className="flex-1">


                {/* ========================================= */}
                {/* HEADER */}
                {/* ========================================= */}

                <header
                    className="
                        bg-white
                        border-b border-slate-200
                        px-8 py-5
                    "
                >

                    <h1
                        className="
                            text-2xl
                            font-bold
                            text-slate-800
                        "
                    >

                        Teacher Profile

                    </h1>


                    <p
                        className="
                            mt-1
                            text-sm
                            text-slate-500
                        "
                    >

                        View your account information and teaching statistics.

                    </p>

                </header>


                {/* ========================================= */}
                {/* CONTENT */}
                {/* ========================================= */}

                <section className="p-8">


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
                                px-5 py-4
                                text-sm
                                text-red-700
                            "
                        >

                            {error}

                        </div>

                    )}


                    {/* ========================================= */}
                    {/* LOADING */}
                    {/* ========================================= */}

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

                            <p className="text-sm text-slate-500">

                                Loading profile...

                            </p>

                        </div>

                    )}


                    {/* ========================================= */}
                    {/* PROFILE */}
                    {/* ========================================= */}

                    {!loading && teacher && (

                        <div className="space-y-6">


                            {/* ================================================= */}
                            {/* PROFILE HEADER CARD */}
                            {/* ================================================= */}

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
                                    {/* AVATAR + NAME */}
                                    {/* ================================= */}

                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-5
                                        "
                                    >

                                        <div
                                            className="
                                                flex
                                                h-20
                                                w-20
                                                shrink-0
                                                items-center
                                                justify-center
                                                rounded-full
                                                bg-slate-800
                                                text-2xl
                                                font-bold
                                                text-white
                                            "
                                        >

                                            {getInitials(
                                                teacher.fullName
                                            )}

                                        </div>


                                        <div>

                                            <h2
                                                className="
                                                    text-2xl
                                                    font-bold
                                                    text-slate-800
                                                "
                                            >

                                                {teacher.fullName}

                                            </h2>


                                            <p
                                                className="
                                                    mt-1
                                                    text-sm
                                                    text-slate-500
                                                "
                                            >

                                                {teacher.email}

                                            </p>


                                            <div
                                                className="
                                                    mt-3
                                                    flex
                                                    flex-wrap
                                                    gap-2
                                                "
                                            >

                                                <span
                                                    className="
                                                        rounded-full
                                                        bg-blue-50
                                                        px-3 py-1
                                                        text-xs
                                                        font-semibold
                                                        text-blue-700
                                                    "
                                                >

                                                    {teacher.userRole}

                                                </span>


                                                <span
                                                    className={`
                                                        rounded-full
                                                        px-3 py-1
                                                        text-xs
                                                        font-semibold
                                                        ${
                                                            teacher.accountStatus ===
                                                            "ACTIVE"
                                                                ? "bg-green-50 text-green-700"
                                                                : "bg-red-50 text-red-700"
                                                        }
                                                    `}
                                                >

                                                    {teacher.accountStatus}

                                                </span>

                                            </div>

                                        </div>

                                    </div>


                                    {/* ================================= */}
                                    {/* USER ID */}
                                    {/* ================================= */}

                                    <div
                                        className="
                                            rounded-lg
                                            bg-slate-50
                                            px-5 py-4
                                        "
                                    >

                                        <p
                                            className="
                                                text-xs
                                                text-slate-500
                                            "
                                        >

                                            Teacher ID

                                        </p>


                                        <p
                                            className="
                                                mt-1
                                                text-lg
                                                font-bold
                                                text-slate-800
                                            "
                                        >

                                            #{teacher.userId}

                                        </p>

                                    </div>

                                </div>

                            </div>


                            {/* ================================================= */}
                            {/* STATISTICS */}
                            {/* ================================================= */}

                            <div>

                                <h2
                                    className="
                                        mb-4
                                        text-lg
                                        font-semibold
                                        text-slate-800
                                    "
                                >

                                    Teaching Overview

                                </h2>


                                <div
                                    className="
                                        grid
                                        grid-cols-1
                                        gap-5
                                        sm:grid-cols-2
                                        lg:grid-cols-3
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

                                            {teacher.statistics?.totalExams ?? 0}

                                        </p>

                                    </div>


                                    {/* Active Exams */}

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

                                            Active Exams

                                        </p>


                                        <p
                                            className="
                                                mt-2
                                                text-3xl
                                                font-bold
                                                text-green-600
                                            "
                                        >

                                            {teacher.statistics?.activeExams ?? 0}

                                        </p>

                                    </div>


                                    {/* Upcoming Exams */}

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
                                                text-blue-600
                                            "
                                        >

                                            {teacher.statistics?.upcomingExams ?? 0}

                                        </p>

                                    </div>


                                    {/* Completed Exams */}

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
                                                text-slate-700
                                            "
                                        >

                                            {teacher.statistics?.completedExams ?? 0}

                                        </p>

                                    </div>


                                    {/* Total Questions */}

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

                                            Questions Created

                                        </p>


                                        <p
                                            className="
                                                mt-2
                                                text-3xl
                                                font-bold
                                                text-purple-600
                                            "
                                        >

                                            {teacher.statistics?.totalQuestions ?? 0}

                                        </p>

                                    </div>


                                    {/* Total Subjects */}

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

                                            Subjects

                                        </p>


                                        <p
                                            className="
                                                mt-2
                                                text-3xl
                                                font-bold
                                                text-orange-600
                                            "
                                        >

                                            {teacher.statistics?.totalSubjects ?? 0}

                                        </p>

                                    </div>

                                </div>

                            </div>


                            {/* ================================================= */}
                            {/* ACCOUNT INFORMATION */}
                            {/* ================================================= */}

                            <div
                                className="
                                    rounded-xl
                                    border border-slate-200
                                    bg-white
                                    p-8
                                    shadow-sm
                                "
                            >

                                <h2
                                    className="
                                        mb-6
                                        text-lg
                                        font-semibold
                                        text-slate-800
                                    "
                                >

                                    Account Information

                                </h2>


                                <div
                                    className="
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
                                                font-medium
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

                                            {teacher.fullName}

                                        </p>

                                    </div>


                                    {/* Email */}

                                    <div>

                                        <p
                                            className="
                                                text-xs
                                                font-medium
                                                uppercase
                                                tracking-wide
                                                text-slate-400
                                            "
                                        >

                                            Email Address

                                        </p>


                                        <p
                                            className="
                                                mt-2
                                                text-sm
                                                font-medium
                                                text-slate-800
                                            "
                                        >

                                            {teacher.email}

                                        </p>

                                    </div>


                                    {/* User ID */}

                                    <div>

                                        <p
                                            className="
                                                text-xs
                                                font-medium
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

                                            {teacher.userId}

                                        </p>

                                    </div>


                                    {/* Role */}

                                    <div>

                                        <p
                                            className="
                                                text-xs
                                                font-medium
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

                                            {teacher.userRole}

                                        </p>

                                    </div>


                                    {/* Account Status */}

                                    <div>

                                        <p
                                            className="
                                                text-xs
                                                font-medium
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

                                            {teacher.accountStatus}

                                        </p>

                                    </div>


                                    {/* Created */}

                                    <div>

                                        <p
                                            className="
                                                text-xs
                                                font-medium
                                                uppercase
                                                tracking-wide
                                                text-slate-400
                                            "
                                        >

                                            Account Created

                                        </p>


                                        <p
                                            className="
                                                mt-2
                                                text-sm
                                                font-medium
                                                text-slate-800
                                            "
                                        >

                                            {formatDate(
                                                teacher.createdAt
                                            )}

                                        </p>

                                    </div>


                                    {/* Updated */}

                                    <div>

                                        <p
                                            className="
                                                text-xs
                                                font-medium
                                                uppercase
                                                tracking-wide
                                                text-slate-400
                                            "
                                        >

                                            Last Updated

                                        </p>


                                        <p
                                            className="
                                                mt-2
                                                text-sm
                                                font-medium
                                                text-slate-800
                                            "
                                        >

                                            {formatDate(
                                                teacher.updatedAt
                                            )}

                                        </p>

                                    </div>

                                </div>

                            </div>


                        </div>

                    )}

                </section>

            </main>

        </div>

    );

};


export default TeacherProfile;