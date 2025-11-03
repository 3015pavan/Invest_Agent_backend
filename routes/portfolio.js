import express from "express";
import { addAsset, getPortfolio, updateAsset, deleteAsset } from "../controllers/portfolioControllers.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, addAsset);        // Add or update an asset
router.get("/", protect, getPortfolio);     // Get full portfolio
router.put("/", protect, updateAsset);      // Update single asset
router.delete("/:symbol", protect, deleteAsset); // Delete asset by symbol

export default router;
