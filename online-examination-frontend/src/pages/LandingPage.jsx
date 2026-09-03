import { useNavigate } from "react-router-dom";

const LandingPage = () => {

    const navigate = useNavigate();

    return (

        <div className="min-h-screen bg-slate-50 text-slate-800">

            {/* =========================================
                HEADER
            ========================================= */}

            <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">

                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">

                    {/* Logo */}

                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        className="flex items-center gap-3 text-left"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white shadow-sm">
                            OE
                        </div>

                        <div>
                            <h1 className="text-base font-bold text-slate-900">
                                Online Examination
                            </h1>

                            <p className="text-xs text-slate-500">
                                Smart Examination Platform
                            </p>
                        </div>
                    </button>


                    {/* Navigation */}

                    <div className="flex items-center gap-3">

                        <button
                            onClick={() => navigate("/login")}
                            className="
                                rounded-lg
                                px-4 py-2.5
                                text-sm font-semibold
                                text-slate-700
                                transition
                                hover:bg-slate-100
                            "
                        >
                            Login
                        </button>

                        <button
                            onClick={() => navigate("/register")}
                            className="
                                rounded-lg
                                bg-blue-600
                                px-4 py-2.5
                                text-sm font-semibold
                                text-white
                                shadow-sm
                                transition
                                hover:bg-blue-700
                            "
                        >
                            Register
                        </button>

                    </div>

                </div>

            </header>


            {/* =========================================
                HERO SECTION
            ========================================= */}

            <main>

                <section className="relative overflow-hidden">

                    {/* Background decoration */}

                    <div className="absolute inset-0 -z-10">

                        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-100 opacity-60 blur-3xl" />

                    </div>


                    <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">

                        {/* Hero text */}

                        <div>

                            <span className="
                                inline-flex
                                rounded-full
                                border border-blue-200
                                bg-blue-50
                                px-3 py-1
                                text-xs
                                font-semibold
                                text-blue-700
                            ">
                                Modern Online Examination System
                            </span>


                            <h2 className="
                                mt-6
                                text-4xl
                                font-extrabold
                                tracking-tight
                                text-slate-900
                                sm:text-5xl
                                lg:text-6xl
                            ">

                                Take exams.
                                <span className="block text-blue-600">
                                    Track progress.
                                </span>
                                Achieve more.

                            </h2>


                            <p className="
                                mt-6
                                max-w-xl
                                text-base
                                leading-7
                                text-slate-500
                                sm:text-lg
                            ">

                                A secure and modern platform for conducting
                                online examinations, managing questions,
                                evaluating attempts, and reviewing results.

                            </p>


                            {/* Hero buttons */}

                            <div className="mt-8 flex flex-wrap gap-4">

                                <button
                                    onClick={() => navigate("/login")}
                                    className="
                                        rounded-lg
                                        bg-blue-600
                                        px-6 py-3
                                        text-sm font-semibold
                                        text-white
                                        shadow-md
                                        transition
                                        hover:bg-blue-700
                                        hover:shadow-lg
                                    "
                                >
                                    Login to Continue →
                                </button>


                                <button
                                    onClick={() => navigate("/register")}
                                    className="
                                        rounded-lg
                                        border border-slate-300
                                        bg-white
                                        px-6 py-3
                                        text-sm font-semibold
                                        text-slate-700
                                        transition
                                        hover:bg-slate-50
                                    "
                                >
                                    Create Student Account
                                </button>

                            </div>


                            {/* Small trust information */}

                            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">

                                <span className="flex items-center gap-2">
                                    <span className="text-emerald-500">✓</span>
                                    Secure authentication
                                </span>

                                <span className="flex items-center gap-2">
                                    <span className="text-emerald-500">✓</span>
                                    Automatic evaluation
                                </span>

                                <span className="flex items-center gap-2">
                                    <span className="text-emerald-500">✓</span>
                                    Result review
                                </span>

                            </div>

                        </div>


                        {/* Hero dashboard preview */}

                        <div className="relative">

                            <div className="
                                rounded-2xl
                                border border-slate-200
                                bg-white
                                p-5
                                shadow-2xl
                            ">

                                {/* Fake browser header */}

                                <div className="mb-5 flex items-center gap-2">

                                    <span className="h-3 w-3 rounded-full bg-red-400" />
                                    <span className="h-3 w-3 rounded-full bg-yellow-400" />
                                    <span className="h-3 w-3 rounded-full bg-green-400" />

                                    <div className="ml-3 h-7 flex-1 rounded-md bg-slate-100" />

                                </div>


                                {/* Dashboard preview */}

                                <div className="rounded-xl bg-slate-50 p-5">

                                    <div className="flex items-center justify-between">

                                        <div>

                                            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                                                Student Dashboard
                                            </p>

                                            <h3 className="mt-1 text-xl font-bold text-slate-900">
                                                Welcome back!
                                            </h3>

                                        </div>

                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                                            S
                                        </div>

                                    </div>


                                    {/* Preview statistics */}

                                    <div className="mt-6 grid grid-cols-3 gap-3">

                                        <div className="rounded-lg bg-white p-4 shadow-sm">

                                            <p className="text-xs text-slate-500">
                                                Available
                                            </p>

                                            <p className="mt-2 text-2xl font-bold text-slate-900">
                                                08
                                            </p>

                                        </div>


                                        <div className="rounded-lg bg-white p-4 shadow-sm">

                                            <p className="text-xs text-slate-500">
                                                Progress
                                            </p>

                                            <p className="mt-2 text-2xl font-bold text-slate-900">
                                                02
                                            </p>

                                        </div>


                                        <div className="rounded-lg bg-white p-4 shadow-sm">

                                            <p className="text-xs text-slate-500">
                                                Completed
                                            </p>

                                            <p className="mt-2 text-2xl font-bold text-slate-900">
                                                12
                                            </p>

                                        </div>

                                    </div>


                                    {/* Exam preview */}

                                    <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4">

                                        <div className="flex items-start justify-between">

                                            <div>

                                                <span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-bold text-blue-700">
                                                    CS101
                                                </span>

                                                <h4 className="mt-3 font-semibold text-slate-900">
                                                    Data Structures
                                                </h4>

                                                <p className="mt-1 text-xs text-slate-500">
                                                    Computer Science
                                                </p>

                                            </div>

                                            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                                                Available
                                            </span>

                                        </div>


                                        <div className="mt-4 grid grid-cols-2 gap-3">

                                            <div className="rounded-lg bg-slate-50 p-3">

                                                <p className="text-xs text-slate-500">
                                                    Duration
                                                </p>

                                                <p className="mt-1 text-sm font-semibold">
                                                    60 min
                                                </p>

                                            </div>

                                            <div className="rounded-lg bg-slate-50 p-3">

                                                <p className="text-xs text-slate-500">
                                                    Questions
                                                </p>

                                                <p className="mt-1 text-sm font-semibold">
                                                    30
                                                </p>

                                            </div>

                                        </div>


                                        <div className="mt-4 h-9 rounded-lg bg-blue-600 text-center text-xs font-semibold leading-9 text-white">
                                            Start Examination →
                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </section>


                {/* =========================================
                    STATS
                ========================================= */}

                <section className="border-y border-slate-200 bg-white">

                    <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-slate-200 sm:grid-cols-4">

                        <div className="px-5 py-8 text-center">

                            <p className="text-3xl font-bold text-slate-900">
                                24/7
                            </p>

                            <p className="mt-1 text-sm text-slate-500">
                                Exam Access
                            </p>

                        </div>


                        <div className="px-5 py-8 text-center">

                            <p className="text-3xl font-bold text-slate-900">
                                100%
                            </p>

                            <p className="mt-1 text-sm text-slate-500">
                                Digital
                            </p>

                        </div>


                        <div className="px-5 py-8 text-center">

                            <p className="text-3xl font-bold text-slate-900">
                                Auto
                            </p>

                            <p className="mt-1 text-sm text-slate-500">
                                Evaluation
                            </p>

                        </div>


                        <div className="px-5 py-8 text-center">

                            <p className="text-3xl font-bold text-slate-900">
                                Secure
                            </p>

                            <p className="mt-1 text-sm text-slate-500">
                                Authentication
                            </p>

                        </div>

                    </div>

                </section>


                {/* =========================================
                    FEATURES
                ========================================= */}

                <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">

                    <div className="mx-auto max-w-2xl text-center">

                        <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                            Platform Features
                        </p>

                        <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                            Everything you need for online examinations
                        </h2>

                        <p className="mt-4 text-slate-500">
                            Designed to make examination management simple
                            for teachers and examination taking convenient
                            for students.
                        </p>

                    </div>


                    <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">


                        {/* Feature 1 */}

                        <div className="
                            rounded-xl
                            border border-slate-200
                            bg-white
                            p-6
                            shadow-sm
                            transition
                            hover:-translate-y-1
                            hover:shadow-md
                        ">

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl">
                                📝
                            </div>

                            <h3 className="mt-5 text-lg font-bold text-slate-900">
                                Easy Exam Management
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                Teachers can create, update, publish and
                                manage examinations from a centralized
                                dashboard.
                            </p>

                        </div>


                        {/* Feature 2 */}

                        <div className="
                            rounded-xl
                            border border-slate-200
                            bg-white
                            p-6
                            shadow-sm
                            transition
                            hover:-translate-y-1
                            hover:shadow-md
                        ">

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-2xl">
                                ⚡
                            </div>

                            <h3 className="mt-5 text-lg font-bold text-slate-900">
                                Automatic Evaluation
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                Submitted examinations can be evaluated
                                automatically and results stored for later
                                review.
                            </p>

                        </div>


                        {/* Feature 3 */}

                        <div className="
                            rounded-xl
                            border border-slate-200
                            bg-white
                            p-6
                            shadow-sm
                            transition
                            hover:-translate-y-1
                            hover:shadow-md
                        ">

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-2xl">
                                ⏱
                            </div>

                            <h3 className="mt-5 text-lg font-bold text-slate-900">
                                Timed Examinations
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                Exam duration and examination windows help
                                ensure that assessments are conducted within
                                defined time limits.
                            </p>

                        </div>


                        {/* Feature 4 */}

                        <div className="
                            rounded-xl
                            border border-slate-200
                            bg-white
                            p-6
                            shadow-sm
                            transition
                            hover:-translate-y-1
                            hover:shadow-md
                        ">

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-2xl">
                                ❓
                            </div>

                            <h3 className="mt-5 text-lg font-bold text-slate-900">
                                Question Management
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                Organize examination questions and associate
                                them with the appropriate subjects and exams.
                            </p>

                        </div>


                        {/* Feature 5 */}

                        <div className="
                            rounded-xl
                            border border-slate-200
                            bg-white
                            p-6
                            shadow-sm
                            transition
                            hover:-translate-y-1
                            hover:shadow-md
                        ">

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-50 text-2xl">
                                📊
                            </div>

                            <h3 className="mt-5 text-lg font-bold text-slate-900">
                                Results & Analytics
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                Students can view their results while teachers
                                can manage examination outcomes and attempts.
                            </p>

                        </div>


                        {/* Feature 6 */}

                        <div className="
                            rounded-xl
                            border border-slate-200
                            bg-white
                            p-6
                            shadow-sm
                            transition
                            hover:-translate-y-1
                            hover:shadow-md
                        ">

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-2xl">
                                🔐
                            </div>

                            <h3 className="mt-5 text-lg font-bold text-slate-900">
                                Secure Access
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                Authentication and protected application areas
                                keep student and teacher functionality
                                separated.
                            </p>

                        </div>

                    </div>

                </section>


                {/* =========================================
                    HOW IT WORKS
                ========================================= */}

                <section className="bg-slate-900 text-white">

                    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">

                        <div className="mx-auto max-w-2xl text-center">

                            <p className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                                Simple Workflow
                            </p>

                            <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
                                From login to result
                            </h2>

                            <p className="mt-4 text-slate-400">
                                A straightforward examination workflow for
                                students and teachers.
                            </p>

                        </div>


                        <div className="mt-12 grid gap-8 md:grid-cols-4">

                            <div className="text-center">

                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-lg font-bold">
                                    1
                                </div>

                                <h3 className="mt-4 font-semibold">
                                    Login
                                </h3>

                                <p className="mt-2 text-sm text-slate-400">
                                    Access your secure examination account.
                                </p>

                            </div>


                            <div className="text-center">

                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-lg font-bold">
                                    2
                                </div>

                                <h3 className="mt-4 font-semibold">
                                    Choose Exam
                                </h3>

                                <p className="mt-2 text-sm text-slate-400">
                                    Select an examination available to you.
                                </p>

                            </div>


                            <div className="text-center">

                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-lg font-bold">
                                    3
                                </div>

                                <h3 className="mt-4 font-semibold">
                                    Take Exam
                                </h3>

                                <p className="mt-2 text-sm text-slate-400">
                                    Answer questions within the allowed time.
                                </p>

                            </div>


                            <div className="text-center">

                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-lg font-bold">
                                    4
                                </div>

                                <h3 className="mt-4 font-semibold">
                                    View Result
                                </h3>

                                <p className="mt-2 text-sm text-slate-400">
                                    Review your performance and submitted answers.
                                </p>

                            </div>

                        </div>

                    </div>

                </section>


                {/* =========================================
                    CTA
                ========================================= */}

                <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">

                    <div className="
                        rounded-2xl
                        bg-blue-600
                        px-6 py-12
                        text-center
                        shadow-lg
                        sm:px-12
                    ">

                        <h2 className="text-3xl font-bold text-white">
                            Ready to get started?
                        </h2>

                        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-blue-100 sm:text-base">
                            Create your student account and start taking
                            examinations through the online examination
                            platform.
                        </p>


                        <div className="mt-7 flex flex-wrap justify-center gap-3">

                            <button
                                onClick={() => navigate("/register")}
                                className="
                                    rounded-lg
                                    bg-white
                                    px-6 py-3
                                    text-sm font-semibold
                                    text-blue-700
                                    transition
                                    hover:bg-blue-50
                                "
                            >
                                Register Now →
                            </button>


                            <button
                                onClick={() => navigate("/login")}
                                className="
                                    rounded-lg
                                    border border-blue-400
                                    px-6 py-3
                                    text-sm font-semibold
                                    text-white
                                    transition
                                    hover:bg-blue-700
                                "
                            >
                                Login
                            </button>

                        </div>

                    </div>

                </section>

            </main>


            {/* =========================================
                FOOTER
            ========================================= */}

            <footer className="border-t border-slate-200 bg-white">

                <div className="
                    mx-auto
                    flex max-w-7xl
                    flex-col
                    gap-3
                    px-4 py-6
                    text-center
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                    sm:text-left
                    sm:px-6
                    lg:px-8
                ">

                    <div>

                        <p className="text-sm font-semibold text-slate-800">
                            Online Examination System
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                            Modern digital examination platform
                        </p>

                    </div>


                    <p className="text-xs text-slate-400">
                        © {new Date().getFullYear()} Online Examination System
                    </p>

                </div>

            </footer>

        </div>

    );
};

export default LandingPage;