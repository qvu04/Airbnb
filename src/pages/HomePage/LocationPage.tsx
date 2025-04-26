import React, { useEffect, useState } from 'react';
import { getLocationService } from '../../api/locationService';
import { useNavigate } from 'react-router';
import { AutoComplete, DatePicker, InputNumber, Button, Space } from 'antd';
import type { InputNumberProps } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;

interface Location {
    id: number;
    tenViTri: string;
    tinhThanh: string;
    quocGia: string;
    hinhAnh: string;
}

export default function LocationPage() {
    const [locations, setLocations] = useState<Location[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<string>('');
    const [guestCount, setGuestCount] = useState<number>(1);
    const navigate = useNavigate();

    const fetchLocation = async () => {
        try {
            const res = await getLocationService();
            const data: Location[] = res.data.content;
            setLocations(data);
        } catch (error) {
            console.log('✌️error --->', error);
        }
    };

    const formatLocationName = (name: string) => {
        return name
            .toLowerCase()
            .normalize('NFD')  // Tách dấu ra
            .replace(/[\u0300-\u036f]/g, '')  // Xóa dấu
            .replace(/\s+/g, '-')  // Thay khoảng trắng bằng -
            .replace(/[^a-zA-Z0-9-]/g, '');  // Xóa ký tự đặc biệt
    };

    const onChangeGuest: InputNumberProps['onChange'] = (value) => {
        setGuestCount(Number(value));
    };

    useEffect(() => {
        fetchLocation();
    }, []);

    return (
        <div className="flex items-center justify-between rounded-full border border-gray-300 px-6 py-4 shadow-md bg-white w-full max-w-5xl mx-auto mb-6 relative">
            {/* Location */}
            <div className="flex flex-col flex-1 items-center border-r border-gray-300 px-4">
                <div className="text-sm font-semibold mb-1">Địa điểm</div>
                <AutoComplete
                    options={locations.map((loc) => ({
                        value: loc.tenViTri,
                        label: (
                            <div key={loc.id} className="flex items-center space-x-2">
                                <img
                                    src={loc.hinhAnh}
                                    alt=""
                                    className="w-8 h-8 rounded-md object-cover"
                                />
                                <span>{loc.tenViTri}</span>
                            </div>
                        ),
                    }))}
                    placeholder="Bạn sắp đi đâu?"
                    className="w-full text-center"
                    bordered={false}
                    onChange={(value: string) => setSelectedLocation(value)}
                />
            </div>

            {/* Calendar */}
            <div className="flex flex-col flex-1 items-center border-r border-gray-300 px-4">
                <div className="text-sm font-semibold mb-1">Ngày</div>
                <Space direction="vertical" size={0}>
                    <RangePicker bordered={false} className="text-center" />
                </Space>
            </div>

            {/* Guest */}
            <div className="flex flex-col flex-1 items-center px-4">
                <div className="text-sm font-semibold mb-1">Khách</div>
                <InputNumber
                    min={1}
                    max={100}
                    value={guestCount}
                    onChange={onChangeGuest}
                    className="rounded-full text-center w-24"
                    bordered={false}
                />
            </div>

            {/* Search button */}
            <Button
                type="primary"
                shape="circle"
                icon={<SearchOutlined />}
                size="large"
                onClick={() => {
                    if (selectedLocation) {
                        const formattedLocation = formatLocationName(selectedLocation);
                        navigate(`/rooms/${formattedLocation}`);
                    }
                }}
                className="bg-pink-500 ml-4 hover:bg-pink-600 border-none text-white"
            />
        </div>
    );
}
