// backend/models/Session.js
import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  token: {
    type: String,
    required: true,
    index: true,
  },
  userAgent: String,
  ip: String,
  location: String, // opcional, por si luego usas geolocalización
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastActivity: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Session", sessionSchema);
