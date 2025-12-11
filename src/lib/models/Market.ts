import mongoose from 'mongoose';

export interface IMarket {
  marketField: number;
  apiType: number;
  task: string;
  creator: string;
  tokenA: string;
  tokenB: string;
  initAmount: number;
  tradingAmountA: number;
  tradingAmountB: number;
  tokenAPrice: number;
  tokenBPrice: number;
  market: string;
  question: string;
  value: number;
  range: number;
  date: string;
  marketStatus: 'INIT' | 'PENDING' | 'ACTIVE' | 'RESOLVED';
  feedName: string;
  imageUrl: string;
  description: string;
  feedkey: string;
  isYes: boolean;
  feed?: string;
  playerA: Array<{ player: string; amount: number }>;
  playerB: Array<{ player: string; amount: number }>;
  investors: Array<{ investor: string; amount: number }>;
  createdAt: string;
}

const MarketSchema = new mongoose.Schema<IMarket>({
  marketField: { type: Number, required: true },
  apiType: { type: Number, required: true },
  task: { type: String, required: true },
  creator: { type: String, required: true },
  tokenA: { type: String, default: '' },
  tokenB: { type: String, default: '' },
  initAmount: { type: Number, required: true },
  tradingAmountA: { type: Number, default: 0 },
  tradingAmountB: { type: Number, default: 0 },
  tokenAPrice: { type: Number, required: true },
  tokenBPrice: { type: Number, required: true },
  market: { type: String, default: '' },
  question: { type: String, required: true },
  value: { type: Number, required: true },
  range: { type: Number, required: true },
  date: { type: String, required: true },
  marketStatus: { type: String, required: true },
  feedName: { type: String, required: true },
  imageUrl: { type: String, required: true },
  description: { type: String, required: true },
  feedkey: { type: String, default: '' },
  isYes: { type: Boolean, default: false },
  feed: { type: String },
  playerA: {
    type: [
      {
        player: { type: String, required: true },
        amount: { type: Number, required: true },
      },
    ],
    default: [],
  },
  playerB: {
    type: [
      {
        player: { type: String, required: true },
        amount: { type: Number, required: true },
      },
    ],
    default: [],
  },
  investors: {
    type: [
      {
        investor: { type: String, required: true },
        amount: { type: Number, required: true },
      },
    ],
    default: [],
  },
  createdAt: { type: String, default: () => Date.now().toString() },
});

export default mongoose.models.Market || mongoose.model<IMarket>('Market', MarketSchema);
