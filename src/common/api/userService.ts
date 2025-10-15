import axios from "axios";
import { CYBER_TOKEN, https } from "./config"

export interface LoginPayload {
    email: string,
    password: string
}
export interface RegisterPayload {
    id: number,
    name: string,
    email: string,
    password: string,
    phone: string,
    birthday: string,
    gender: boolean,
    role: string,
}
export interface UserType {
    id: number;
    name: string;
    email: string;
    phone: string;
    birthday: string;
    gender: boolean;
    role: string;
}
export const loginService = (user: LoginPayload) => {
    return https.post(`/api/auth/signin`, user);

}
export const registerService = (user: RegisterPayload) => {
    return https.post(`/api/auth/signup`, user);
}
export const uploadAvatarUserService = (file: File) => {
    const formData = new FormData();
    formData.append("formFile", file); // ✅ Đúng theo yêu cầu backend

    return https.post(`/api/users/upload-avatar`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const getUserService = (
    pageIndex: number,
    pageSize: number,
    keyword: string
) => {
    return axios.get("https://airbnbnew.cybersoft.edu.vn/api/users/phan-trang-tim-kiem", {
        params: {
            pageIndex,
            pageSize,
            keyword,
        },
        headers: {
            tokenCybersoft: CYBER_TOKEN
        }
    });
};
export const addUserService = (user: UserType) => {
    return https.post(`/api/users`, user);
}
export const deleteUserService = (id: number) => {
    return https.delete(`/api/users`, {
        params: { id }
    });
};
export const updateUserService = (user: UserType) => {
    return https.put(`/api/users/${user.id}`, user);
}   