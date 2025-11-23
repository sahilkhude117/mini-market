export const initialSettings = {
  creatorFeeAmount: 0.001 * 10 ** 9,
  marketCount: 0.1 * 10 ** 9,
  decimal: 9,
  fundFeePercentage: 1.5,
  bettingFeePercentage: 2.5
};

export const marketConfig = {
  tokenPrice: 0.5,
  tokenAmount: 100
};

export const marketField = [
  {
    name: "Coin Prediction Market",
    content: [
      {
        api_name: "Coingecho",
        needed_data: [
          {
            name: "vs_currency",
            placeholder: "usd"
          },
          {
            name: "id",
            placeholder: "solana"
          }
        ],
        task: null,
        api_link: (...args: string[]) => `https://api.coingecko.com/api/v3/simple/price?ids=${args[1]}&vs_currencies=${args[0]}`,
        market_keyword: (...args: string[]) => `id: ${args[1]}, vs_currency: ${args[0]}`,
      },
      {
        api_name: "Dexscreener",
        needed_data: [
          {
            name: "token",
            placeholder: "EGfWrQjqEexyPcZNUFGU8LypCikg34q2vqtk7hwBzWdS"
          }
        ],
        task: "$.pairs[0].priceUsd",
        api_link: (...args: string[]) => `https://api.dexscreener.com/latest/dex/tokens/${args[0]}`,
        market_keyword: (...args: string[]) => `token: ${args[0]}`,
      }
    ]
  },
];

export const backendSettings = {
  pageOffset: 10,
  expireTime: {
    initMarket: 1, // 1 Day
    pendingMarket: 7 // 7 Days
  } 
};
