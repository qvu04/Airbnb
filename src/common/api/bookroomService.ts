import axios from "axios";
import { https, CYBER_TOKEN } from './config';

export interface BookedRooms {
    id: number,
    maPhong: number,
    ngayDen: string,
    ngayDi: string,
    soLuongKhach: number,
    maNguoiDung: number
}
export interface BookingPayload {
    maPhong: number,
    ngayDen: string,
    ngayDi: string,
    soLuongKhach: number,
    maNguoiDung: number
}
export const getBookedRoomService = (maNguoiDung: number) => {
    return https.get(`/api/dat-phong/lay-theo-nguoi-dung/${maNguoiDung}`);
}
export const getBookingService = () => {
    return axios.get("https://airbnbnew.cybersoft.edu.vn/api/dat-phong", {
        headers: {
            TokenCybersoft: CYBER_TOKEN,
        },
    });
};
export const addBookingService = (booking: BookedRooms) => {
    return https.post(`/api/dat-phong`, booking);
}
export const deleteBookingService = (id: number) => {
    return https.delete(`/api/dat-phong/${id}`);
}
export const updateBookingService = (booking: BookedRooms) => {
    return https.put(`/api/dat-phong/${booking.id}`, booking);
};
