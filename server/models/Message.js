// import mongoose from "mongoose";

// const messageSchema = new mongoose.Schema(
//   {
//     senderId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     receiverId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     text: {
//       type: String,
//       trim: true,
//       default: "",
//     },
//     image: {
//       type: String,
//       default: "",
//     },
//     status: {
//       type: String,
//       enum: ["sent", "delivered", "seen"],
//       default: "sent",
//     },
//     deletedFor: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//       },
//     ],
//     deletedForEveryone: {
//       type: Boolean,
//       default: false,
//     },
//     // Emoji reactions
//     reactions: [
//       {
//         userId: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "User",
//           required: true,
//         },
//         emoji: {
//           type: String,
//           required: true,
//         },
//       },
//     ],

//   },
//   { timestamps: true },

// );

// const Message = mongoose.model("Message", messageSchema);
// export default Message;

// import mongoose from "mongoose";

// const messageSchema = new mongoose.Schema(
//   {
//     senderId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     receiverId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     text: {
//       type: String,
//       trim: true,
//       default: "",
//     },
//     image: {
//       type: String,
//       default: "",
//     },
//     status: {
//       type: String,
//       enum: ["sent", "delivered", "seen"],
//       default: "sent",
//     },
//     deletedFor: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//       },
//     ],
//     deletedForEveryone: {
//       type: Boolean,
//       default: false,
//     },
//     reactions: [
//       {
//         userId: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "User",
//           required: true,
//         },
//         emoji: {
//           type: String,
//           required: true,
//         },
//       },
//     ],
//     replyTo: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Message",
//       default: null,
//     },
//   },
//   { timestamps: true },
// );

// const Message = mongoose.model("Message", messageSchema);
// export default Message;

import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: { type: String, default: "" },
    image: { type: String, default: "" },
    audio: { type: String, default: "" }, // ← voice message URL
    audioDuration: { type: Number, default: 0 }, // ← seconds mein
    status: {
      type: String,
      enum: ["sent", "delivered", "seen"],
      default: "sent",
    },
    deletedFor: [{ type: mongoose.Schema.Types.ObjectId }],
    deletedForEveryone: { type: Boolean, default: false },
    reactions: [{ userId: mongoose.Schema.Types.ObjectId, emoji: String }],
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
  },
  { timestamps: true },
);

const Message = mongoose.model("Message", messageSchema);
export default Message;