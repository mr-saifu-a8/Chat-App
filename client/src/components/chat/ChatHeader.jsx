// import React, { useContext } from "react";
// import assets from "../../assets/assets";
// import { AuthContext } from "../../context/AuthContext";
// import { ChatContext } from "../../context/ChatContext";

// const ChatHeader = () => {
//   const { selectedUser, setSelectedUser, isTyping } = useContext(ChatContext);
//   const { onlineUsers } = useContext(AuthContext);

//   const isOnline = onlineUsers.some(
//     (id) => id?.toString() === selectedUser?._id?.toString(),
//   );

//   return (
//     <div className="shrink-0 flex items-center gap-3 px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
//       <button
//         onClick={() => setSelectedUser(null)}
//         className="md:hidden p-1.5 -ml-1 rounded-lg hover:bg-white/8 transition-colors"
//       >
//         <img src={assets.arrow_icon} alt="back" className="w-5 h-5" />
//       </button>

//       <div className="relative shrink-0">
//         <img
//           src={selectedUser?.profilePic || assets.avatar_icon}
//           alt={selectedUser?.fullName}
//           className="w-9 h-9 rounded-full object-cover ring-2 ring-white/10"
//         />
//         {isOnline && (
//           <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0d0b1e]" />
//         )}
//       </div>

//       <div className="flex-1 min-w-0">
//         <p className="text-sm font-semibold text-white truncate leading-tight">
//           {selectedUser?.fullName}
//         </p>
//         {isTyping ? (
//           <p className="text-xs text-emerald-400/80 animate-pulse">typing...</p>
//         ) : (
//           <p
//             className={`text-xs ${isOnline ? "text-emerald-400/70" : "text-white/25"}`}
//           >
//             {isOnline ? "Online" : "Offline"}
//           </p>
//         )}
//       </div>

//       <div className="flex items-center gap-0.5">
//         <button
//           onClick={() => {}}
//           title="Audio Call"
//           className="p-2 rounded-xl hover:bg-white/8 active:scale-95 transition-all duration-150 group"
//         >
//           <svg
//             className="w-[18px] h-[18px] text-white/40 group-hover:text-white/70 transition-colors"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={1.8}
//               d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
//             />
//           </svg>
//         </button>

//         <button
//           onClick={() => {}}
//           title="Video Call"
//           className="p-2 rounded-xl hover:bg-white/8 active:scale-95 transition-all duration-150 group"
//         >
//           <svg
//             className="w-[18px] h-[18px] text-white/40 group-hover:text-white/70 transition-colors"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={1.8}
//               d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"
//             />
//           </svg>
//         </button>

//         <div className="w-px h-4 bg-white/10 mx-1" />

//         <button className="hidden md:flex p-2 rounded-xl hover:bg-white/8 transition-colors group">
//           <img
//             src={assets.help_icon}
//             alt="help"
//             className="w-4 h-4 opacity-30 group-hover:opacity-60 transition-opacity"
//           />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ChatHeader;

import React, { useContext } from "react";
import assets from "../../assets/assets";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";

const ChatHeader = ({ isSelecting }) => {
  const { selectedUser, setSelectedUser, isTyping } = useContext(ChatContext);
  const { onlineUsers } = useContext(AuthContext);

  const isOnline = onlineUsers.some(
    (id) => id?.toString() === selectedUser?._id?.toString(),
  );

  // Selection mode mein header hide karo
  if (isSelecting) return null;

  return (
    <div className="shrink-0 flex items-center gap-3 px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
      <button
        onClick={() => setSelectedUser(null)}
        className="md:hidden p-1.5 -ml-1 rounded-lg hover:bg-white/8 transition-colors"
      >
        <img src={assets.arrow_icon} alt="back" className="w-5 h-5" />
      </button>

      <div className="relative shrink-0">
        <img
          src={selectedUser?.profilePic || assets.avatar_icon}
          alt={selectedUser?.fullName}
          className="w-9 h-9 rounded-full object-cover ring-2 ring-white/10"
        />
        {isOnline && (
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0d0b1e]" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white truncate leading-tight">
          {selectedUser?.fullName}
        </p>
        {isTyping ? (
          <p className="text-xs text-emerald-400/80 animate-pulse">typing...</p>
        ) : (
          <p
            className={`text-xs ${isOnline ? "text-emerald-400/70" : "text-white/25"}`}
          >
            {isOnline ? "Online" : "Offline"}
          </p>
        )}
      </div>

      <div className="flex items-center gap-0.5">
        <button
          onClick={() => {}}
          title="Audio Call"
          className="p-2 rounded-xl hover:bg-white/8 active:scale-95 transition-all duration-150 group"
        >
          <svg
            className="w-[18px] h-[18px] text-white/40 group-hover:text-white/70 transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
        </button>

        <button
          onClick={() => {}}
          title="Video Call"
          className="p-2 rounded-xl hover:bg-white/8 active:scale-95 transition-all duration-150 group"
        >
          <svg
            className="w-[18px] h-[18px] text-white/40 group-hover:text-white/70 transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"
            />
          </svg>
        </button>

        <div className="w-px h-4 bg-white/10 mx-1" />

        <button className="hidden md:flex p-2 rounded-xl hover:bg-white/8 transition-colors group">
          <img
            src={assets.help_icon}
            alt="help"
            className="w-4 h-4 opacity-30 group-hover:opacity-60 transition-opacity"
          />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;