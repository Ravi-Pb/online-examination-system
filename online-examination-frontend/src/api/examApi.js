import api from "./axios";
//Student
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

// ========================================
// TEACHER - EXAMS
// ========================================

export const getMyExams = () => {
    return api.get("/exams/my");
};

export const getExamById = (examId) => {
    return api.get(`/exams/${examId}`);
};

// export const createExam = (examData) => {
//     return api.post("/exams", examData);
// };
export const createExam = async (examData) => {

    const response = await api.post(
        "/exams",
        examData
    );

    return response.data;
};


export const updateExam = (examId, examData) => {
    return api.put(
        `/exams/${examId}`,
        examData
    );
};

export const deleteExam = (examId) => {
    return api.delete(
        `/exams/${examId}`
    );
};

export const publishExam = (examId) => {
    return api.patch(
        `/exams/${examId}/publish`
    );
};

// Get all subjects
export const getSubjects = async () => {

    const response = await api.get(
        "/subjects"
    );

    return response.data;
};