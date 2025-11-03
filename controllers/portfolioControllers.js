import Portfolio from "../models/Portfolio.js";

/* -------------------------------
  Day 4 Update: Portfolio CRUD enhancements
  - addAsset: add or update a single asset with weighted average
  - getPortfolio: get user's portfolio
  - updateAsset: update a specific asset
  - deleteAsset: remove an asset
--------------------------------*/

// Add or update asset
export const addAsset = async (req, res) => {
  let { symbol, quantity, averageBuyPrice, currentPrice } = req.body;

  // Convert to numbers
  quantity = Number(quantity);
  averageBuyPrice = Number(averageBuyPrice);
  currentPrice = Number(currentPrice);

  if (!symbol || isNaN(quantity) || isNaN(averageBuyPrice) || isNaN(currentPrice))
    return res.status(400).json({ message: "All asset fields are required and must be numbers" });

  try {
    let portfolio = await Portfolio.findOne({ user: req.user.id });
    if (!portfolio) portfolio = new Portfolio({ user: req.user.id, assets: [] });

    const existingAsset = portfolio.assets.find(a => a.symbol === symbol);
    if (existingAsset) {
      const totalQuantity = existingAsset.quantity + quantity;
      existingAsset.averageBuyPrice =
        (existingAsset.averageBuyPrice * existingAsset.quantity + averageBuyPrice * quantity) /
        totalQuantity;
      existingAsset.quantity = totalQuantity;
      existingAsset.currentPrice = currentPrice;
    } else {
      portfolio.assets.push({ symbol, quantity, averageBuyPrice, currentPrice });
    }

    portfolio.totalValue = portfolio.assets.reduce((acc, a) => acc + a.quantity * a.currentPrice, 0);
    await portfolio.save();
    res.status(200).json(portfolio);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Get portfolio
export const getPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user.id });
    if (!portfolio) return res.status(404).json({ message: "Portfolio not found" });
    res.status(200).json(portfolio);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Update asset
export const updateAsset = async (req, res) => {
  let { symbol, quantity, averageBuyPrice, currentPrice } = req.body;
  if (!symbol) return res.status(400).json({ message: "Asset symbol is required" });

  // Convert to numbers if provided
  if (quantity !== undefined) quantity = Number(quantity);
  if (averageBuyPrice !== undefined) averageBuyPrice = Number(averageBuyPrice);
  if (currentPrice !== undefined) currentPrice = Number(currentPrice);

  try {
    const portfolio = await Portfolio.findOne({ user: req.user.id });
    if (!portfolio) return res.status(404).json({ message: "Portfolio not found" });

    const asset = portfolio.assets.find(a => a.symbol === symbol);
    if (!asset) return res.status(404).json({ message: "Asset not found" });

    if (quantity !== undefined && !isNaN(quantity)) asset.quantity = quantity;
    if (averageBuyPrice !== undefined && !isNaN(averageBuyPrice)) asset.averageBuyPrice = averageBuyPrice;
    if (currentPrice !== undefined && !isNaN(currentPrice)) asset.currentPrice = currentPrice;

    portfolio.totalValue = portfolio.assets.reduce((acc, a) => acc + a.quantity * a.currentPrice, 0);
    await portfolio.save();

    res.status(200).json(portfolio);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Delete asset
export const deleteAsset = async (req, res) => {
  const { symbol } = req.params;
  if (!symbol) return res.status(400).json({ message: "Asset symbol is required" });

  try {
    const portfolio = await Portfolio.findOne({ user: req.user.id });
    if (!portfolio) return res.status(404).json({ message: "Portfolio not found" });

    portfolio.assets = portfolio.assets.filter(a => a.symbol !== symbol);
    portfolio.totalValue = portfolio.assets.reduce((acc, a) => acc + a.quantity * a.currentPrice, 0);

    await portfolio.save();
    res.status(200).json({ message: "Asset deleted", portfolio });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};