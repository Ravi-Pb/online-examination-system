import { useNavigate, useLocation } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";


const TeacherSidebar = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const { logout } = useAuth();


    // ========================================
    // LOGOUT
    // ========================================

    const handleLogout = () => {

        logout();

        navigate(
            "/login",
            {
                replace: true
            }
        );

    };


    // ========================================
    // CHECK ACTIVE PAGE
    // ========================================

    const isActive = (path) => {

        return location.pathname === path;

    };


    // ========================================
    // NAVIGATION ITEM STYLE
    // ========================================

    const getNavClass = (path) => {

        return `
            w-full flex items-center gap-3
            px-4 py-3
            rounded-lg
            transition
            text-left
            ${
                isActive(path)
                    ? "bg-slate-700 text-white font-medium"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }
        `;

    };


    // ========================================
    // UI
    // ========================================

    return (
<>
    <div className="w-64 shrink-0"></div>

    <aside
        className="
            fixed
            left-0
            top-0
            h-screen
            w-64
            overflow-y-auto
            bg-slate-900
        "
    >
            {/* ================================= */}
            {/* LOGO */}
            {/* ================================= */}

            <div className="px-6 text-slate-100 mt-1 py-5 border-b border-slate-700">

                <h1 className="text-xl font-bold">
                    Online Examination
                </h1>

                <p className="text-xs text-slate-400 mt-1">
                    Teacher Panel
                </p>

            </div>


            {/* ================================= */}
            {/* NAVIGATION */}
            {/* ================================= */}

            <nav className="flex-1 px-4 py-6 space-y-2">


                {/* Dashboard */}

                <button
                    onClick={() =>
                        navigate("/teacher/dashboard")
                    }
                    className={getNavClass(
                        "/teacher/dashboard"
                    )}
                >

                    <span>🏠</span>

                    Dashboard

                </button>


                {/* My Exams */}

                <button
                    onClick={() =>
                        navigate("/teacher/exams")
                    }
                    className={getNavClass(
                        "/teacher/exams"
                    )}
                >

                    <span>📝</span>

                    My Exams

                </button>


                {/* Create Exam */}

                <button
                    onClick={() =>
                        navigate("/teacher/create-exam")
                    }
                    className={getNavClass(
                        "/teacher/create-exam"
                    )}
                >

                    <span>➕</span>

                    Create Exam

                </button>


                {/* Questions */}

                <button
                    onClick={() =>
                        navigate("/teacher/questions")
                    }
                    className={getNavClass(
                        "/teacher/questions"
                    )}
                >

                    <span>❓</span>

                    Questions

                </button>


                {/* Results */}

                <button
                    onClick={() =>
                        navigate("/teacher/results")
                    }
                    className={getNavClass(
                        "/teacher/results"
                    )}
                >

                    <span>📊</span>

                    Results

                </button>


                {/* Students */}

                <button
                    onClick={() =>
                        navigate("/teacher/students")
                    }
                    className={getNavClass(
                        "/teacher/students"
                    )}
                >

                    <span>👥</span>

                    Students

                </button>


                {/* Subjects */}

                <button
                    onClick={() =>
                        navigate("/teacher/subjects")
                    }
                    className={getNavClass(
                        "/teacher/subjects"
                    )}
                >

                    <span>📚</span>

                    Subjects

                </button>


                {/* Profile */}

                <button
                    onClick={() =>
                        navigate("/teacher/profile")
                    }
                    className={getNavClass(
                        "/teacher/profile"
                    )}
                >

                    <span>👤</span>

                    Profile

                </button>

            </nav>


            {/* ================================= */}
            {/* LOGOUT */}
            {/* ================================= */}

            <div className="px-4 py-5 border-t border-slate-700">

                <button
                    onClick={handleLogout}
                    className="
                        w-full flex items-center gap-3
                        px-4 py-3
                        rounded-lg
                        text-slate-300
                        hover:bg-red-600
                        hover:text-white
                        transition
                        text-left
                    "
                >

                    <span>🚪</span>

                    Logout

                </button>

            </div>

        </aside>
        </>

    );

};


export default TeacherSidebar;