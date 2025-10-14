import { Form, Input, Button, DatePicker, Select, Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { RegisterPayload, registerService } from "../../common/api/userService";
const { Title } = Typography;

export default function RegisterPage() {
    const navigate = useNavigate();

    const onFinish = async (values: any) => {
        try {
            const payload: RegisterPayload = {
                id: 0,
                name: values.name,
                email: values.email,
                password: values.password,
                phone: values.phone,
                birthday: values.birthday.format("YYYY-MM-DD"),
                gender: values.gender === "male",
                role: "USER",
            };

            await registerService(payload);
            toast.success("Đăng ký thành công!");
            navigate("/login");
        } catch (error) {
            console.error("Đăng ký thất bại:", error);
            toast.error("Đăng ký thất bại!");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-pink-100 via-white to-blue-100 px-4">
            <div className="bg-white/90 backdrop-blur-xl p-10 rounded-3xl shadow-2xl w-full max-w-2xl border border-gray-100">
                {/* Header */}
                <div className="text-center mb-8">
                    <Title level={2} className="!text-transparent !bg-clip-text bg-gradient-to-r from-pink-500 to-blue-600 !font-extrabold">
                        Đăng Ký Tài Khoản
                    </Title>
                    <p className="text-gray-500 text-sm mt-2">
                        Tạo tài khoản để bắt đầu hành trình cùng <span className="text-pink-500 font-medium">Airbnb</span> ✈️
                    </p>
                </div>

                {/* Form */}
                <Form
                    name="register-form"
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                    className="space-y-4"
                >
                    <Form.Item
                        label={<span className="font-medium text-gray-700">Họ tên</span>}
                        name="name"
                        rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
                    >
                        <Input
                            size="large"
                            placeholder="Nhập họ và tên"
                            className="rounded-xl border-gray-200 hover:border-pink-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all"
                        />
                    </Form.Item>

                    <Form.Item
                        label={<span className="font-medium text-gray-700">Email</span>}
                        name="email"
                        rules={[
                            { required: true, message: "Vui lòng nhập email!" },
                            { type: "email", message: "Email không hợp lệ!" },
                        ]}
                    >
                        <Input
                            size="large"
                            placeholder="example@email.com"
                            className="rounded-xl border-gray-200 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        />
                    </Form.Item>

                    <Form.Item
                        label={<span className="font-medium text-gray-700">Mật khẩu</span>}
                        name="password"
                        rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
                    >
                        <Input.Password
                            size="large"
                            placeholder="Nhập mật khẩu"
                            className="rounded-xl border-gray-200 hover:border-pink-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all"
                        />
                    </Form.Item>

                    <Form.Item
                        label={<span className="font-medium text-gray-700">Số điện thoại</span>}
                        name="phone"
                        rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
                    >
                        <Input
                            size="large"
                            placeholder="0123456789"
                            className="rounded-xl border-gray-200 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        />
                    </Form.Item>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Form.Item
                            label={<span className="font-medium text-gray-700">Ngày sinh</span>}
                            name="birthday"
                            rules={[{ required: true, message: "Vui lòng chọn ngày sinh!" }]}
                        >
                            <DatePicker
                                size="large"
                                format="YYYY-MM-DD"
                                className="w-full rounded-xl border-gray-200 hover:border-pink-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all"
                            />
                        </Form.Item>

                        <Form.Item
                            label={<span className="font-medium text-gray-700">Giới tính</span>}
                            name="gender"
                            rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
                        >
                            <Select
                                size="large"
                                placeholder="Chọn giới tính"
                                className="rounded-xl border-gray-200 hover:border-blue-400 focus:border-blue-500 transition-all"
                            >
                                <Select.Option value="male">Nam</Select.Option>
                                <Select.Option value="female">Nữ</Select.Option>
                            </Select>
                        </Form.Item>
                    </div>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            size="large"
                            className="!bg-gradient-to-r !from-pink-500 !to-blue-500 hover:opacity-90 !rounded-full !py-6 !text-lg !font-semibold !shadow-md hover:!shadow-lg transition-all duration-300"
                        >
                            Đăng ký ngay
                        </Button>

                        <div className="text-center mt-6 text-gray-600">
                            <span>Đã có tài khoản? </span>
                            <Link
                                to="/login"
                                className="text-pink-500 font-medium hover:underline hover:text-pink-600 transition-colors"
                            >
                                Đăng nhập ngay
                            </Link>
                        </div>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}
