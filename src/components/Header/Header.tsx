import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { RootState } from "../../main";
import { setUserLogoutAction } from "../../pages/LoginPage/redux/userSlice";

const Header = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useSelector((state: RootState) => state.userSlice);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    navigate("/login");
    dispatch(setUserLogoutAction());
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative w-full h-[500px] overflow-hidden">
      {/* Video Background */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        src="/public/myVideo.mp4"
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="absolute top-0 left-0 w-full h-full bg-black/30 z-10" />

      {/* Header (Sticky) */}
      <header
        className={`fixed top-0 left-0 w-full z-30 flex justify-around items-center px-10 py-4 transition-all duration-300 ${isScrolled ? "bg-white text-black shadow" : "text-white"
          }`}
      >
        <div className="text-2xl font-bold text-pink-400 flex items-center gap-2">
          <i className="text-3xl fab fa-airbnb"></i>
          airbnb
        </div>

        <nav className="flex gap-6 font-medium">
          <a href="/" className="text-pink-400 hover:text-pink-400 transition duration-300">
            Home
          </a>
          <a href="#" className="hover:text-pink-400 transition duration-300">About</a>
          <a href="#" className="hover:text-pink-400 transition duration-300">Services</a>
          <a href="#" className="hover:text-pink-400 transition duration-300">Pricing</a>
          <a href="#" className="hover:text-pink-400 transition duration-300">Contact</a>
        </nav>

        <div className="relative">
          <button
            onClick={() => setOpenMenu(!openMenu)}
            className="w-12 h-12 rounded-full hover:border-white bg-white/20 flex items-center justify-center border-4 border-pink-400 cursor-pointer"
          >
            <i className="text-4xl fa fa-user-circle"></i>
          </button>

          <div
            className={`z-50 absolute right-0 mt-2 w-52 bg-white text-gray-800 rounded-lg shadow-lg py-2 transition-all duration-300 ease-out transform origin-top ${openMenu ? "opacity-100 scale-100 animate-slide-down" : "opacity-0 scale-95 pointer-events-none"
              }`}
          >
            {user ? (
              <div className="text-sm">
                <div className="px-4 py-2 border-b">
                  <div className="font-semibold">{user.name}</div>
                  <div className="text-xs text-gray-500">{user.email}</div>
                </div>
                <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-100 transition duration-200">Dashboard</Link>
                <Link to="/settings" className="block px-4 py-2 hover:bg-gray-100 transition duration-200">Settings</Link>
                <Link to="/earnings" className="block px-4 py-2 hover:bg-gray-100 transition duration-200">Earnings</Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 transition duration-200"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div>
                <Link to="/login" className="block px-4 py-2 hover:bg-gray-100 transition duration-200">Đăng nhập</Link>
                <Link to="/register" className="block px-4 py-2 hover:bg-gray-100 transition duration-200">Đăng ký</Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-start justify-center h-full px-10 text-white">
        <div className="text-6xl font-extrabold text-pink-400 mb-2 flex items-center gap-2">
          <i className="fab fa-airbnb"></i>
          airbnb
        </div>
        <p className="text-2xl font-bold">Belong anywhere</p>
      </div>

      {/* White Curve Bottom */}
      <div className="absolute bottom-0 left-0 w-full h-[90px] bg-white rounded-t-[40%] z-10" />
    </div>
  );
};

export default Header;
