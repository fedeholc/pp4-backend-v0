import express from "express";
import * as tecnicoController from "../controllers/tecnicoController.js";
import {
  authenticateJWT,
  authorizeRoles,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authenticateJWT);

router.get("/", tecnicoController.getAll);
router.get("/:id", tecnicoController.getById);
router.post("/", tecnicoController.create);
router.put("/:id", tecnicoController.update);
router.delete("/:id", authorizeRoles("admin"), tecnicoController.remove);

export default router;
