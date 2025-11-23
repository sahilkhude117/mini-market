import { MarketFilter } from "../types";

export const buildMarketFilterQuery = (filters: MarketFilter) => {
  const query: any = {};

  if (filters.volumeMin !== undefined || filters.volumeMax !== undefined) {
    query.$or = [
      {
        $expr: {
          $and: [
            filters.volumeMin !== undefined ? { $gte: [{ $sum: "$playerA.amount" }, filters.volumeMin] } : {},
            filters.volumeMax !== undefined ? { $lte: [{ $sum: "$playerA.amount" }, filters.volumeMax] } : {}
          ].filter(f => Object.keys(f).length > 0)
        }
      }
    ];
  }

  if (filters.expiryStart || filters.expiryEnd) {
    query.date = {};
    if (filters.expiryStart) query.date.$gte = filters.expiryStart;
    if (filters.expiryEnd) query.date.$lte = filters.expiryEnd;
  }

  return query;
};

export const generateReferralCodeFromWallet = (wallet: string): string => {
  const crypto = require('crypto');
  const hash = crypto.createHash('sha256').update(wallet).digest('hex');
  return hash.slice(0, 8);
};
