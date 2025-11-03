import express from "express";
import { recommendPortfolio } from "../controllers/aiController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/recommend", protect, recommendPortfolio);

export default router;
