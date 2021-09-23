import express from "express";
import { login } from "../controllers/authentication";

const router = express.Router();

router.get("/login", login);

export default router;
