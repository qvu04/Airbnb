import React, { useEffect } from 'react'
import { useState, useTransition, useMemo } from 'react';
import { addBookingService, BookedRooms, deleteBookingService, getBookingService } from '../../api/bookroomService';
import debounce from 'lodash/debounce';
import { Button, Input, Spin, Table, Modal, InputNumber, DatePicker } from 'antd';
import { ColumnsType } from 'antd/es/table';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';

export default function BookingManager() {
    const [allBooking, setAllBooking] = useState<BookedRooms[]>([]);
    const [filteredBooking, setFilteredBooking] = useState<BookedRooms[]>([]);
    const [totalBooking, setTotalBooking] = useState(0);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [keyword, setKeyword] = useState('');
    const [isPending, startTransition] = useTransition();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [addBookingForm, setAddBookingForm] = useState<BookedRooms>({
        id: 0,
        maPhong: 0,
        maNguoiDung: 0,
        ngayDen: '',
        ngayDi: '',
        soLuongKhach: 0,
    })


    const fetchBooking = async () => {
        try {
            const res = await getBookingService();
            const allData = res.data.content;
            setAllBooking(allData);
            setFilteredBooking(allData);
            setTotalBooking(allData.length);
        } catch (error) {
            console.log('✌️error --->', error);
        }
    };
    const hanldeAddBooking = async () => {
        try {
            await addBookingService(addBookingForm);
            setIsModalOpen(false);
            toast.success('Thêm đặt phòng thành công');
            fetchBooking();
        } catch (error) {
            console.log('✌️error --->', error);

        }

    }
    const handleDeleteBooking = async (id: number) => {
        try {
            await deleteBookingService(id);
            toast.success('Xóa đặt phòng thành công');
            fetchBooking();
        } catch (error) {
            console.log('✌️error --->', error);
            toast.error('Xóa đặt phòng thất bại');
        }
    }
    const debouncedSearch = useMemo(() => {
        return debounce((value: string) => {
            startTransition(() => {
                const filtered = allBooking.filter(item =>
                    item.maPhong.toString().includes(value) ||
                    item.maNguoiDung.toString().includes(value)
                );
                setFilteredBooking(filtered);
                setPageIndex(1);
                setTotalBooking(filtered.length);
            });
        }, 500);
    }, [allBooking]);

    const paginatedBooking = useMemo(() => {
        const start = (pageIndex - 1) * pageSize;
        return filteredBooking.slice(start, start + pageSize);
    }, [filteredBooking, pageIndex, pageSize]);

    const handleTableChange = (pagination: any) => {
        setPageIndex(pagination.current);
        setPageSize(pagination.pageSize);
    };
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const trimValue = value.trim();
        setKeyword(value);
        debouncedSearch(trimValue);
    };

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const columns: ColumnsType<BookedRooms> = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Mã phòng', dataIndex: 'maPhong', key: 'maPhong' },
        { title: 'Ngày đến', dataIndex: 'ngayDen', key: 'ngayDen' },
        { title: 'Ngày đi', dataIndex: 'ngayDi', key: 'ngayDi' },
        { title: 'Số lượng khách', dataIndex: 'soLuongKhach', key: 'soLuongKhach' },
        { title: 'Mã người dùng', dataIndex: 'maNguoiDung', key: 'maNguoiDung' },

        {
            title: 'Action',
            key: 'action',
            render: (_, record: BookedRooms) => (
                <div className="flex gap-2">
                    <Button type="primary">Sửa</Button>
                    <Button onClick={() => {
                        handleDeleteBooking(record.id);
                    }} danger>Xoá</Button>
                </div >
            ),
        }
    ];
    const renderAddBookingModal = () => (
        <Modal title="Thêm đặt phòng" open={isModalOpen} onCancel={handleCancel} footer={null}>
            <div className="grid grid-cols-2 gap-4">
                <InputNumber placeholder="Mã người dùng" value={addBookingForm.maNguoiDung} onChange={(value) => setAddBookingForm({ ...addBookingForm, maNguoiDung: value ?? 0 })} className="w-full" />
                <InputNumber placeholder="Mã Phòng" value={addBookingForm.maPhong} onChange={(value) => setAddBookingForm({ ...addBookingForm, maPhong: value ?? 0 })} className="w-full" />
                <DatePicker
                    placeholder="Ngày đến"
                    className="w-full"
                    value={addBookingForm.ngayDen ? dayjs(addBookingForm.ngayDen) : null}
                    onChange={(date) => setAddBookingForm({ ...addBookingForm, ngayDen: date ? date.format('YYYY-MM-DD') : '' })}
                />

                <DatePicker
                    placeholder="Ngày đi"
                    className="w-full"
                    value={addBookingForm.ngayDi ? dayjs(addBookingForm.ngayDi) : null}
                    onChange={(date) => setAddBookingForm({ ...addBookingForm, ngayDi: date ? date.format('YYYY-MM-DD') : '' })}
                />

                <InputNumber placeholder="Số lượng khách" value={addBookingForm.soLuongKhach} onChange={(value) => setAddBookingForm({ ...addBookingForm, soLuongKhach: value ?? 0 })} className="w-full" />

            </div>
            <div className="mt-6 flex justify-end gap-2">
                <Button type="primary" onClick={hanldeAddBooking}>Thêm đặt phòng</Button>
                <Button onClick={handleCancel}>Hủy</Button>
            </div>
        </Modal>
    );
    useEffect(() => {
        fetchBooking();
    }, [])
    return (
        <div className="p-4 bg-white rounded-xl shadow-md">
            <div className="mb-5 flex justify-between items-center">
                <Button type="primary" onClick={showModal}>Thêm đặt phòng</Button>
                <Input
                    placeholder="Tìm kiếm đặt phòng..."
                    value={keyword}
                    onChange={handleSearchChange}
                    className="w-full max-w-md"
                    suffix={isPending ? <Spin size="small" /> : null}
                />
            </div>

            <Table
                rowKey="id"
                dataSource={paginatedBooking}
                columns={columns}
                pagination={{
                    current: pageIndex,
                    pageSize: pageSize,
                    total: totalBooking,
                    showSizeChanger: true,
                }}
                onChange={handleTableChange}
            />
            {renderAddBookingModal()}
        </div>

    );
}
