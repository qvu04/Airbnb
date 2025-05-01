import React, { useEffect } from 'react'
import { useState, useTransition, useMemo } from 'react';
import { addRoomService, getRoomSearchService, RoomDetailType } from '../../api/roomService';
import { Location } from '../../api/locationService';
import debounce from 'lodash/debounce';
import { Button, Input, Spin, Table, Modal, InputNumber, Checkbox } from 'antd';
import { ColumnsType } from 'antd/es/table';
import toast from 'react-hot-toast';


export default function RoomManager() {
    const [rooms, setRooms] = useState<RoomDetailType[]>([]);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalRooms, setTotalRooms] = useState(0);
    const [keyword, setKeyword] = useState('');
    const [isPending, startTransition] = useTransition();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [addRoomForm, setAddRoomForm] = useState<RoomDetailType>({
        id: 0,
        tenPhong: '',
        khach: 0,
        phongNgu: 0,
        giuong: 0,
        phongTam: 0,
        moTa: '',
        giaTien: 0,
        mayGiat: false,
        banLa: false,
        tivi: false,
        dieuHoa: false,
        wifi: false,
        bep: false,
        doXe: false,
        hoBoi: false,
        banUi: false,
        hinhAnh: '',
    })

    const fetchRoom = async (page: number, size: number, search: string) => {
        try {
            const res = await getRoomSearchService(page, size, search);
            setRooms(res.data.content.data);
            setTotalRooms(res.data.content.totalRow);
        } catch (error) {
            console.log('✌️error --->', error);

        }
    }
    const handleAddRooms = async () => {
        try {
            await addRoomService(addRoomForm);
            setIsModalOpen(false);
            toast.success('Thêm phòng thành công!');
            fetchRoom(pageIndex, pageSize, keyword);
        } catch (error) {
            console.log('✌️error --->', error);

        }
    }
    const handleTableChange = (pagination: any) => {
        setPageIndex(pagination.current);
        setPageSize(pagination.pageSize);
    };

    // Debounce search
    const debouncedSearch = useMemo(() => {
        return debounce((value: string) => {
            startTransition(() => {
                setPageIndex(1);
                fetchRoom(1, pageSize, value);
            });
        }, 500);
    }, [pageSize]);
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
    const columns: ColumnsType<RoomDetailType> = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Tên phòng', dataIndex: 'tenPhong', key: 'tenPhong' },
        { title: 'Khách', dataIndex: 'khach', key: 'khach' },
        { title: 'Phòng ngủ', dataIndex: 'phongNgu', key: 'phongNgu' },
        { title: 'Giường', dataIndex: 'giuong', key: 'giuong' },
        { title: 'Mô tả', dataIndex: 'moTa', key: 'moTa' },
        { title: 'Giá tiền', dataIndex: 'giaTien', key: 'giaTien' },
        {
            title: 'Hình Ảnh',
            dataIndex: 'hinhAnh',
            key: 'hinhAnh',
            render: (text: string) => (
                <img src={text} alt="room" style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 6 }} />
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record: RoomDetailType) => (
                <div className="flex gap-2">
                    <Button type="primary">Sửa</Button>
                    <Button onClick={() => {

                    }} danger>Xoá</Button>
                </div >
            ),
        }
    ];
    const renderAddRoomModal = () => (
        <Modal title="Thêm người dùng" open={isModalOpen} onCancel={handleCancel} footer={null}>
            <div className="grid grid-cols-2 gap-4">
                <Input placeholder="Tên phòng" value={addRoomForm.tenPhong} onChange={(e) => setAddRoomForm({ ...addRoomForm, tenPhong: e.target.value })} />
                <InputNumber placeholder="Số lượng khách" value={addRoomForm.khach} onChange={(value) => setAddRoomForm({ ...addRoomForm, khach: value ?? 0 })} className="w-full" />
                <InputNumber placeholder="Số lượng phòng ngủ" value={addRoomForm.phongNgu} onChange={(value) => setAddRoomForm({ ...addRoomForm, phongNgu: value ?? 0 })} className="w-full" />
                <InputNumber placeholder="Số lượng giường" value={addRoomForm.giuong} onChange={(value) => setAddRoomForm({ ...addRoomForm, giuong: value ?? 0 })} className="w-full" />
                <InputNumber placeholder="Số lượng phòng tắm" value={addRoomForm.phongTam} onChange={(value) => setAddRoomForm({ ...addRoomForm, phongTam: value ?? 0 })} className="w-full" />
                <Input placeholder="Mô tả" value={addRoomForm.moTa} onChange={(e) => setAddRoomForm({ ...addRoomForm, moTa: e.target.value })} />
                <InputNumber placeholder="Giá tiền" value={addRoomForm.giaTien} onChange={(value) => setAddRoomForm({ ...addRoomForm, giaTien: value ?? 0 })} className="w-full" />
                <Checkbox
                    checked={addRoomForm.mayGiat}
                    onChange={(e) => setAddRoomForm({ ...addRoomForm, mayGiat: e.target.checked })}
                >
                    Máy giặt
                </Checkbox>
                <Checkbox
                    checked={addRoomForm.banLa}
                    onChange={(e) => setAddRoomForm({ ...addRoomForm, banLa: e.target.checked })}
                >
                    Bàn là
                </Checkbox>
                <Checkbox
                    checked={addRoomForm.tivi}
                    onChange={(e) => setAddRoomForm({ ...addRoomForm, tivi: e.target.checked })}
                >
                    Tivi
                </Checkbox>
                <Checkbox
                    checked={addRoomForm.dieuHoa}
                    onChange={(e) => setAddRoomForm({ ...addRoomForm, dieuHoa: e.target.checked })}
                >
                    Điều hoà
                </Checkbox>
                <Checkbox
                    checked={addRoomForm.wifi}
                    onChange={(e) => setAddRoomForm({ ...addRoomForm, wifi: e.target.checked })}
                >
                    Wifi
                </Checkbox>
                <Checkbox
                    checked={addRoomForm.bep}
                    onChange={(e) => setAddRoomForm({ ...addRoomForm, bep: e.target.checked })}
                >
                    Bếp
                </Checkbox>
                <Checkbox
                    checked={addRoomForm.doXe}
                    onChange={(e) => setAddRoomForm({ ...addRoomForm, doXe: e.target.checked })}
                >
                    Đỗ xe
                </Checkbox>
                <Checkbox
                    checked={addRoomForm.hoBoi}
                    onChange={(e) => setAddRoomForm({ ...addRoomForm, hoBoi: e.target.checked })}
                >
                    Hồ bơi
                </Checkbox>
                <Checkbox
                    checked={addRoomForm.banUi}
                    onChange={(e) => setAddRoomForm({ ...addRoomForm, banUi: e.target.checked })}
                >
                    Bàn ủi
                </Checkbox>
                <Input placeholder="Hình ảnh" value={addRoomForm.hinhAnh} onChange={(e) => setAddRoomForm({ ...addRoomForm, hinhAnh: e.target.value })} />

            </div>
            <div className="mt-6 flex justify-end gap-2">
                <Button type="primary" onClick={handleAddRooms}>Thêm</Button>
                <Button onClick={handleCancel}>Hủy</Button>
            </div>
        </Modal>
    );
    useEffect(() => {
        fetchRoom(pageIndex, pageSize, keyword);
    }, [pageIndex, pageSize])
    return (
        <div className="p-4 bg-white rounded-xl shadow-md">
            <div className="mb-5 flex justify-between items-center">
                <Button type="primary" onClick={showModal}>Thêm phòng thuê</Button>
                <Input
                    placeholder="Tìm kiếm phòng..."
                    value={keyword}
                    onChange={handleSearchChange}
                    className="w-full max-w-md"
                    suffix={isPending ? <Spin size="small" /> : null}
                />
            </div>

            <Table
                rowKey="id"
                dataSource={rooms}
                columns={columns}
                pagination={{
                    current: pageIndex,
                    pageSize: pageSize,
                    total: totalRooms,
                    showSizeChanger: true,
                }}
                onChange={handleTableChange}
            />
            {renderAddRoomModal()}
        </div>
    );
}
