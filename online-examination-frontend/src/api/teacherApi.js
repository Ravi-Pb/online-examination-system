import api from "./axios";


// ========================================
// GET TEACHER PROFILE
// ========================================

export const getTeacherProfile = async () => {

    const response =
        await api.get(
            "/users/teacher/me"
        );

    return response.data;
};