import api from "./axios";


// ========================================
// CREATE QUESTION
// ========================================

export const createQuestion = (
    examId,
    question
) => {

    return api.post(
        `/exams/${examId}/questions`,
        question
    );

};


// ========================================
// GET QUESTIONS BY EXAM
// ========================================

export const getQuestionsByExam = (
    examId
) => {

    return api.get(
        `/exams/${examId}/questions`
    );

};


// ========================================
// GET SINGLE QUESTION
// ========================================

export const getQuestionById = (
    questionId
) => {

    return api.get(
        `/questions/${questionId}`
    );

};


// ========================================
// UPDATE QUESTION
// ========================================

export const updateQuestion = (
    questionId,
    question
) => {

    return api.put(
        `/questions/${questionId}`,
        question
    );

};


// ========================================
// DELETE QUESTION
// ========================================

export const deleteQuestion = (
    questionId
) => {

    return api.delete(
        `/questions/${questionId}`
    );

};


// ========================================
// GET QUESTIONS FOR CURRENT TEACHER
// ========================================

export const getQuestionsForTeacher = () => {

    return api.get(
        "/questions"
    );

};