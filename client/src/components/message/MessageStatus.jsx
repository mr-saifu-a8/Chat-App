import React from "react";
import { Check, CheckCheck } from "lucide-react";

const MessageStatus = ({ status }) => {
  if (status === "seen") {
    return <CheckCheck className="w-3.5 h-3.5 text-blue-400" title="Seen" />;
  }

  if (status === "delivered") {
    return (
      <CheckCheck className="w-3.5 h-3.5 text-white/40" title="Delivered" />
    );
  }

  return <Check className="w-3.5 h-3.5 text-white/40" title="Sent" />;
};

export default MessageStatus;
