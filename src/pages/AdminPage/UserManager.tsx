import React, { useEffect, useMemo, useState, useTransition } from 'react';
import { Input, Spin, Table, Button, Modal } from 'antd';
import { ColumnsType } from 'antd/es/table';
import debounce from 'lodash/debounce';
import { AddUser, addUserService, deleteUserService, getUserService, UserType } from '../../api/userService';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { RootState } from '../../main';



export default function UserManager() {
    const [users, setUsers] = useState<UserType[]>([]);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalUsers, setTotalUsers] = useState(0);
    const [keyword, setKeyword] = useState('');
    const [isPending, startTransition] = useTransition();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [addUserForm, setAddUserForm] = useState<AddUser>({
        id: 0,
        name: '',
        email: '',
        password: '',
        phone: '',
        birthday: '',
        gender: 'true',
        role: 'ADMIN'
    });
    // Gọi API lấy danh sách user
    const fetchUsers = async (page: number, size: number, search: string) => {
        try {
            const res = await getUserService(page, size, search);
            setUsers(res.data.content.data);
            setTotalUsers(res.data.content.totalRow);
        } catch (err) {
            console.error(err);
        }
    };

    // Thêm user
    const handleAddUser = async () => {
        try {
            await addUserService(addUserForm);
            setIsModalOpen(false);
            toast.success('Thêm người dùng thành công!');
            fetchUsers(pageIndex, pageSize, keyword);
        } catch (error) {
            console.error('Thêm người dùng thất bại', error);
        }
    };
    const handleDeleteUser = async (userId: number) => {
        try {
            await deleteUserService(userId);
            console.log('✌️userId --->', userId);
            toast.success('Xóa người dùng thành công');
            fetchUsers(pageIndex, pageSize, keyword)
        } catch (error) {
            console.log('✌️error --->', error);
            toast.error('Xóa người dùng thất bại');

        }
    }

    // Sự kiện thay đổi trang
    const handleTableChange = (pagination: any) => {
        setPageIndex(pagination.current);
        setPageSize(pagination.pageSize);
    };

    // Debounce search
    const debouncedSearch = useMemo(() => {
        return debounce((value: string) => {
            startTransition(() => {
                setPageIndex(1);
                fetchUsers(1, pageSize, value);
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

    // Modal form
    const renderAddUserModal = () => (
        <Modal title="Thêm người dùng" open={isModalOpen} onCancel={handleCancel} footer={null}>
            <div className="grid grid-cols-2 gap-4">
                <Input placeholder="Tên" value={addUserForm.name} onChange={(e) => setAddUserForm({ ...addUserForm, name: e.target.value })} />
                <Input placeholder="Email" value={addUserForm.email} onChange={(e) => setAddUserForm({ ...addUserForm, email: e.target.value })} />
                <Input placeholder="Số điện thoại" value={addUserForm.phone} onChange={(e) => setAddUserForm({ ...addUserForm, phone: e.target.value })} />
                <Input placeholder="Ngày sinh" type="date" value={addUserForm.birthday} onChange={(e) => setAddUserForm({ ...addUserForm, birthday: e.target.value })} />
                <Input placeholder="Mật khẩu" type="password" value={addUserForm.password} onChange={(e) => setAddUserForm({ ...addUserForm, password: e.target.value })} />
                <select value={addUserForm.gender} onChange={(e) => setAddUserForm({ ...addUserForm, gender: e.target.value })} className="border rounded px-2 py-1">
                    <option value="true">Nam</option>
                    <option value="false">Nữ</option>
                </select>
                <select value={addUserForm.role} onChange={(e) => setAddUserForm({ ...addUserForm, role: e.target.value })} className="border rounded px-2 py-1">
                    <option value="ADMIN">Admin</option>
                    <option value="USER">User</option>
                </select>
            </div>
            <div className="mt-6 flex justify-end gap-2">
                <Button type="primary" onClick={handleAddUser}>Thêm</Button>
                <Button onClick={handleCancel}>Hủy</Button>
            </div>
        </Modal>
    );

    const columns: ColumnsType<UserType> = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Phone', dataIndex: 'phone', key: 'phone' },
        { title: 'Birthday', dataIndex: 'birthday', key: 'birthday' },
        {
            title: 'Gender',
            dataIndex: 'gender',
            key: 'gender',
            render: (gender: boolean) => (gender ? 'Nam' : 'Nữ'),
        },
        { title: 'Role', dataIndex: 'role', key: 'role' },
        {
            title: 'Action',
            key: 'action',
            render: (_, record: UserType) => (
                <div className="flex gap-2">
                    <Button type="primary">Sửa</Button>
                    <Button onClick={() => {
                        handleDeleteUser(record.id);

                    }} danger>Xoá</Button>
                </div >
            ),
        }
    ];

    useEffect(() => {
        fetchUsers(pageIndex, pageSize, keyword);
    }, [pageIndex, pageSize]);

    return (
        <div className="p-4 bg-white rounded-xl shadow-md">
            <div className="mb-5 flex justify-between items-center">
                <Button type="primary" onClick={showModal}>Thêm người dùng</Button>
                <Input
                    placeholder="Tìm kiếm người dùng..."
                    value={keyword}
                    onChange={handleSearchChange}
                    className="w-full max-w-md"
                    suffix={isPending ? <Spin size="small" /> : null}
                />
            </div>

            <Table
                rowKey="id"
                dataSource={users}
                columns={columns}
                pagination={{
                    current: pageIndex,
                    pageSize: pageSize,
                    total: totalUsers,
                    showSizeChanger: true,
                }}
                onChange={handleTableChange}
            />

            {renderAddUserModal()}
        </div>
    );
}
