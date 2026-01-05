import { Form, Input, Button, Typography, Checkbox } from "antd";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { setUserLoginAction } from "./redux/userSlice";
import { AppDispatch } from "../../main";
import { LoginPayload, loginService } from "../../common/api/userService";
import { https } from "../../common/api/config";

const { Text, Title } = Typography;

export default function LoginPage() {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.redirectTo || "/";
    const fetchUserLogin = async (formValues: { taiKhoan: string; matKhau: string }) => {
        try {
            const payload: LoginPayload = {
                email: formValues.taiKhoan,
                password: formValues.matKhau,
            };

            const res = await loginService(payload);
            const { user, token } = res.data.content;
            const data = { ...user, token };
            dispatch(setUserLoginAction(data));
            localStorage.setItem("user", JSON.stringify({ ...user, token }));
            https.defaults.headers.common["token"] = token;
            toast.success("Đăng nhập thành công!");
            navigate(from, { replace: true });
        } catch (error) {
            console.error("Đăng nhập thất bại:", error);
            toast.error("Đăng nhập thất bại!");
        }
    };

    const onFinish = (values: { taiKhoan: string; matKhau: string }) => {
        fetchUserLogin(values);
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-pink-100 via-white to-blue-100 px-4">
            <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-2xl w-full max-w-md border border-gray-100">
                <Title level={3} className="!text-transparent !bg-clip-text bg-gradient-to-r from-pink-500 to-blue-600 !font-extrabold text-center">
                    Chào mừng trở lại! 👋
                </Title>
                <p className="text-center text-gray-500 mb-8 text-sm">
                    Đăng nhập để tiếp tục khám phá cùng <span className="text-pink-500 font-medium">Airbnb</span>
                </p>

                <Form
                    name="login-form"
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Tài khoản"
                        name="taiKhoan"
                        rules={[{ required: true, message: "Vui lòng nhập tài khoản!" }]}
                    >
                        <Input size="large" placeholder="example@email.com" className="rounded-xl" />
                    </Form.Item>

                    <Form.Item
                        label="Mật khẩu"
                        name="matKhau"
                        rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
                    >
                        <Input.Password size="large" placeholder="••••••••" className="rounded-xl" />
                    </Form.Item>

                    <div className="flex justify-between items-center mb-4">
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                            <Checkbox>Ghi nhớ đăng nhập</Checkbox>
                        </Form.Item>
                        <a href="#" className="text-pink-500 hover:underline text-sm">
                            Quên mật khẩu?
                        </a>
                    </div>

                    <Form.Item>
                        <Button
                            htmlType="submit"
                            size="large"
                            block
                            className="bg-gradient-to-r from-pink-500 to-blue-500 text-white font-medium rounded-full shadow-md hover:opacity-90 transition-all duration-300"
                        >
                            Đăng nhập ngay
                        </Button>
                    </Form.Item>

                    <div className="text-center mt-4 text-sm">
                        <Text>Bạn chưa có tài khoản? </Text>
                        <Link
                            to="/register"
                            className="text-pink-500 hover:underline font-medium"
                        >
                            Đăng ký ngay
                        </Link>
                    </div>
                </Form>
            </div>
        </div>
    );
}
