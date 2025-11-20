// backend/models/Session.js
import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // ❌ Eliminado el token porque no lo usas ni debe ser requerido
  /*
  token: {
    type: String,
    required: true,
    index: true,
  },
  */

  userAgent: String,
  ip: String,
  location: String, // opcional
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

// Eliminamos cualquier índice que dependa del token
// sessionSchema.index({ token: 1 });

export default mongoose.model("Session", sessionSchema);
