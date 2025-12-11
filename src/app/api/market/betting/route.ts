import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Market from '@/lib/models/Market';
import Referral from '@/lib/models/Referral';
import Recent from '@/lib/models/Recent';

async function setReferralFee(wallet: string, amount: number) {
  try {
    const referral = await Referral.findOne({ wallet });
    if (referral) {
      const feeAmount = (amount * 2.5) / 100; // 2.5% betting fee
      await Referral.findByIdAndUpdate(referral._id, {
        $inc: { fee: feeAmount },
      });
    }
  } catch (error) {
    console.error('Error setting referral fee:', error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    const {
      player,
      market_id,
      amount,
      isYes,
      token_a_amount,
      token_b_amount,
      token_a_price,
      token_b_price,
    } = body;

    console.log('💰 Betting:', { player, market_id, amount, isYes });

    // Calculate SOL amount based on token price
    const sol_amount = isYes ? token_a_price * amount : token_b_price * amount;

    // Update market with bet
    const result = await Market.findByIdAndUpdate(
      market_id,
      {
        $set: {
          tradingAmountA: token_a_amount,
          tradingAmountB: token_b_amount,
          tokenAPrice: token_a_price,
          tokenBPrice: token_b_price,
        },
        $push: isYes
          ? { playerA: { player, amount: sol_amount } }
          : { playerB: { player, amount: sol_amount } },
      },
      { new: true }
    );

    // Create recent activity record
    await Recent.create({
      marketId: market_id,
      player,
      isFund: false,
      buyYes: isYes,
      buyNo: !isYes,
      betAmount: sol_amount,
      createdAt: Date.now().toString(),
    });

    // Update referral fees
    await setReferralFee(player, sol_amount);

    return NextResponse.json(
      { success: true, data: result },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Error placing bet:', error);
    return NextResponse.json(
      { error: 'Failed to place bet', details: (error as Error).message },
      { status: 500 }
    );
  }
}
