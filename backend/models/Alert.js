// backend/models/Alert.js
import mongoose from "mongoose";

const alertSchema = new mongoose.Schema({
  phrase: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ["suicidio", "autolesion", "ideacion_muerte", "violencia", "otro"],
    default: "suicidio"
  },
  severity: {
    type: String,
    enum: ["alto", "medio", "bajo"],
    default: "alto"
  },
  target: {
    type: String,
    enum: ["self", "others", "unspecified"],
    default: "self"
  },
  sessionId: {
    type: String,
    required: true
  },
  userType: {
    type: String,
    enum: ["anonimo", "registrado"],
    required: true
  },
  userId: {
    type: String,
    default: null
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["pendiente", "atendida"],
    default: "pendiente"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Alert", alertSchema);
