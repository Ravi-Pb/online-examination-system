import api from "./axios";

export const getExams = () => {
    return api.get("/exams");
};

export const startExam = (examId) => {
    return api.post(`/exams/${examId}/start`);
};

export const getActiveAttempt = (examId) => {
    return api.get(`/exams/${examId}/active-attempt`);
};

export const getAttemptQuestions = (attemptId) => {
    return api.get(`/attempts/${attemptId}/questions`);
};

export const saveAnswer = (attemptId, answerData) => {
    return api.post(
        `/attempts/${attemptId}/answers`,
        answerData
    );
};

export const submitExam = (attemptId) => {
    return api.post(
        `/attempts/${attemptId}/submit`
    );
};
export const getAttempt = (attemptId) => {
    return api.get(`/attempts/${attemptId}`);
};
export const getAnswerReview = (attemptId) => {
    return api.get(`/attempts/${attemptId}/review`);
};
export const getMyAttempts = () => {
    return api.get("/attempts/my");
};

export const getExamResult = (attemptId) => {
    return api.get(`/attempts/${attemptId}/result`);
};
