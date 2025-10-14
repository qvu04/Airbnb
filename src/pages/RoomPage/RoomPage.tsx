import { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { getRoomService, RoomDetailType } from '../../common/api/roomService';

export default function RoomPage() {
    const { locationId } = useParams();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('id');

    const [rooms, setRooms] = useState<RoomDetailType[]>([]);

    const fetchRooms = async (id: string) => {
        try {
            const res = await getRoomService(id);
            const data: RoomDetailType[] = res.data.content;
            setRooms(data);
        } catch (error) {
            console.log('✌️error --->', error);
        }
    };

    const getAmenities = (room: RoomDetailType) => {
        const amenities: string[] = [];
        if (room.wifi) amenities.push('Wifi');
        if (room.mayGiat) amenities.push('Máy giặt');
        if (room.tivi) amenities.push('TV');
        if (room.dieuHoa) amenities.push('Điều hòa');
        if (room.hoBoi) amenities.push('Hồ bơi');
        if (room.bep) amenities.push('Bếp');
        if (room.doXe) amenities.push('Đỗ xe');
        if (room.banUi) amenities.push('Bàn ủi');
        if (room.banLa) amenities.push('Bàn là');
        return amenities.join(' • ');
    };

    useEffect(() => {
        if (id) {
            fetchRooms(id);
        }
    }, [id]);

    return (
        <div className="bg-gray-50 min-h-screen text-gray-800">
            {/* NỘI DUNG CHÍNH */}
            <main className="max-w-screen-xl mx-auto flex flex-col lg:flex-row gap-8 px-6 py-10">
                {/* Danh sách phòng */}
                <div className="flex-1 space-y-6">
                    <h2 className="text-2xl font-semibold mb-2 text-gray-800">
                        Chỗ ở tại khu vực nổi bật
                    </h2>

                    {rooms.length === 0 ? (
                        <p className="text-gray-500 italic mt-3">
                            Không có phòng nào phù hợp.
                        </p>
                    ) : (
                        rooms.map((room) => (
                            <Link
                                to={`/rooms/${locationId}/${room.id}`}
                                key={room.id}
                                className="group flex bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-[2px] border border-gray-100"
                            >
                                {/* Ảnh */}
                                <div className="relative w-[40%] overflow-hidden min-h-[200px]">
                                    <img
                                        src={room.hinhAnh}
                                        alt={room.tenPhong}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>

                                {/* Nội dung */}
                                <div className="p-6 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-pink-600 transition-colors">
                                            {room.tenPhong}
                                        </h3>
                                        <p className="text-gray-600 text-sm mt-1">
                                            {room.khach} khách • {room.phongNgu} phòng ngủ •{" "}
                                            {room.giuong} giường • {room.phongTam} phòng tắm
                                        </p>
                                        <p className="text-gray-500 text-sm mt-1 italic">
                                            {getAmenities(room)}
                                        </p>
                                    </div>
                                    <p className="text-lg font-bold text-gray-900 mt-3">
                                        ${room.giaTien}{" "}
                                        <span className="text-gray-500 font-normal">/ đêm</span>
                                    </p>
                                </div>
                            </Link>
                        ))
                    )}
                </div>

                {/* Bản đồ (sticky bên phải) */}
                <div className="hidden lg:block w-[40%]">
                    <div className="sticky top-24 rounded-3xl overflow-hidden shadow-md border border-gray-200">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18..."
                            className="w-full h-[80vh]"
                            loading="lazy"
                        ></iframe>
                    </div>
                </div>
            </main>
        </div>
    );
}
