import api from "./axios";

export const loginUser = (credentials) => {
    return api.post("/auth/login", credentials);
};

export const registerUser = (userData) => {
    return api.post("/auth/register", userData);
};