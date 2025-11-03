import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    symbol: { type: String, required: true },
    type: { type:String, enum: ['buy','sell'],required: true},
    quantity: { type: Number, required: true },
    price: { type:Number, required: true },
    date: { type: date, default: Date.now },
    }
);

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;
