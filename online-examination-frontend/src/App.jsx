import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import ExamPage from "./pages/ExamPage";
import ResultPage from "./pages/ResultPage";
import AnswerReview from "./pages/AnswerReview";
import CreateExam from "./pages/teacher/CreateExam";
import TeacherExams from "./pages/teacher/TeacherExams";
import TeacherQuestions from "./pages/teacher/TeacherQuestions";
import LandingPage from "./pages/LandingPage";
import AddQuestion from "./pages/teacher/AddQuestion";
import TeacherSubjects from "./pages/teacher/TeacherSubjects";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Public routes */}
                <Route path="/" element={<LandingPage />} />
                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />


                {/* Student routes */}

                <Route element={
                    <ProtectedRoute
                        allowedRoles={["STUDENT"]}
                    />
                }>

                    <Route
                        path="/student/dashboard"
                        element={<StudentDashboard />}
                    />

                    <Route
                        path="/exam/:attemptId"
                        element={<ExamPage />}
                    />

                    <Route
                        path="/result/:attemptId"
                        element={<ResultPage />}
                    />

                    <Route
                        path="/review/:attemptId"
                        element={<AnswerReview />}
                    />

                </Route>


                {/* Teacher routes */}

                <Route element={
                    <ProtectedRoute
                        allowedRoles={["TEACHER"]}
                    />
                }>

                    <Route
                        path="/teacher/dashboard"
                        element={<TeacherDashboard />}
                    />

                </Route>

                    <Route
                        path="/teacher/create-exam"
                        element={<CreateExam />}
                    />

                <Route
                    path="/teacher/exams"
                    element={<TeacherExams />}
                />
                <Route
                    path="/teacher/exams/:examId/questions/create"
                    element={<AddQuestion />}
                />
                <Route
                    path="/teacher/questions"
                    element={<TeacherQuestions />}
                />

                <Route
                    path="/teacher/subjects"
                    element={<TeacherSubjects />}
                />

                {/* Default route */}

                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />

                {/* Unknown route */}

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />

                

            </Routes>
        </BrowserRouter>
    );
}

export default App;