import express from "express";
import * as usuarioController from "../controllers/usuarioController.js";
import {
  authenticateJWT,
  //authorizeRoles,
  authorizeSelfOrRoles,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

//router.use(authenticateJWT, authorizeRoles("admin"));

router.get("/", usuarioController.getAll);
//@ts-ignore
router.post("/", usuarioController.create);
//@ts-ignore
router.get("/:id", usuarioController.getById);
router.put(
  "/:id",
  authenticateJWT, // Verifica el JWT y agrega req.user
  authorizeSelfOrRoles("admin"), // Permite si es el mismo usuario o admin
  usuarioController.update
);
router.delete("/:id", usuarioController.remove);

export default router;
