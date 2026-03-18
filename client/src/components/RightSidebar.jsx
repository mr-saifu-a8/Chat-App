
import { useState, useEffect, useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";
import assets from "../assets/assets";

const RightSidebar = () => {
  const { selectedUser, messages } = useContext(ChatContext);
  const { logout, onlineUsers } = useContext(AuthContext);

  const [msgImages, setMsgImages] = useState([]);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (messages?.length > 0) {
      setMsgImages(messages.filter((msg) => msg.image).map((msg) => msg.image));
    } else {
      setMsgImages([]);
    }
  }, [messages]);

  useEffect(() => {
    setImgError(false);
  }, [selectedUser]);

  if (!selectedUser) return null;

  const isOnline = onlineUsers.some(
    (id) => id?.toString() === selectedUser._id?.toString(),
  );

  return (
    <div className="flex flex-col w-full h-full bg-transparent text-white">
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        <div className="pt-8 pb-6 px-5 flex flex-col items-center gap-3 text-center">
          <div className="relative">
            <img
              src={
                (!imgError && selectedUser?.profilePic) || assets.avatar_icon
              }
              onError={() => setImgError(true)}
              alt={selectedUser.fullName}
              className="w-20 h-20 rounded-full object-cover ring-4 ring-white/8 shadow-xl shadow-black/40"
            />
            {isOnline && (
              <span className="absolute bottom-1 right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0d0b1e]" />
            )}
          </div>

          <div>
            <h2 className="text-base font-semibold text-white">
              {selectedUser.fullName}
            </h2>
            <p
              className={`text-xs mt-0.5 ${isOnline ? "text-emerald-400/80" : "text-white/30"}`}
            >
              {isOnline ? "Active now" : "Offline"}
            </p>
          </div>

          {selectedUser.bio && (
            <p className="text-xs text-white/40 leading-relaxed max-w-[180px]">
              {selectedUser.bio}
            </p>
          )}
        </div>

        <div className="mx-5 border-t border-white/8" />

        <div className="px-5 pt-5 pb-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/25">
              Media
            </p>
            <span className="text-[10px] text-white/25">
              {msgImages.length}
            </span>
          </div>

          {msgImages.length > 0 ? (
            <div className="grid grid-cols-2 gap-1.5">
              {msgImages.map((url, index) => (
                <div
                  key={index}
                  onClick={() => window.open(url)}
                  className="group relative aspect-square rounded-lg overflow-hidden cursor-pointer bg-white/5"
                >
                  <img
                    src={url}
                    alt={`media-${index}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-white/20 text-xs">
              No media shared yet
            </div>
          )}
        </div>
      </div>

      <div className="shrink-0 px-5 py-4 border-t border-white/8">
        <button
          onClick={logout}
          className="w-full py-2.5 rounded-xl text-sm font-medium text-white/80
            bg-white/6 hover:bg-red-500/20 hover:text-red-400
            border border-white/8 hover:border-red-500/30
            active:scale-95 transition-all duration-200"
        >
          Sign out
        </button>
      </div>
    </div>
  );
};

export default RightSidebar;