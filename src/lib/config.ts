export const marketConfig = {
  tokenPrice: 0.01,
  tokenAmount: 1000,
  range: 100,
  creatorFeeAmount: 0.001,
  fundFeePercentage: 1.5,
  bettingFeePercentage: 2.5,
  pageOffset: 10,
  expireTime: {
    initMarket: 1, // 1 Day
    pendingMarket: 7, // 7 Days
  },
};

export const initialSettings = {
  creatorFeeAmount: 0.001 * 10 ** 9,
  marketCount: 0.1 * 10 ** 9,
  decimal: 9,
  fundFeePercentage: 1.5,
  bettingFeePercentage: 2.5,
};
