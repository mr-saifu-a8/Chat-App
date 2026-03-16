import React, { useState, useContext, useEffect } from "react";
import assets from "./../assets/assets";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";

const Sidebar = () => {
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
  } = useContext(ChatContext);

  const { logout, onlineUsers } = useContext(AuthContext);

  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const filteredUsers = searchQuery
    ? users.filter((user) =>
        user.fullName.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : users;

  useEffect(() => {
    getUsers();
  }, [onlineUsers]);

  return (
    <div className="flex flex-col w-full h-full bg-transparent text-white">
      {/* Header */}
      <div className="shrink-0 px-5 pt-5 pb-3">
        <div className="flex justify-between items-center">
          <img src={assets.logo} alt="logo" className="w-28 lg:w-32" />

          <div className="relative">
            <button
              onClick={() => setMenuOpen((p) => !p)}
              className="p-2 rounded-xl hover:bg-white/8 transition-colors"
            >
              <img src={assets.menu_icon} alt="menu" className="w-5 h-5" />
            </button>

            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute top-full right-0 z-20 mt-1 w-38 py-1.5 rounded-xl bg-[#1a1730] border border-white/10 shadow-2xl shadow-black/50">
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-white/80 hover:bg-white/8 hover:text-white transition-colors"
                  >
                    Edit Profile
                  </button>
                  <div className="my-1 border-t border-white/8" />
                  <button
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-white/8 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2.5 bg-white/6 hover:bg-white/8 border border-white/8 rounded-xl px-4 py-2.5 mt-4 transition-colors">
          <img
            src={assets.search_icon}
            alt="search"
            className="w-3.5 h-3.5 opacity-40 shrink-0"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none text-white text-sm placeholder-white/30 min-w-0"
            placeholder="Search conversations..."
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-white/30 hover:text-white/60 text-xs transition-colors"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Section label */}
      <div className="shrink-0 px-5 pt-3 pb-2">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-white/25">
          Messages
        </p>
      </div>

      {/* User list */}
      <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-0.5 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => {
            const isActive =
              selectedUser?._id?.toString() === user._id?.toString();

            // toString() — MongoDB ObjectId aur string dono handle karo
            const isOnline = onlineUsers.some(
              (id) => id?.toString() === user._id?.toString(),
            );
            const unreadCount = unseenMessages[user._id?.toString()] || 0;

            return (
              <div
                key={user._id}
                onClick={() => {
                  setSelectedUser(user);
                  setUnseenMessages((prev) => ({
                    ...prev,
                    [user._id?.toString()]: 0,
                  }));
                }}
                className={`
                  flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer
                  transition-all duration-150
                  ${
                    isActive
                      ? "bg-violet-600/20 border border-violet-500/20"
                      : "hover:bg-white/5 border border-transparent"
                  }
                `}
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  <img
                    src={user?.profilePic || assets.avatar_icon}
                    alt={user.fullName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span
                    className={`
                    absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#0d0b1e]
                    ${isOnline ? "bg-emerald-400" : "bg-white/20"}
                  `}
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {user.fullName}
                  </p>
                  <p
                    className={`text-xs mt-0.5 ${isOnline ? "text-emerald-400/80" : "text-white/30"}`}
                  >
                    {isOnline ? "Active now" : "Offline"}
                  </p>
                </div>

                {/* Unseen badge */}
                {unreadCount > 0 && (
                  <span className="shrink-0 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-violet-500 text-white text-[10px] font-bold">
                    {unreadCount}
                  </span>
                )}
              </div>
            );
          })
        ) : (
          <div className="py-12 text-center text-white/25 text-sm">
            No users found
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;