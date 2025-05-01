import React, { useEffect, useState } from 'react'
import { BookedRooms, getBookedRoomService } from '../../api/bookroomService'
import { getRoomDetailService } from '../../api/roomService'
import { useSelector } from 'react-redux'
import { RootState } from '../../main'

interface EnrichedBooking extends BookedRooms {
    roomDetail: {
        tenPhong: string;
        hinhAnh: string;
        moTa: string;
        giaTien: number;
    }; // Có thể khai báo cụ thể interface nếu muốn
}

export default function BookedRoom() {
    const [enrichedRooms, setEnrichedRooms] = useState<EnrichedBooking[]>([]);
    const { user } = useSelector((state: RootState) => state.userSlice);

    const fetchBookedRoom = async () => {
        try {
            if (!user?.id) return;

            const res = await getBookedRoomService(user.id);
            const data: BookedRooms[] = res.data.content;

            const enrichedData: EnrichedBooking[] = await Promise.all(
                data.map(async (booking): Promise<EnrichedBooking> => {
                    const roomRes = await getRoomDetailService(booking.maPhong);
                    const roomDetail = roomRes.data.content;
                    return { ...booking, roomDetail };
                })
            );

            setEnrichedRooms(enrichedData);
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu phòng đã đặt:", error);
        }
    };

    useEffect(() => {
        fetchBookedRoom();
    }, [user]);

    return (
        <div className="p-4">
            <p className='font-bold text-3xl'>Xin chào tôi là {user.name}</p>
            <h2 className="text-xl font-bold mb-4">Phòng đã thuê</h2>
            {enrichedRooms.length === 0 ? (
                <p>Bạn chưa đặt phòng nào.</p>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {enrichedRooms.map((booking) => (
                        <div key={booking.id} className="flex border rounded-xl overflow-hidden shadow">
                            <img
                                src={booking.roomDetail?.hinhAnh}
                                alt={booking.roomDetail?.tenPhong}
                                className="w-1/3 object-cover"
                            />
                            <div className="p-4 flex-1">
                                <h2 className="text-lg font-semibold">{booking.roomDetail?.tenPhong}</h2>
                                <p className="text-gray-500">{booking.roomDetail?.moTa}</p>
                                <div className="mt-2">
                                    <p><strong>Ngày đến:</strong> {new Date(booking.ngayDen).toLocaleDateString()}</p>
                                    <p><strong>Ngày đi:</strong> {new Date(booking.ngayDi).toLocaleDateString()}</p>
                                    <p><strong>Số lượng khách:</strong> {booking.soLuongKhach}</p>
                                </div>
                                <p className="font-bold mt-2 text-right">${booking.roomDetail?.giaTien} / đêm</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
