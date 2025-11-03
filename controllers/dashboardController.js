import Portfolio from '../models/Portfolio.js';
import Alert from '../models/Alert.js';
import User from '../models/User.js';

export const getDashboard = async (req , res) =>
{
    try {
        const user = await User.findById(req.user.id);
        const portfolio = await Portfolio.findOne({ user: req.user.id });
        const assets = portfolio ? portfolio.assets : [];
        const totalValue = portfolio ? portfolio.totalValue : 0;
        
         const aiRecommendation = assets.map(a => ({
      symbol: a.symbol,
      suggestedPercentage: 100 / assets.length // equally split
    }));

    const alerts = await Alert.find({ user: req.user.id }).sort({ createdAt: -1 }).limit(5);

    req.status(200).json({
        user: {name:user.name, email:user.email},
        portfolio: { assets,totalValue},
        aiRecommendation,
        alerts
    });
}
    catch (error) {
        console.error(err);
        res.status(500).json({ message: error.message });


    }
};