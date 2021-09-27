import express from "express";
import { getMe, login, signup } from "../controllers/authentication";
import { protect } from "@marius98/myzone-common-package";

const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);

router.get("/me", protect, getMe);

export default router;
