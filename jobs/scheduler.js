// backend/jobs/scheduler.js
import cron from "node-cron";
import Portfolio from "../models/Portfolio.js";
import User from "../models/User.js";
import { fetchAndBroadcastPrices } from "../controllers/priceController.js";
import { rebalancePortfolio } from "../controllers/rebalanceController.js";
import { triggerAlert } from "../controllers/alertController.js";

/* ----------------------------------------------
   Scheduler — Runs every 5 minutes
   1️⃣ Updates asset prices
   2️⃣ Rebalances portfolio (if applicable)
   3️⃣ Sends alerts if change ≥ 5%
----------------------------------------------- */

export const startScheduler = () => {
  cron.schedule("*/5 * * * *", async () => {
    console.log("🔄 Running scheduled tasks...");

    try {
      const users = await User.find({});
      for (const user of users) {
        const portfolio = await Portfolio.findOne({ user: user._id });
        if (!portfolio) continue;

        // Step 1: Update prices
        await fetchAndBroadcastPrices();

        // Step 2: Auto rebalance (if you have rebalance logic)
        await rebalancePortfolio({ user: { id: user._id } }, { status: () => {}, json: () => {} });

        // Step 3: Portfolio change detection
        const oldValue = portfolio.totalValue;
        await portfolio.reload?.(); // optional safeguard
        const newValue = portfolio.totalValue;

        const changePercent = ((newValue - oldValue) / oldValue) * 100;

        if (Math.abs(changePercent) >= 5) {
          await triggerAlert(
            {
              user: { id: user._id, email: user.email },
              body: {
                type: "portfolio",
                message: `📊 Portfolio value changed by ${changePercent.toFixed(2)}%`,
              },
            },
            { status: () => {}, json: () => {} }
          );
        }
      }

      console.log("✅ Scheduled tasks completed successfully.");
    } catch (err) {
      console.error("❌ Error in scheduler:", err.message);
    }
  });
};
