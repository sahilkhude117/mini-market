import mongoose from 'mongoose';

export interface IRecent {
  marketId: string;
  player: string;
  isFund: boolean;
  buyYes: boolean;
  buyNo: boolean;
  sellYes: boolean;
  sellNo: boolean;
  fundAmount: number;
  betAmount: number;
  createdAt: string;
}

const RecentSchema = new mongoose.Schema<IRecent>({
  marketId: { type: String, required: true },
  player: { type: String, required: true },
  isFund: { type: Boolean, default: false },
  buyYes: { type: Boolean, default: false },
  buyNo: { type: Boolean, default: false },
  sellYes: { type: Boolean, default: false },
  sellNo: { type: Boolean, default: false },
  fundAmount: { type: Number, default: 0 },
  betAmount: { type: Number, default: 0 },
  createdAt: { type: String, default: () => Date.now().toString() },
});

export default mongoose.models.Recent || mongoose.model<IRecent>('Recent', RecentSchema);
