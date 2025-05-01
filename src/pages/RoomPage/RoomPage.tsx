import React, { useEffect, useState } from 'react';
import { getRoomService } from '../../api/roomService';
import { useParams, useLocation, Link } from 'react-router-dom';

interface Room {
    id: number;
    tenPhong: string;
    khach: number;
    phongNgu: number;
    giuong: number;
    phongTam: number;
    moTa: string;
    giaTien: number;
    mayGiat: boolean;
    banLa: boolean;
    tivi: boolean;
    dieuHoa: boolean;
    wifi: boolean;
    bep: boolean;
    doXe: boolean;
    hoBoi: boolean;
    banUi: boolean;
    hinhAnh: string;
}

export default function RoomPage() {
    const { locationId } = useParams();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('id');

    const [rooms, setRooms] = useState<Room[]>([]);

    const fetchRooms = async (id: string) => {
        try {
            const res = await getRoomService(id);
            const data: Room[] = res.data.content;
            setRooms(data);
        } catch (error) {
            console.log('✌️error --->', error);
        }
    };

    const getAmenities = (room: Room) => {
        const amenities: string[] = [];
        if (room.wifi) amenities.push("Wifi");
        if (room.mayGiat) amenities.push("Máy giặt");
        if (room.tivi) amenities.push("TV");
        if (room.dieuHoa) amenities.push("Điều hòa");
        if (room.hoBoi) amenities.push("Hồ bơi");
        if (room.bep) amenities.push("Bếp");
        if (room.doXe) amenities.push("Đỗ xe");
        if (room.banUi) amenities.push("Bàn ủi");
        if (room.banLa) amenities.push("Bàn là");
        return amenities.join(" • ");
    };

    useEffect(() => {
        if (id) {
            fetchRooms(id);
        }
    }, [id]);

    return (

        <div className="container mx-auto px-4 py-8">

            <div className="mb-6">
                <p className="text-gray-600 text-sm">
                    Có {rooms.length} chỗ ở tại {locationId} • 27/04/2025 – 04/05/2025
                </p>
                <h1 className="text-2xl font-bold mt-2">
                    Chỗ ở tại khu vực bạn đã chọn
                </h1>
                <Link className="font-bold cursor-pointer" to="/">
                    Bạn muốn muốn chọn khu vực khác - Click vào đây !
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {rooms.map((room) => (
                    <Link
                        key={room.id}
                        className="flex cursor-pointer bg-white rounded-lg shadow-md overflow-hidden"
                        to={`/rooms/${locationId}/${room.id}`}
                    >

                        <div className="relative w-1/3">
                            <img
                                src={room.hinhAnh}
                                alt={room.tenPhong}
                                className="w-full h-48 object-cover"

                            />
                            <button className="absolute top-2 right-2 text-gray-600 hover:text-red-500">
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                    ></path>
                                </svg>
                            </button>
                        </div>

                        <div className="p-4 flex-1">
                            <h2 className="text-lg font-semibold truncate">
                                {room.tenPhong}
                            </h2>
                            <p className="text-gray-600 text-sm mt-1">
                                {room.khach} khách • {room.phongNgu} phòng ngủ • {room.giuong} giường • {room.phongTam} phòng tắm • {getAmenities(room)}
                            </p>
                            <p className="text-lg font-bold mt-2">
                                ${room.giaTien} / đêm
                            </p>
                        </div>

                    </Link>
                ))}
            </div>

        </div>
    );
}
