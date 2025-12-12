import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Market from '@/lib/models/Market';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const wallet = searchParams.get('wallet');

    if (!wallet) {
      return NextResponse.json(
        { error: 'Wallet address required' },
        { status: 400 }
      );
    }

    console.log('👤 Fetching profile for:', wallet);

    // Get markets where user has placed bets
    const markets = await Market.find({
      $or: [
        { 'playerA.player': wallet },
        { 'playerB.player': wallet },
        { 'investors.investor': wallet },
      ],
    }).sort({ createdAt: -1 });

    // Calculate user statistics
    let totalBetsYes = 0;
    let totalBetsNo = 0;
    let totalInvested = 0;
    let activeBets = 0;
    let wonBets = 0;
    let lostBets = 0;

    markets.forEach((market: any) => {
      // Check player A (YES bets)
      const yesPosition = market.playerA.find((p: any) => p.player === wallet);
      if (yesPosition) {
        totalBetsYes += yesPosition.amount;
        if (market.marketStatus === 'ACTIVE' || market.marketStatus === 'PENDING') {
          activeBets++;
        } else if (market.marketStatus === 'RESOLVED' && market.isYes) {
          wonBets++;
        } else if (market.marketStatus === 'RESOLVED' && !market.isYes) {
          lostBets++;
        }
      }

      // Check player B (NO bets)
      const noPosition = market.playerB.find((p: any) => p.player === wallet);
      if (noPosition) {
        totalBetsNo += noPosition.amount;
        if (market.marketStatus === 'ACTIVE' || market.marketStatus === 'PENDING') {
          activeBets++;
        } else if (market.marketStatus === 'RESOLVED' && !market.isYes) {
          wonBets++;
        } else if (market.marketStatus === 'RESOLVED' && market.isYes) {
          lostBets++;
        }
      }

      // Check investments
      const investment = market.investors.find((i: any) => i.investor === wallet);
      if (investment) {
        totalInvested += investment.amount;
      }
    });

    // Get proposed markets (markets created by this user)
    const proposedMarkets = await Market.find({ creator: wallet }).sort({ createdAt: -1 });

    // Format betting history
    const bettingHistory = markets.map((market: any) => {
      const yesPosition = market.playerA.find((p: any) => p.player === wallet);
      const noPosition = market.playerB.find((p: any) => p.player === wallet);
      
      let answer = '';
      let amount = 0;
      let percentage = 0;
      
      if (yesPosition) {
        answer = 'Yes';
        amount = yesPosition.amount;
        const totalYes = market.playerA.reduce((sum: number, p: any) => sum + p.amount, 0);
        const totalNo = market.playerB.reduce((sum: number, p: any) => sum + p.amount, 0);
        percentage = totalYes + totalNo > 0 ? (totalYes / (totalYes + totalNo)) * 100 : 0;
      } else if (noPosition) {
        answer = 'No';
        amount = noPosition.amount;
        const totalYes = market.playerA.reduce((sum: number, p: any) => sum + p.amount, 0);
        const totalNo = market.playerB.reduce((sum: number, p: any) => sum + p.amount, 0);
        percentage = totalYes + totalNo > 0 ? (totalNo / (totalYes + totalNo)) * 100 : 0;
      }
      
      return {
        imageUrl: market.imageUrl,
        question: market.question,
        status: market.marketStatus === 'RESOLVED' 
          ? (market.isYes && answer === 'Yes') || (!market.isYes && answer === 'No') ? 'Won' : 'Lost'
          : 'Ongoing',
        percentage: percentage.toFixed(0) + '%',
        answer,
        amount: amount.toString(),
      };
    }).filter((item: any) => item.answer !== '');

    // Format funded markets (markets where user is an investor)
    const fundedMarkets = markets.filter((market: any) => 
      market.investors.some((i: any) => i.investor === wallet)
    ).map((market: any) => {
      const investment = market.investors.find((i: any) => i.investor === wallet);
      const totalInvestment = market.investors.reduce((sum: number, i: any) => sum + i.amount, 0);
      const percentage = totalInvestment > 0 ? (investment.amount / totalInvestment) * 100 : 0;
      
      return {
        image: market.imageUrl,
        title: market.question,
        status: market.marketStatus,
        betAmount: investment.amount,
        percentage: percentage.toFixed(0),
        value: '$' + (investment.amount * 1.1).toFixed(2), // Estimated value with 10% return
      };
    });

    // Format proposed markets
    const proposedMarket = proposedMarkets.map((market: any) => ({
      image: market.imageUrl,
      title: market.question,
      status: market.marketStatus,
      timeLeft: new Date(parseInt(market.date)).toISOString().split('T')[0],
      betAmount: totalInvested,
      totalAmount: market.initAmount,
    }));

    const profile = {
      wallet,
      totalBet: totalBetsYes + totalBetsNo,
      totalBetsYes,
      totalBetsNo,
      totalLiquidityProvided: totalInvested,
      earnedFeeLiquidity: totalInvested * 0.02, // 2% fee estimate
      earnedBet: wonBets * 10, // Estimate
      activeBet: activeBets,
      wonBets,
      lostBets,
      totalProposedMarket: proposedMarkets.length,
      totalreferrals: 0,
      winRate: activeBets > 0 ? ((wonBets / (wonBets + lostBets)) * 100).toFixed(2) : 0,
      markets: markets.length,
      bettingHistory,
      fundedMarkets,
      proposedMarket,
    };

    return NextResponse.json(profile, { status: 200 });
  } catch (error) {
    console.error('❌ Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile', details: (error as Error).message },
      { status: 500 }
    );
  }
}
