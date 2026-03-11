// import React, { useEffect, useRef } from "react";
// import assets, { messagesDummyData } from "../assets/assets";
// import { formatMassageTime } from "../library/utils";

// const ChatContainer = ({ selectedUser, setSelectedUser }) => {
//   const scrollEnd = useRef();

//   useEffect(() => {
//     if (scrollEnd.current) {
//       scrollEnd.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, []);

//   return selectedUser ? (
//     <div className="h-full overflow-y-scroll relative backdrop-blur-lg">
//       {/* header */}
//       <div className="flex items-center p-3 gap-3 border-b border-stone-500">
//         <img src={assets.profile_martin} alt="" className="w-8 rounded-full" />

//         <p className="text-white text-lg flex items-center gap-2 flex-1">
//           Martin Johnson
//           <span className="w-2 h-2 bg-green-500 rounded-full"></span>
//         </p>

//         <img
//           onClick={() => setSelectedUser(null)}
//           src={assets.arrow_icon}
//           alt=""
//           className="md:hidden max-w-7 cursor-pointer"
//         />

//         <img src={assets.help_icon} alt="" className="max-md:hidden max-w-5" />
//       </div>

//       {/* Chat area */}
//       <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6">
//         {messagesDummyData.map((msg, index) => (
//           <div
//             key={index}
//             className={`flex items-end gap-2 justify-end ${
//               msg.senderId !== "680f50e4f10f3cd28382ecf9" && "flex-row-reverse"
//             }`}
//           >
//             {msg.image ? (
//               <img
//                 src={msg.image}
//                 alt=""
//                 className="max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8"
//               />
//             ) : (
//               <p
//                 className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 bg-violet-500/30 text-white ${
//                   msg.senderId === "680f50e4f10f3cd28382ecf9"
//                     ? "rounded-br-none"
//                     : "rounded-bl-none"
//                 }`}
//               >
//                 {msg.text}
//               </p>
//             )}

//             <div className="text-center text-xs">
//               <img
//                 src={
//                   msg.senderId === "680f50e4f10f3cd28382ecf9"
//                     ? assets.avatar_icon
//                     : assets.profile_martin
//                 }
//                 alt=""
//                 className="rounded-full max-w-7"
//               />

//               <p className="text-gray-500">
//                 {formatMassageTime(msg.createdAt)}
//               </p>
//             </div>
//           </div>
//         ))}

//         <div ref={scrollEnd}></div>
//       </div>

//       {/* bottom area */}
//       <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3">
//         <div className="flex-1 flex items-center bg-gray-100/12 px-6 rounded-full">
//           <input type="text" placeholder="Send a message" className="flex-1 text-sm border-none rounded-lg outline-none text-white placeholder-gray-400 h-12" />
//           <input type="file" id="image" accept="image/png, image/jpg" hidden />
//           <label htmlFor="image">
//             <img src={assets.gallery_icon} className="w-5 mr-2 cursor-pointer" alt="" />
//           </label>
//         </div>
//       <img src={assets.send_button} alt="" className="cursor-pointer w-10" />
//       </div>
//     </div>
//   ) : (
//     <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden">
//       <img src={assets.logo_icon} className="max-w-16" alt="" />
//       <p className="text-lg font-medium text-white">Chat anytime, anywhere</p>
//     </div>
//   );
// };

// export default ChatContainer;

import React, { useEffect, useRef, useState } from "react";
import assets, { messagesDummyData } from "../assets/assets";
import { formatMassageTime } from "../library/utils";

const MY_ID = "680f50e4f10f3cd28382ecf9";

