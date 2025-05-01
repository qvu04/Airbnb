import { useState, useMemo, useTransition, useEffect } from 'react';
import { AddLocation, addLocationService, deleteLocationService, getLocationSearchService, Location } from '../../api/locationService'
import debounce from 'lodash/debounce';
import React from 'react';
import { Button, Input, Spin, Table, Modal } from 'antd';
import { ColumnsType } from 'antd/es/table';
import toast from 'react-hot-toast';

export default function LocationManager() {
    const [locations, setLocations] = useState<Location[]>([]);
    const [totalLocations, setTotalLocations] = useState(0);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [keyword, setKeyword] = useState('');
    const [isPending, startTransition] = useTransition();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [addLocationForm, setAddLocationForm] = useState<AddLocation>({
        id: 0,
        tenViTri: '',
        tinhThanh: '',
        quocGia: '',
        hinhAnh: '',
    });
    const fetchLocation = async (page: number, size: number, search: string) => {
        try {
            const res = await getLocationSearchService(page, size, search);
            setLocations(res.data.content.data);
            setTotalLocations(res.data.content.totalRow);
        } catch (error) {
            console.log('✌️error --->', error);

        }
    }
    const handleAddLocation = async () => {
        try {
            await addLocationService(addLocationForm);
            setIsModalOpen(false);
            toast.success('Thêm vị trí thành công');
            fetchLocation(pageIndex, pageSize, keyword);
        } catch (error) {
            console.error('Thêm người dùng thất bại', error);
        }
    }
    const handleDeleteLocation = async (id: number) => {
        try {
            await deleteLocationService(id);
            toast.success('Xóa vị trí thành công');
            fetchLocation(pageIndex, pageSize, keyword);
        } catch (error) {

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
                fetchLocation(1, pageSize, value);
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
    const columns: ColumnsType<Location> = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Tên vị trí', dataIndex: 'tenViTri', key: 'tenViTri' },
        { title: 'Tỉnh thành', dataIndex: 'tinhThanh', key: 'tinhThanh' },
        { title: 'Quốc gia', dataIndex: 'quocGia', key: 'quocGia' },
        {
            title: 'Hình Ảnh',
            dataIndex: 'hinhAnh',
            key: 'hinhAnh',
            render: (text: string) => (
                <img src={text} alt="location" style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 6 }} />
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record: Location) => (
                <div className="flex gap-2">
                    <Button type="primary">Sửa</Button>
                    <Button onClick={() => {
                        handleDeleteLocation(record.id);
                    }} danger>Xoá</Button>
                </div >
            ),
        }
    ];
    const renderAddLocationModal = () => (
        <Modal title="Thêm người dùng" open={isModalOpen} onCancel={handleCancel} footer={null}>
            <div className="grid grid-cols-2 gap-4">
                <Input placeholder="Tên vị trí" value={addLocationForm.tenViTri} onChange={(e) => setAddLocationForm({ ...addLocationForm, tenViTri: e.target.value })} />
                <Input placeholder="Tỉnh thành" value={addLocationForm.tinhThanh} onChange={(e) => setAddLocationForm({ ...addLocationForm, tinhThanh: e.target.value })} />
                <Input placeholder="Quốc gia" value={addLocationForm.quocGia} onChange={(e) => setAddLocationForm({ ...addLocationForm, quocGia: e.target.value })} />
                <Input placeholder="Hình ảnh" value={addLocationForm.hinhAnh} onChange={(e) => setAddLocationForm({ ...addLocationForm, hinhAnh: e.target.value })} />
            </div>
            <div className="mt-6 flex justify-end gap-2">
                <Button type="primary" onClick={handleAddLocation}>Thêm</Button>
                <Button onClick={handleCancel}>Hủy</Button>
            </div>
        </Modal>
    );
    useEffect(() => {
        fetchLocation(pageIndex, pageSize, keyword);
    }, [pageIndex, pageSize]);
    return (
        <div className="p-4 bg-white rounded-xl shadow-md">
            <div className="mb-5 flex justify-between items-center">
                <Button type="primary" onClick={showModal}>Thêm ví trí</Button>
                <Input
                    placeholder="Tìm kiếm vị trí..."
                    value={keyword}
                    onChange={handleSearchChange}
                    className="w-full max-w-md"
                    suffix={isPending ? <Spin size="small" /> : null}
                />
            </div>

            <Table
                rowKey="id"
                dataSource={locations}
                columns={columns}
                pagination={{
                    current: pageIndex,
                    pageSize: pageSize,
                    total: totalLocations,
                    showSizeChanger: true,
                }}
                onChange={handleTableChange}
            />
            {renderAddLocationModal()}
        </div>
    );
}
