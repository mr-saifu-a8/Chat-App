import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../../assets/assets";

const SidebarHeader = ({ onSearch, searchQuery, logout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
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
          onChange={(e) => onSearch(e.target.value)}
          className="flex-1 bg-transparent outline-none text-white text-sm placeholder-white/30 min-w-0"
          placeholder="Search conversations..."
        />
        {searchQuery && (
          <button
            onClick={() => onSearch("")}
            className="text-white/30 hover:text-white/60 text-xs transition-colors"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default SidebarHeader;
