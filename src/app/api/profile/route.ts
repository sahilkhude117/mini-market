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

    const profile = {
      wallet,
      totalBets: totalBetsYes + totalBetsNo,
      totalBetsYes,
      totalBetsNo,
      totalInvested,
      activeBets,
      wonBets,
      lostBets,
      winRate: activeBets > 0 ? ((wonBets / (wonBets + lostBets)) * 100).toFixed(2) : 0,
      markets: markets.length,
    };

    return NextResponse.json(
      { success: true, data: profile },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile', details: (error as Error).message },
      { status: 500 }
    );
  }
}
