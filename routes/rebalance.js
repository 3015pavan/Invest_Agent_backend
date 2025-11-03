import express from "express";
import { rebalancePortfolio } from "../controllers/rebalanceController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/", protect, rebalancePortfolio);
export default router;
