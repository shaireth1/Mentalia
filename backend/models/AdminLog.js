// backend/models/AdminLog.js
import mongoose from "mongoose";

const AdminLogSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
  endpoint: {
    type: String,
    required: true,
  },

  // 🔥 YA NO ES REQUIRED
  method: {
    type: String,
    default: "UNKNOWN",
  },

  description: {
    type: String,
  },
  ip: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("AdminLog", AdminLogSchema);
