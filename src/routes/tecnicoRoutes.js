import express from "express";
import * as tecnicoController from "../controllers/tecnicoController.js";
import {
  authenticateJWT,
  authorizeRoles,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authenticateJWT);

router.get("/", tecnicoController.getAll);
//@ts-ignore
router.get("/:id", tecnicoController.getById);
//@ts-ignore
router.post("/", tecnicoController.create);
router.put("/:id", tecnicoController.update);
router.delete("/:id", authorizeRoles("admin"), tecnicoController.remove);

export default router;
