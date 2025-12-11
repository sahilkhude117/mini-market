import mongoose from 'mongoose';

export interface IReferral {
  wallet: string;
  referralCode: string;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED';
  fee: number;
  referredLevel: number;
  wallet_refered: string;
  createdAt: string;
}

const ReferralSchema = new mongoose.Schema<IReferral>({
  wallet: { type: String, required: true },
  referralCode: { type: String, required: true },
  status: { type: String, default: 'PENDING' },
  fee: { type: Number, default: 0 },
  referredLevel: { type: Number, required: true },
  wallet_refered: { type: String, default: '' },
  createdAt: { type: String, default: () => Date.now().toString() },
});

export default mongoose.models.Referral || mongoose.model<IReferral>('Referral', ReferralSchema);
