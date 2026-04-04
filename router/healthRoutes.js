import express from "express";
import healthController from "../controllers/healthController.js";
const router = express.Router();

router.get("/", healthController.health);
router.get("/db", healthController.healthCheck);

export default router;