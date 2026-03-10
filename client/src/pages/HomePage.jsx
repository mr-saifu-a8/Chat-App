import React, { useState } from "react";
import ChatContainer from "../components/ChatContainer";
import Sidebar from "../components/Sidebar";
import RightSidebar from "../components/RightSidebar";
import bgImage from "../assets/bgImage.svg";

const HomePage = () => {

  const [selectedUser, setSelectedUser] = useState(false)

  return (
    <div
      className="w-full h-screen flex items-center justify-center p-6 bg-gray-950"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className={`w-full max-w-[1400px] h-full
        grid grid-cols-[260px_1fr_300px]
        bg-white/5 backdrop-blur-xl
        border border-white/10
        rounded-2xl
        shadow-[0_20px_60px_rgba(0,0,0,0.7)]
        overflow-hidden ${selectedUser ? 'md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]' : 'md:grid-cols-2'}`}
      >
        <Sidebar />
        <ChatContainer />
        <RightSidebar />
      </div>
    </div>
  );
};

export default HomePage;