const ChatContainer = ({ selectedUser, setSelectedUser }) => {
  const scrollEnd = useRef();
  const [message, setMessage] = useState("");
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    scrollEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesDummyData]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setPreviewImage(URL.createObjectURL(file));
  };

  const handleSend = () => {
    if (!message.trim() && !previewImage) return;
    setMessage("");
    setPreviewImage(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Empty state
  if (!selectedUser) {
    return (
      <div className="flex-1 hidden md:flex flex-col items-center justify-center gap-4 bg-transparent">
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
          <img
            src={assets.logo_icon}
            className="w-8 h-8 opacity-60"
            alt="logo"
          />
        </div>
        <div className="text-center">
          <p className="text-base font-semibold text-white/70">
            Select a conversation
          </p>
          <p className="text-sm text-white/30 mt-1">
            Choose from your existing chats
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full min-w-0 bg-transparent">
      {/* Header */}
      <div className="shrink-0 flex items-center gap-3 px-4 py-3.5 border-b border-white/8">
        {/* Back — mobile */}
        <button
          onClick={() => setSelectedUser(null)}
          className="md:hidden p-1.5 -ml-1 rounded-lg hover:bg-white/8 transition-colors"
        >
          <img src={assets.arrow_icon} alt="back" className="w-5 h-5" />
        </button>

        <div className="relative shrink-0">
          <img
            src={selectedUser?.profilePic || assets.avatar_icon}
            alt={selectedUser.fullName}
            className="w-9 h-9 rounded-full object-cover"
          />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0d0b1e]" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">
            {selectedUser.fullName}
          </p>
          <p className="text-xs text-emerald-400/80">Online</p>
        </div>

        <button className="hidden md:flex p-2 rounded-xl hover:bg-white/8 transition-colors">
          <img
            src={assets.help_icon}
            alt="help"
            className="w-4 h-4 opacity-50"
          />
        </button>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto px-4 py-5 space-y-3
        scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
      >
        {messagesDummyData.map((msg, index) => {
          const isMine = msg.senderId === MY_ID;

          return (
            <div
              key={index}
              className={`flex items-end gap-2 ${isMine ? "justify-end" : "justify-start"}`}
            >
              {/* Other avatar */}
              {!isMine && (
                <img
                  src={selectedUser?.profilePic || assets.avatar_icon}
                  alt=""
                  className="w-6 h-6 rounded-full object-cover shrink-0 mb-5"
                />
              )}

              <div
                className={`flex flex-col gap-1 max-w-[72%] md:max-w-[58%] ${isMine ? "items-end" : "items-start"}`}
              >
                {msg.image ? (
                  <img
                    src={msg.image}
                    alt="shared"
                    className="max-w-full rounded-2xl border border-white/10 cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => window.open(msg.image)}
                  />
                ) : (
                  <div
                    className={`
                    px-4 py-2.5 rounded-2xl text-sm leading-relaxed text-white break-words
                    ${
                      isMine
                        ? "bg-violet-600/75 rounded-br-sm"
                        : "bg-white/10 rounded-bl-sm"
                    }
                  `}
                  >
                    {msg.text}
                  </div>
                )}
                <p className="text-[10px] text-white/25 px-1">
                  {formatMassageTime(msg.createdAt)}
                </p>
              </div>

              {/* My avatar */}
              {isMine && (
                <img
                  src={assets.avatar_icon}
                  alt=""
                  className="w-6 h-6 rounded-full object-cover shrink-0 mb-5"
                />
              )}
            </div>
          );
        })}
        <div ref={scrollEnd} />
      </div>

      {/* Image preview */}
      {previewImage && (
        <div className="shrink-0 px-4 pb-2">
          <div className="relative inline-block">
            <img
              src={previewImage}
              alt="preview"
              className="h-14 w-14 rounded-lg object-cover border border-white/15"
            />
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] flex items-center justify-center"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="shrink-0 px-4 py-3 border-t border-white/8">
        <div className="flex items-center gap-2.5">
          <div className="flex-1 flex items-center gap-2 bg-white/6 border border-white/8 rounded-xl px-4 py-2.5 min-w-0">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Write a message..."
              className="flex-1 bg-transparent outline-none text-white text-sm placeholder-white/30 min-w-0"
            />
            <input
              type="file"
              id="image"
              accept="image/png,image/jpg,image/jpeg"
              hidden
              onChange={handleImageChange}
            />
            <label
              htmlFor="image"
              className="shrink-0 cursor-pointer p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <img
                src={assets.gallery_icon}
                className="w-4 h-4 opacity-40 hover:opacity-80 transition-opacity"
                alt="gallery"
              />
            </label>
          </div>

          <button
            onClick={handleSend}
            disabled={!message.trim() && !previewImage}
            className="shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-25 disabled:cursor-not-allowed active:scale-95 transition-all duration-150"
          >
            <img src={assets.send_button} alt="send" className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;