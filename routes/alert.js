import express from "express";
import { triggerAlert, getAlerts, markAlertRead } from "../controllers/alertController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/trigger",protect, triggerAlert);
router.get("/",protect, getAlerts);
router.put("/read/:id",protect, markAlertRead);

export default router;
