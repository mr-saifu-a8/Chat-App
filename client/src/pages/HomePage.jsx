// import React, { useState } from "react";
// import ChatContainer from "../components/ChatContainer";
// import Sidebar from "../components/Sidebar";
// import RightSidebar from "../components/RightSidebar";
// import bgImage from "../assets/bgImage.svg";

// const HomePage = () => {

//   const [selectedUser, setSelectedUser] = useState(false)

//   return (
//     <div
//       className="w-full h-screen flex items-center justify-center p-6 bg-gray-950"
//       style={{
//         backgroundImage: `url(${bgImage})`,
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//       }}
//     >
//       <div
//         className={`w-full max-w-[1400px] h-full
//         grid grid-cols-[260px_1fr_300px]
//         bg-white/5 backdrop-blur-xl
//         border border-white/10
//         rounded-2xl
//         shadow-[0_20px_60px_rgba(0,0,0,0.7)]
//         overflow-hidden ${selectedUser ? "md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]" : "md:grid-cols-2"}`}
//       >
//         <Sidebar
//           selectedUser={selectedUser}
//           setSelectedUser={setSelectedUser}
//         />
//         <ChatContainer
//           selectedUser={selectedUser}
//           setSelectedUser={setSelectedUser}
//         />
//         <RightSidebar
//           selectedUser={selectedUser}
//           setSelectedUser={setSelectedUser}
//         />
//       </div>
//     </div>
//   );
// };

// export default HomePage;

import React, { useState } from "react";
import ChatContainer from "../components/ChatContainer";
import Sidebar from "../components/Sidebar";
import RightSidebar from "../components/RightSidebar";
import bgImage from "../assets/bgImage.svg";

const HomePage = () => {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div
      className="w-screen h-screen flex items-center justify-center"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Outer shell — full screen on mobile, card on desktop */}
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
        {/* SIDEBAR — always rendered, CSS controls visibility */}
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
          <Sidebar
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
          />
        </div>

        {/* CHAT CONTAINER — always rendered */}
        <div
          className={`
          flex-1 h-full min-w-0
          transition-all duration-300
          ${selectedUser ? "flex" : "hidden md:flex"}
        `}
        >
          <ChatContainer
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
          />
        </div>

        {/* RIGHT SIDEBAR — only when user selected, desktop only */}
        {selectedUser && (
          <div className="hidden lg:flex h-full w-[260px] xl:w-[300px] shrink-0 border-l border-white/8">
            <RightSidebar
              selectedUser={selectedUser}
              setSelectedUser={setSelectedUser}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;