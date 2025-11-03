
import { protect } from "../middleware/authMiddleware.js";
import Portfolio from "../models/Portfolio.js";
import { OpenAI } from "@langchain/openai";




const llm = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  temperature: 0.7,
});

// Endpoint: POST /api/ai/recommend
export const recommendPortfolio = async (req, res) => {
  const { goal, availableBudget } = req.body;

  if (!goal || !availableBudget)
    return res.status(400).json({ message: "Goal and budget are required" });

  try {
    const prompt = `
      You are a financial advisor.
      User goal: ${goal}
      Available budget: ${availableBudget} USD.
      Suggest an asset allocation in JSON format with 'symbol', 'type' (stock/crypto), 'amount'.
      Example:
      [
        {"symbol": "AAPL", "type": "stock", "amount": 5000},
        {"symbol": "BTC", "type": "crypto", "amount": 2000}
      ]
    `;

    const response = await lllm.call(prompt);

    let recommendations;

    try {
        recommendation = JSON.parse(response);

    }
    catch(err) {
        return res.status(500).json({ message: "Failed to parse LLM response", error: err.message });
    }

    let portfolio = await Portfolio.findOne( { user: req.user.id});
    if(!portfolio) {
        portfolio = new Portfolio({ user: req.user.id, assets: [] });
    };
    portfolio.assets = recommenddation.map(item => ({
        symbol :item.symbol,
        quantity: item.amount,
        averageBuyPrice: 1,
        currentPrice: 1,}));
    
    portfolio.totalValue = recommendation.reduce((acc,a)=> acc + a.amount, 0);
    await portfolio.save();
    res.status(200).json({portdolio,recommendation});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

