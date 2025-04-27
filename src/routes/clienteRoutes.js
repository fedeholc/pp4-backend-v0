import express from "express";
import * as clienteController from "../controllers/clienteController.js";
import {
  authenticateJWT,
  authorizeRoles,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authenticateJWT);

router.get("/", clienteController.getAll);
//@ts-ignore
router.get("/:id", clienteController.getById);
//@ts-ignore
router.post("/", clienteController.create);
router.put("/:id", clienteController.update);
router.delete("/:id", authorizeRoles("admin"), clienteController.remove);

export default router;
