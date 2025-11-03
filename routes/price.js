// backend/routes/priceRoutes.js
import express from "express";
import { manualPriceUpdate } from "../controllers/priceController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* -----------------------------------------
   GET /api/prices/update
   Protected endpoint to manually trigger price updates
------------------------------------------ */
router.get("/update", protect, manualPriceUpdate);

export default router;
