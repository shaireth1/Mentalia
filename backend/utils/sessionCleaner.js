// backend/utils/sessionCleaner.js

import Session from "../models/Session.js";

export async function cleanInactiveSessions() {
  try {
    const THIRTY_MIN = 60 * 60 * 1000;


    const now = Date.now();

    const result = await Session.updateMany(
      {
        isActive: true,
        lastActivity: { $lt: new Date(now - THIRTY_MIN) }
      },
      { $set: { isActive: false } }
    );

    if (result.modifiedCount > 0) {
      console.log(`⏳ Sesiones cerradas por inactividad: ${result.modifiedCount}`);
    }
  } catch (err) {
    console.error("❌ Error limpiando sesiones inactivas:", err);
  }
}
