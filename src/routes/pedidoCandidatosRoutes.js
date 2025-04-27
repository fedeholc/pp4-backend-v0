import express from "express";
import * as pedidoCandidatosController from "../controllers/pedidoCandidatosController.js";

const router = express.Router();

router.get("/", pedidoCandidatosController.getAll);
router.get("/:id", pedidoCandidatosController.getById);
router.post("/", pedidoCandidatosController.create);
router.put("/:id", pedidoCandidatosController.update);
router.delete("/:id", pedidoCandidatosController.remove);

export default router;
