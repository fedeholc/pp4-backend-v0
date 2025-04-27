import express from "express";
import * as tecnicoAreasController from "../controllers/tecnicoAreasController.js";
import {
  authenticateJWT,
  authorizeRoles,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authenticateJWT);

router.get("/", tecnicoAreasController.getAll);
router.get("/:id", tecnicoAreasController.getById);
router.post("/", tecnicoAreasController.create);
router.put("/:id", tecnicoAreasController.update);
router.delete("/:id", authorizeRoles("admin"), tecnicoAreasController.remove);

export default router;
