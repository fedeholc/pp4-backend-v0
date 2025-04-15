import express from "express";
import * as pedidoController from "../controllers/pedidoController.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authenticateJWT);

router.get("/", pedidoController.getAll);
router.get("/:id", pedidoController.getById);
router.post("/", pedidoController.create);
router.put("/:id", pedidoController.update);
router.delete("/:id", pedidoController.remove);

export default router;
