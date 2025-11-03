import mongoose from "mongoose";

const assetSchema = new mongoose.Schema({
  symbol: { type: String, required: true },
  quantity: { type: Number, required: true },
  averageBuyPrice: { type: Number, required: true },
  currentPrice: { type: Number, required: true },
});

const portfolioSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  assets: [assetSchema],
  totalValue: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Portfolio", portfolioSchema);
