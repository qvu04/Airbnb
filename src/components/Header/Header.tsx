import React from 'react';

const Header = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Video background */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        src="/public/myVideo.mp4"
        autoPlay
        muted
        loop
        playsInline
      />

      {/* Overlay (nếu muốn làm mờ video) */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/30 z-0" />

      {/* Content over video */}
      <header className="relative z-10 flex justify-between items-center px-10 pt-6 text-white">
        <div className="text-2xl font-bold text-pink-400 flex items-center gap-2">
          <i className=" text-3xl fab fa-airbnb"></i>
          airbnb
        </div>
        <nav className="flex gap-6 text-white font-medium">
          <a href="#" className="text-pink-400 hover:text-pink-400 transition duration-300">Home</a>
          <a href="#" className="hover:text-pink-400 transition duration-300">About</a>
          <a href="#" className="hover:text-pink-400 transition duration-300">Services</a>
          <a href="#" className="hover:text-pink-400 transition duration-300">Pricing</a>
          <a href="#" className="hover:text-pink-400 transition duration-300">Contact</a>
        </nav>
        <button className="w-10 h-10 rounded-full hover:border-white bg-white/20 flex items-center justify-center border-4 border-pink-400 cursor-pointer">
          <i className=" text-4xl fa fa-user-circle"></i>
        </button>
      </header>

      <div className="relative z-10 flex flex-col items-start justify-center h-full px-10 text-white">
        <div className="text-6xl font-extrabold text-pink-400 mb-2 flex items-center gap-2">
          <i className="fab fa-airbnb"></i>
          airbnb
        </div>
        <p className="text-2xl font-bold ">Belong anywhere</p>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-[90px] bg-white rounded-t-[40%] z-10" />

    </div>
  );
};

export default Header;
