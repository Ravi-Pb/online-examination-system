import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../api/axios";

import { useAuth } from "../../context/AuthContext";
import TeacherSidebar from "../../components/teacher/TeacherSidebar";


const TeacherStudents = () => {

    const navigate = useNavigate();

    const {
        user,
        logout
    } = useAuth();


    // ========================================
    // STATE
    // ========================================

    const [students, setStudents] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [search, setSearch] = useState("");


    // ========================================
    // LOAD STUDENTS
    // ========================================

    useEffect(() => {

        const fetchStudents = async () => {

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
                // GET STUDENTS
                // ========================================

                const response =
                    await api.get(
                        "/users/teacher/students"
                    );


                console.log(
                    "Students API response:",
                    response
                );


                setStudents(
                    Array.isArray(response.data)
                        ? response.data
                        : []
                );


            } catch (error) {

                console.error(
                    "Failed to load students:",
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
                // OTHER ERROR
                // ========================================

                setError(
                    error.response?.data?.message ||
                    "Unable to load students."
                );


            } finally {

                setLoading(false);

            }

        };


        fetchStudents();

    }, [
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
    // FILTER STUDENTS
    // ========================================

    const filteredStudents =
        students.filter((student) => {

            const searchText =
                search
                    .toLowerCase()
                    .trim();


            if (!searchText) {
                return true;
            }


            return (

                String(
                    student.userId || ""
                )
                    .toLowerCase()
                    .includes(searchText)

                ||

                String(
                    student.fullName || ""
                )
                    .toLowerCase()
                    .includes(searchText)

                ||

                String(
                    student.email || ""
                )
                    .toLowerCase()
                    .includes(searchText)

                ||

                String(
                    student.accountStatus || ""
                )
                    .toLowerCase()
                    .includes(searchText)

            );

        });


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
                        flex items-center justify-between
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
                            Students
                        </h1>


                        <p
                            className="
                                mt-1
                                text-sm
                                text-slate-500
                            "
                        >
                            View all students registered in the examination system.
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
                    {/* TOP BAR */}
                    {/* ================================================= */}

                    <div
                        className="
                            mb-6
                            flex
                            flex-col
                            gap-4
                            md:flex-row
                            md:items-center
                            md:justify-between
                        "
                    >

                        <div>

                            <h2
                                className="
                                    text-xl
                                    font-semibold
                                    text-slate-800
                                "
                            >
                                All Students
                            </h2>


                            <p
                                className="
                                    mt-1
                                    text-sm
                                    text-slate-500
                                "
                            >
                                {students.length} student
                                {students.length !== 1
                                    ? "s"
                                    : ""
                                } registered.
                            </p>

                        </div>


                        {/* ========================================= */}
                        {/* SEARCH */}
                        {/* ========================================= */}

                        <div className="w-full md:w-80">

                            <input
                                type="text"
                                value={search}
                                onChange={(e) =>
                                    setSearch(
                                        e.target.value
                                    )
                                }
                                placeholder="Search students..."
                                className="
                                    w-full
                                    rounded-lg
                                    border
                                    border-slate-300
                                    bg-white
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

                    </div>



                    {/* ================================================= */}
                    {/* ERROR */}
                    {/* ================================================= */}

                    {error && (

                        <div
                            className="
                                mb-6
                                rounded-lg
                                border
                                border-red-200
                                bg-red-50
                                px-5 py-4
                                text-sm
                                text-red-700
                            "
                        >

                            {error}

                        </div>

                    )}



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
                                Loading students...
                            </p>

                        </div>

                    )}



                    {/* ================================================= */}
                    {/* STUDENT LIST */}
                    {/* ================================================= */}

                    {!loading &&
                        !error &&
                        filteredStudents.length > 0 && (

                        <div
                            className="
                                overflow-hidden
                                rounded-xl
                                border border-slate-200
                                bg-white
                                shadow-sm
                            "
                        >

                            <div className="overflow-x-auto">

                                <table
                                    className="
                                        w-full
                                        min-w-[800px]
                                        text-left
                                    "
                                >

                                    {/* ================================= */}
                                    {/* TABLE HEADER */}
                                    {/* ================================= */}

                                    <thead
                                        className="
                                            border-b
                                            border-slate-200
                                            bg-slate-50
                                        "
                                    >

                                        <tr>

                                            <th
                                                className="
                                                    px-6 py-4
                                                    text-xs
                                                    font-semibold
                                                    uppercase
                                                    tracking-wide
                                                    text-slate-500
                                                "
                                            >
                                                #
                                            </th>


                                            <th
                                                className="
                                                    px-6 py-4
                                                    text-xs
                                                    font-semibold
                                                    uppercase
                                                    tracking-wide
                                                    text-slate-500
                                                "
                                            >
                                                Student
                                            </th>


                                            <th
                                                className="
                                                    px-6 py-4
                                                    text-xs
                                                    font-semibold
                                                    uppercase
                                                    tracking-wide
                                                    text-slate-500
                                                "
                                            >
                                                Email
                                            </th>


                                            <th
                                                className="
                                                    px-6 py-4
                                                    text-xs
                                                    font-semibold
                                                    uppercase
                                                    tracking-wide
                                                    text-slate-500
                                                "
                                            >
                                                Role
                                            </th>


                                            <th
                                                className="
                                                    px-6 py-4
                                                    text-xs
                                                    font-semibold
                                                    uppercase
                                                    tracking-wide
                                                    text-slate-500
                                                "
                                            >
                                                Status
                                            </th>


                                            <th
                                                className="
                                                    px-6 py-4
                                                    text-xs
                                                    font-semibold
                                                    uppercase
                                                    tracking-wide
                                                    text-slate-500
                                                "
                                            >
                                                Action
                                            </th>

                                        </tr>

                                    </thead>



                                    {/* ================================= */}
                                    {/* TABLE BODY */}
                                    {/* ================================= */}

                                    <tbody
                                        className="
                                            divide-y
                                            divide-slate-100
                                        "
                                    >

                                        {filteredStudents.map(
                                            (student, index) => (

                                            <tr
                                                key={
                                                    student.userId
                                                }
                                                className="
                                                    transition
                                                    hover:bg-slate-50
                                                "
                                            >

                                                {/* NUMBER */}

                                                <td
                                                    className="
                                                        px-6 py-5
                                                        text-sm
                                                        text-slate-400
                                                    "
                                                >

                                                    {index + 1}

                                                </td>



                                                {/* STUDENT */}

                                                <td
                                                    className="
                                                        px-6 py-5
                                                    "
                                                >

                                                    <div
                                                        className="
                                                            flex
                                                            items-center
                                                            gap-3
                                                        "
                                                    >

                                                        {/* Avatar */}

                                                        <div
                                                            className="
                                                                flex
                                                                h-10 w-10
                                                                shrink-0
                                                                items-center
                                                                justify-center
                                                                rounded-full
                                                                bg-slate-100
                                                                text-sm
                                                                font-semibold
                                                                text-slate-700
                                                            "
                                                        >

                                                            {student.fullName
                                                                ?.charAt(0)
                                                                ?.toUpperCase() ||
                                                                "S"
                                                            }

                                                        </div>


                                                        <div>

                                                            <p
                                                                className="
                                                                    font-semibold
                                                                    text-slate-800
                                                                "
                                                            >
                                                                {student.fullName}
                                                            </p>


                                                            <p
                                                                className="
                                                                    mt-0.5
                                                                    text-xs
                                                                    text-slate-400
                                                                "
                                                            >
                                                                ID: {
                                                                    student.userId
                                                                }
                                                            </p>

                                                        </div>

                                                    </div>

                                                </td>



                                                {/* EMAIL */}

                                                <td
                                                    className="
                                                        px-6 py-5
                                                        text-sm
                                                        text-slate-600
                                                    "
                                                >

                                                    {student.email}

                                                </td>



                                                {/* ROLE */}

                                                <td
                                                    className="
                                                        px-6 py-5
                                                    "
                                                >

                                                    <span
                                                        className="
                                                            inline-flex
                                                            rounded-md
                                                            bg-blue-50
                                                            px-3 py-1
                                                            text-xs
                                                            font-semibold
                                                            text-blue-700
                                                        "
                                                    >

                                                        {student.userRole ||
                                                            "STUDENT"
                                                        }

                                                    </span>

                                                </td>



                                                {/* STATUS */}

                                                <td
                                                    className="
                                                        px-6 py-5
                                                    "
                                                >

                                                    <span
                                                        className={`
                                                            inline-flex
                                                            rounded-full
                                                            px-3 py-1
                                                            text-xs
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

                                                </td>



                                                {/* ACTION */}

                                                <td
                                                    className="
                                                        px-6 py-5
                                                    "
                                                >

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            navigate(
                                                                `/teacher/students/${student.userId}`
                                                            )
                                                        }
                                                        className="
                                                            rounded-lg
                                                            border
                                                            border-slate-300
                                                            bg-white
                                                            px-4 py-2
                                                            text-sm
                                                            font-medium
                                                            text-slate-700
                                                            transition
                                                            hover:bg-slate-50
                                                        "
                                                    >

                                                        View Profile

                                                    </button>

                                                </td>

                                            </tr>

                                        ))}

                                    </tbody>

                                </table>

                            </div>

                        </div>

                    )}



                    {/* ================================================= */}
                    {/* NO SEARCH RESULTS */}
                    {/* ================================================= */}

                    {!loading &&
                        !error &&
                        students.length > 0 &&
                        filteredStudents.length === 0 && (

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

                            <div className="mb-4 text-4xl">
                                🔍
                            </div>


                            <h3
                                className="
                                    text-lg
                                    font-semibold
                                    text-slate-800
                                "
                            >
                                No students found
                            </h3>


                            <p
                                className="
                                    mt-2
                                    text-sm
                                    text-slate-500
                                "
                            >
                                Try searching with a different name or email.
                            </p>

                        </div>

                    )}



                    {/* ================================================= */}
                    {/* EMPTY */}
                    {/* ================================================= */}

                    {!loading &&
                        !error &&
                        students.length === 0 && (

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

                            <div className="mb-4 text-4xl">
                                👨‍🎓
                            </div>


                            <h3
                                className="
                                    text-lg
                                    font-semibold
                                    text-slate-800
                                "
                            >
                                No students found
                            </h3>


                            <p
                                className="
                                    mt-2
                                    text-sm
                                    text-slate-500
                                "
                            >
                                There are currently no students registered in the system.
                            </p>

                        </div>

                    )}

                </section>

            </main>

        </div>

    );

};


export default TeacherStudents;