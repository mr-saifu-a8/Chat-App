import React, { useContext } from "react";
import { X, Reply } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";

const ReplyPreview = ({ replyTo, onCancel }) => {
  const { authUser } = useContext(AuthContext);
  const { selectedUser } = useContext(ChatContext);

  if (!replyTo) return null;

  return (
    <div className="shrink-0 mx-4 mt-2 mb-1">
      <div
        className="
        flex items-center gap-3
        bg-white/[0.05] border border-white/[0.08]
        border-l-[3px] border-l-violet-500
        rounded-xl px-3 py-2.5
      "
      >
        <Reply className="w-3.5 h-3.5 text-violet-400 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-semibold text-violet-400 mb-0.5">
            Replying to{" "}
            {replyTo.senderId?.toString() === authUser._id?.toString()
              ? "yourself"
              : selectedUser?.fullName}
          </p>
          {replyTo.image ? (
            <div className="flex items-center gap-2">
              <img
                src={replyTo.image}
                alt="reply"
                className="w-7 h-7 rounded-md object-cover shrink-0"
              />
              <p className="text-xs text-white/40">📷 Photo</p>
            </div>
          ) : replyTo.audio ? (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-white/10 flex items-center justify-center shrink-0">
                <span className="text-xs">🎵</span>
              </div>
              <p className="text-xs text-white/40">🎵 Audio</p>
            </div>
          ) : (
            <p className="text-xs text-white/40 truncate">{replyTo.text}</p>
          )}
        </div>
        <button
          onClick={onCancel}
          className="shrink-0 w-5 h-5 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
        >
          <X className="w-3 h-3 text-white/50" />
        </button>
      </div>
    </div>
  );
};

export default ReplyPreview;
