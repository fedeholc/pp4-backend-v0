import express from "express";
import * as areasController from "../controllers/areasController.js";
import passport from "../config/passport.js";

const router = express.Router();

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  areasController.getAll
);
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  areasController.create
);
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  areasController.getById
);
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  areasController.update
);
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  areasController.remove
);

export default router;
