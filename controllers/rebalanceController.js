import Portfolio from "../models/Portfolio.js";

export const rebalancePortfolio = async (req, res) => {
    try {
    const portfolio = await Portfolio.findOne({ user: req.user.id });
    if(!portfolio) {
        return res.status(404).json({ message: "Portfolio not found" });
    }

    if(!portfolio.assets || portfolio.assets.lemgth == 0) {
        return res.status(400).json({ message: "No asets to rebalance" });
    }
    const totalValue = portfolio.assets.reduce((acc, a) => acc + a.quantity*a.currentPrice, 0);
    portfolio.assets.forEach(asset => {
        const targetAmount = asset.quantity;
        const currentAmount = asset.quantity * asset.currentPrice;
        const adjustmentFactor = targetAmount/currentAmount;
        asset.quantity = asset.quantity * adjustmentFactor;

    });
    portfolio.totalValue = portfolioassets.reduce((acc,a) => acc + a.quantity * a.currentPrice, 0);
    await portfolio.save();
    res.status(200).json({ message: "Portfolio rebalanced successfully", portfolio });
} catch (err) {
    console.error(err);
    res.status(500).json({ message : err.message });

}

};