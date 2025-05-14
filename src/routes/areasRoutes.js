import express from "express";
import * as areasController from "../controllers/areasController.js";
import passport from "../config/passport.js";

const router = express.Router();

router.get(
  "/",

  areasController.getAll
);
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  areasController.create
);
router.get(
  "/:id",
 
  //@ts-ignore
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
