import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";
import {
  getCrisisList,
  addCrisisPhrase,
  deleteCrisisPhrase,
  updateCrisisPhrase
} from "../controllers/adminController.js";

const router = express.Router();

// Todas estas rutas estarán protegidas
router.use(authMiddleware, adminMiddleware);

// Obtener lista
router.get("/crisis-phrases", getCrisisList);

// Agregar frase
router.post("/crisis-phrases", addCrisisPhrase);

// Editar frase
router.put("/crisis-phrases/:id", updateCrisisPhrase);

// Eliminar
router.delete("/crisis-phrases/:id", deleteCrisisPhrase);

export default router;
