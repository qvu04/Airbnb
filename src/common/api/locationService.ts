import { CYBER_TOKEN, https } from "./config"
import axios from 'axios';

export interface Location {
    id: number;
    tenViTri: string;
    tinhThanh: string;
    quocGia: string;
    hinhAnh: string;
}
export const getLocationService = () => {
    return https.get("/api/vi-tri");
}
export const getLocationListService = (pageIndex: number, pageSize: number) => {
    return https.get(`/api/vi-tri/phan-trang-tim-kiem?pageIndex=${pageIndex}&pageSize=${pageSize}`);
}
export const getLocationSearchService = (
    pageIndex: number,
    pageSize: number,
    keyword: string
) => {
    return axios.get("https://airbnbnew.cybersoft.edu.vn/api/vi-tri/phan-trang-tim-kiem", {
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
export const addLocationService = (location: Location) => {
    return https.post(`/api/vi-tri`, location);
}
export const deleteLocationService = (id: number) => {
    return https.delete(`/api/vi-tri/${id}`);
}
export const updateLocationService = (location: Location) => {
    return https.put(`/api/vi-tri/${location.id}`, location);
}