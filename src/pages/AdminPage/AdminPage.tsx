import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../main'
import { useNavigate } from 'react-router';
import UserManager from './UserManager';
import LocationManager from './LocationManager';
import {
    FileOutlined,
    DesktopOutlined,
    UserOutlined,
    SmileFilled
} from '@ant-design/icons';
import { Avatar, Layout, Menu } from 'antd';
import { useDispatch } from 'react-redux';
import { setUserLogoutAction } from '../LoginPage/redux/userSlice';
import BookingManager from './BookingManager';
import RoomManager from './RoomManager';
const { Header, Sider, Content } = Layout;

export default function AdminPage() {
    const { user } = useSelector((state: RootState) => state.userSlice);
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    const [selectedKey, setSelectedKey] = useState('user');
    const dispatch = useDispatch();
    const checkAdmin = () => {
        if (user?.role === "ADMIN") {
            return navigate("/admin")
        } else {
            return navigate("/");
        }

    }
    const handleLogout = () => {
        dispatch(setUserLogoutAction());
        navigate("/login");
    }
    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    const handleMenuClick = ({ key }: any) => {
        setSelectedKey(key);
    };
    const renderContent = () => {
        switch (selectedKey) {
            case 'users':
                return <UserManager />;
            case 'locations':
                return <LocationManager />;
            case 'rooms':
                return <RoomManager />;
            case 'booking':
                return <BookingManager />;
        }
    };
    useEffect(() => {
        checkAdmin();
    }, [user, navigate]);



    const menuItems = [
        { key: 'users', icon: <UserOutlined />, label: 'UsersManager' },
        {
            key: 'locations',
            icon: <FileOutlined />,
            label: 'LocationManager',
        },
        { key: 'rooms', icon: <DesktopOutlined />, label: 'RoomManager' },
        { key: 'booking', icon: <SmileFilled />, label: 'BookingManager' }
    ];

    const userMenu = (
        <Menu>
            <Menu.Item key="logout">
                <a href="/logout" className="text-red-500 font-medium">Đăng xuất</a>
            </Menu.Item>
        </Menu>
    );

    return (
        <Layout className="min-h-screen h-full bg-[#e672b1] ">
            <Sider collapsible collapsed={collapsed} onCollapse={toggleCollapsed} className="bg-[#001529] h-screen">
                <div className="text-2xl font-bold text-pink-400 flex items-center p-10 gap-2">
                    <i className="text-3xl fab fa-airbnb"></i>
                    airbnb
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[selectedKey]}
                    onClick={handleMenuClick}
                    items={menuItems}
                />
            </Sider>

            <Layout className="bg-gray-100 flex-1">
                <Header className="bg-white flex justify-end items-center p-4 shadow-md">
                    <div className="flex items-center">
                        <Avatar size="large" className="bg-red-300 text-black font-bold">{user.name}</Avatar>
                        <button onClick={handleLogout} className="ml-2 rounded text-[#e672b1] font-medium cursor-pointer ">Đăng xuất</button>
                    </div>
                </Header>
                <div className='flex items-center justify-center font-bold text-2xl gap-2'>Chào mừng bạn đến với trang ADMIN
                    <i className="fab fa-angellist"></i>
                </div>
                <Content className="p-6 bg-white shadow-md min-h-screen">
                    {renderContent()}
                </Content>
            </Layout>
        </Layout>
    );
};

