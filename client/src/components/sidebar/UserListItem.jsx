import React from "react";
import assets from "../../assets/assets";

const UserListItem = ({ user, isActive, isOnline, unreadCount, onClick }) => {
  return (
    <div
      onClick={onClick}
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

      {unreadCount > 0 && (
        <span className="shrink-0 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-violet-500 text-white text-[10px] font-bold">
          {unreadCount}
        </span>
      )}
    </div>
  );
};

export default UserListItem;
