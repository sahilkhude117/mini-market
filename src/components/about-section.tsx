export default function AboutSection() {
  return (
    <section aria-labelledby="about-mini-market" className="mt-10">
      <div className="group p-[3px] rounded-2xl bg-gradient-to-r from-[#0b1f3a] via-[#174a8c] to-[#6b5b95]">
        <div className="h-full bg-white rounded-[calc(1rem-3px)] border-4 border-black p-5 md:p-7">
          <h2
            id="about-mini-market"
            className="text-2xl md:text-3xl font-extrabold text-[#0b1f3a] mb-3"
          >
            About Mini Market
          </h2>
          <div className="space-y-3 text-[#0b1f3a]">
            <p>
              Mini Market is a decentralized prediction market platform built on Solana.
              We enable users to create and trade on binary outcome markets, allowing the
              wisdom of the crowd to predict future events.
            </p>
            <p className="font-semibold">How it works:</p>
            <ol className="list-decimal pl-6 space-y-1">
              <li>
                Anyone can create a market by defining a question, providing initial
                liquidity, and setting a resolution date.
              </li>
              <li>
                Traders buy YES or NO shares based on their beliefs about the outcome.
                Prices adjust automatically based on trading activity.
              </li>
              <li>
                When the market reaches its resolution date, the outcome is determined
                and winners can claim their rewards.
              </li>
              <li>
                All transactions are settled on-chain using Solana for fast, low-cost trades.
              </li>
            </ol>
            <p className="font-semibold mt-4">Key Features:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>Transparent pricing:</strong> Market prices reflect real-time
                probability based on trader activity.
              </li>
              <li>
                <strong>Automated market maker:</strong> Built-in liquidity ensures
                you can always trade.
              </li>
              <li>
                <strong>On-chain settlement:</strong> Trustless resolution and payouts
                secured by the Solana blockchain.
              </li>
              <li>
                <strong>Low fees:</strong> Minimal trading fees with fast transaction
                finality.
              </li>
            </ul>
            <p className="mt-4">
              Whether you&apos;re forecasting market trends, sports outcomes, or any binary
              event, Mini Market provides a simple and secure way to put your predictions
              to the test.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
