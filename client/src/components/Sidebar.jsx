// import React from "react";
// import assets, { userDummyData } from "./../assets/assets";
// import { useNavigate } from "react-router-dom";

// const Sidebar = ({ selectedUser, setSelectedUser }) => {
//   const navigate = useNavigate();
//   return (
//     <div
//       className={`bg-[#8185b2]/10 h-full p-5 rounded-r-xl overflow-y-scroll text-white ${selectedUser ? "max-md:hidden" : ""}`}
//     >
//       <div className="p-5">
//         <div className="flex justify-between items-center">
//           <img src={assets.logo} alt="logo" className="max-w-40" />
//           <div className="relative p-2 group">
//             <img
//               src={assets.menu_icon}
//               alt="menu_icon"
//               className="max-h-5 cursor-pointer"
//             />
//             <div className="absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-[#282142] border border-gray-600 text-gray-100 hidden group-hover:block">
//               <p
//                 onClick={() => navigate("/profile")}
//                 className="cursor-pointer text-sm"
//               >
//                 Edit Profile
//               </p>
//               <hr className="my-2 border-t border-gray-500" />
//               <p className="cursor-pointer text-sm">Logout</p>
//             </div>
//           </div>
//         </div>

//         <div className="bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5">
//           <img src={assets.search_icon} alt="search" className="w-3"/>
//           <input type="text" className="bg-transparent border-none outline-none text-white text-xs flex-1 placeholder-[#c8c8c8]" placeholder="Search user..."/>
//         </div>
//       </div>

//       <div className="flex flex-col">
//         {userDummyData.map((user, index) => (
//           <div onClick={()=> {setSelectedUser(user)}} key={index} className={`relative flex items-center gap-2 pl-4 p-2 rounded cursor-pointer max-sm:text-sm ${selectedUser?._id === user._id && 'bg-[#282142]/50'}`}>
//             <img src={user?.profilePic || assets.avatar_icon} alt="" className="w-[35px] aspect-[1/1] rounded-full" />
//             <div className="flex flex-col leading-5">
//               <p>{user.fullName}</p>
//               {
//                 index < 3 ?  <span className="text-green-400 text-sm">Online</span> : <span className="text-neutral-400 text-sm">Offline</span>
//               }
//             </div>
//             {index > 2 && <p className="absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500/50">{index}</p>}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Sidebar;






import React, { useState } from "react";
import assets, { userDummyData } from "./../assets/assets";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ selectedUser, setSelectedUser }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const filteredUsers = userDummyData.filter((user) =>
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex flex-col w-full h-full bg-transparent text-white">
      {/* Header */}
      <div className="shrink-0 px-5 pt-5 pb-3">
        <div className="flex justify-between items-center">
          <img src={assets.logo} alt="logo" className="w-28 lg:w-32" />

          {/* Menu */}
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
                    onClick={() => setMenuOpen(false)}
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
      <div
        className="flex-1 overflow-y-auto px-2 pb-4 space-y-0.5
        scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
      >
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user, index) => {
            const isOnline = index < 3;
            const isActive = selectedUser?._id === user._id;
            const unread = index > 2 ? index : 0;

            return (
              <div
                key={user._id || index}
                onClick={() => setSelectedUser(user)}
                className={`
                  flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer
                  transition-all duration-150 group
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
                    absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2
                    border-[#0d0b1e]
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

                {/* Badge */}
                {unread > 0 && (
                  <span className="shrink-0 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-violet-500 text-white text-[10px] font-bold">
                    {unread}
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

