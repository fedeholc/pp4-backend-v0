import express from "express";
import * as pedidoDisponibilidadController from "../controllers/pedidoDisponibilidadController.js";

const router = express.Router();

router.get("/", pedidoDisponibilidadController.getAll);
//@ts-ignore
router.get("/:id", pedidoDisponibilidadController.getById);
//@ts-ignore
router.post("/", pedidoDisponibilidadController.create);
router.put("/:id", pedidoDisponibilidadController.update);
router.delete("/:id", pedidoDisponibilidadController.remove);

export default router;
