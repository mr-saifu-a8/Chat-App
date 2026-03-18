import React, { useState, useContext } from "react";
import ChatContainer from "../components/chat/ChatContainer";
import Sidebar from "../components/sidebar/Sidebar";
import RightSidebar from "../components/RightSidebar";
import bgImage from "../assets/bgImage.svg";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";

const HomePage = () => {
  const { selectedUser } = useContext(ChatContext);

  return (
    <div
      className="w-screen h-screen flex items-center justify-center"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className="
        w-full h-full
        md:w-[calc(100%-48px)] md:h-[calc(100%-48px)] md:max-w-[1400px]
        flex overflow-hidden
        md:rounded-2xl
        border-0 md:border md:border-white/10
        bg-[#0d0b1e]/80 backdrop-blur-2xl
        shadow-[0_32px_80px_rgba(0,0,0,0.8)]
      "
      >
        {/* SIDEBAR */}
        <div
          className={`
          h-full shrink-0 border-r border-white/8
          transition-all duration-300
          ${
            selectedUser
              ? "hidden md:flex md:w-[260px] lg:w-[300px]"
              : "flex w-full md:w-[260px] lg:w-[300px]"
          }
        `}
        >
          <Sidebar />
        </div>

        {/* CHAT CONTAINER */}
        <div
          className={`
          flex-1 h-full min-w-0
          transition-all duration-300
          ${selectedUser ? "flex" : "hidden md:flex"}
        `}
        >
          <ChatContainer />
        </div>

        {/* RIGHT SIDEBAR */}
        {selectedUser && (
          <div className="hidden lg:flex h-full w-[260px] xl:w-[300px] shrink-0 border-l border-white/8">
            <RightSidebar />
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;