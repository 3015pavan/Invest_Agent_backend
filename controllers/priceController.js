// backend/controllers/priceController.js
import Portfolio from "../models/Portfolio.js";
import axios from "axios";

/* ------------------------------------------------
   Price Controller
   Updates asset prices & broadcasts via Socket.IO
--------------------------------------------------- */

export const fetchAndBroadcastPrices = async () => {
  try {
    console.log("🔄 Fetching & updating prices...");

    const portfolios = await Portfolio.find({}).populate("user");

    for (const portfolio of portfolios) {
      const updatedAssets = [];

      for (const asset of portfolio.assets) {
        // 🔹 Simulate ±2% random price change
        const newPrice =
          asset.currentPrice * (1 + (Math.random() - 0.5) * 0.02);
        asset.currentPrice = parseFloat(newPrice.toFixed(2));
        updatedAssets.push(asset);
      }

      portfolio.totalValue = updatedAssets.reduce(
        (acc, a) => acc + a.quantity * a.currentPrice,
        0
      );

      await portfolio.save();

      // 🔹 Broadcast to connected users if socket exists
      if (global.io) {
        global.io
          .to(portfolio.user._id.toString())
          .emit("portfolioUpdate", portfolio);
      }
    }

    console.log("✅ Price updates broadcasted successfully.");
  } catch (err) {
    console.error("❌ Price update error:", err.message);
  }
};

/* ------------------------------------------------
   Optional REST Endpoint for manual update
--------------------------------------------------- */
export const manualPriceUpdate = async (req, res) => {
  try {
    await fetchAndBroadcastPrices();
    res.status(200).json({ message: "Manual price update successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
