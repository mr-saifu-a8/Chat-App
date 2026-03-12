import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";

const ProfilePage = () => {
  const [selectedImg, setSelectedImg] = useState(null);
  const [name, setName] = useState("Saif Ali");
  const [bio, setBio] = useState("Hey there! I am using QuickChat.");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedImg(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) setSelectedImg(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <div
      className="min-h-screen w-screen overflow-y-auto bg-[#0d0b1e] flex items-center justify-center px-0 py-0"
      style={{
        backgroundImage: `
          radial-gradient(ellipse at 20% 30%, rgba(109,40,217,0.12) 0%, transparent 60%),
          radial-gradient(ellipse at 80% 70%, rgba(139,92,246,0.08) 0%, transparent 55%)
        `,
      }}
    >
      {/* Full screen on mobile, centered card on desktop */}
      <div
        className="
        w-full h-full min-h-screen
        md:min-h-fit md:max-w-md md:my-10
        flex flex-col
        bg-white/[0.04] md:border md:border-white/[0.08]
        md:rounded-3xl overflow-hidden
        md:shadow-[0_32px_80px_rgba(0,0,0,0.5)]
      "
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-600/20 to-purple-600/10 border-b border-white/[0.06] px-6 py-4 flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="w-8 h-8 rounded-xl bg-white/[0.06] border border-white/[0.08]
              hover:bg-white/[0.10] active:scale-95
              flex items-center justify-center shrink-0
              transition-all duration-200"
          >
            <svg
              className="w-4 h-4 text-white/60"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <div className="flex-1">
            <h1 className="text-white font-semibold text-base tracking-tight leading-tight">
              Edit Profile
            </h1>
            <p className="text-white/30 text-xs mt-0.5">
              How others will see you
            </p>
          </div>

          <div className="w-8 h-8 rounded-xl bg-violet-500/15 border border-violet-500/20 flex items-center justify-center shrink-0">
            <svg
              className="w-3.5 h-3.5 text-violet-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 px-6 py-7 flex flex-col gap-6"
        >
          {/* Avatar upload */}
          <div className="flex items-center gap-5">
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white/5 border border-white/10">
                <img
                  src={
                    selectedImg
                      ? URL.createObjectURL(selectedImg)
                      : assets.avatar_icon
                  }
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-[#0d0b1e]" />
            </div>

            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`
                flex-1 border border-dashed rounded-2xl px-4 py-4
                flex flex-col items-center justify-center gap-1.5
                cursor-pointer transition-all duration-200
                ${
                  isDragging
                    ? "border-violet-400/70 bg-violet-500/10"
                    : "border-white/15 hover:border-violet-400/40 hover:bg-white/[0.03]"
                }
              `}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".png,.jpg,.jpeg"
                hidden
                onChange={handleImageChange}
              />
              <svg
                className="w-5 h-5 text-white/30"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-xs text-white/40 font-medium">
                {selectedImg ? "Change photo" : "Upload photo"}
              </p>
              <p className="text-[10px] text-white/20">PNG or JPG, max 5MB</p>
            </div>
          </div>

          {selectedImg && (
            <button
              type="button"
              onClick={() => setSelectedImg(null)}
              className="-mt-3 self-end text-[11px] text-red-400/60 hover:text-red-400 transition-colors"
            >
              Remove photo
            </button>
          )}

          <div className="border-t border-white/[0.06]" />

          {/* Name */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-white/25">
              Display Name
            </label>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              type="text"
              placeholder="Your full name"
              required
              className="w-full bg-white/[0.05] border border-white/[0.08] rounded-2xl
                px-4 py-3 text-sm text-white placeholder-white/20
                outline-none focus:border-violet-500/50 focus:bg-white/[0.07]
                transition-all duration-200"
            />
          </div>

          {/* Bio */}
          <div className="flex flex-col gap-2">
            <label className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-white/25">
                Bio
              </span>
              <span
                className={`text-[10px] transition-colors ${bio.length > 130 ? "text-red-400/80" : "text-white/20"}`}
              >
                {bio.length} / 150
              </span>
            </label>
            <textarea
              onChange={(e) => setBio(e.target.value)}
              value={bio}
              placeholder="A short bio about you..."
              required
              maxLength={150}
              rows={3}
              className="w-full bg-white/[0.05] border border-white/[0.08] rounded-2xl
                px-4 py-3 text-sm text-white placeholder-white/20
                outline-none focus:border-violet-500/50 focus:bg-white/[0.07]
                transition-all duration-200 resize-none leading-relaxed"
            />
          </div>

          {/* Live preview */}
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl px-4 py-3.5 flex items-center gap-3">
            <img
              src={
                selectedImg
                  ? URL.createObjectURL(selectedImg)
                  : assets.avatar_icon
              }
              alt="preview"
              className="w-9 h-9 rounded-full object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate leading-tight">
                {name || "Your Name"}
              </p>
              <p className="text-xs text-white/35 truncate mt-0.5">
                {bio || "Your bio will appear here"}
              </p>
            </div>
            <span className="shrink-0 text-[10px] text-white/20 bg-white/5 px-2 py-1 rounded-full border border-white/8">
              Preview
            </span>
          </div>

          {/* Buttons — mt-auto pushes to bottom on mobile full screen */}
          <div className="flex gap-2.5 mt-auto pt-2">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex-1 py-3 rounded-2xl text-sm font-medium
                text-white/45 bg-white/[0.04] border border-white/[0.08]
                hover:bg-white/[0.08] hover:text-white/65
                active:scale-[0.98] transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-2xl text-sm font-medium text-white
                bg-violet-600 hover:bg-violet-500
                active:scale-[0.98] transition-all duration-200
                shadow-lg shadow-violet-950/50"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
