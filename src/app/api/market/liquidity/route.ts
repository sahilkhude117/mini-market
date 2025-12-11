import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Market from '@/lib/models/Market';
import Referral from '@/lib/models/Referral';
import Recent from '@/lib/models/Recent';

async function setReferralFee(wallet: string, amount: number) {
  try {
    const referral = await Referral.findOne({ wallet });
    if (referral) {
      const feeAmount = (amount * 1.5) / 100; // 1.5% fund fee
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

    const { market_id, amount, investor, active } = body;

    console.log('💧 Adding liquidity:', { market_id, amount, investor, active });

    // Update market status and add investor
    const result = await Market.findOneAndUpdate(
      { _id: market_id },
      {
        $set: {
          marketStatus: active ? 'ACTIVE' : 'PENDING',
        },
        $push: {
          investors: {
            investor,
            amount,
          },
        },
      },
      { new: true }
    );

    if (!result) {
      return NextResponse.json(
        { error: 'Market not found' },
        { status: 404 }
      );
    }

    // Create recent activity record
    await Recent.create({
      marketId: market_id,
      player: investor,
      isFund: true,
      fundAmount: amount,
      createdAt: Date.now().toString(),
    });

    // Update referral fees
    await setReferralFee(investor, amount);

    console.log('✅ Liquidity added successfully');

    return NextResponse.json(
      { success: true, result: 'success' },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Error adding liquidity:', error);
    return NextResponse.json(
      { error: 'Failed to add liquidity! Please try again later.', details: (error as Error).message },
      { status: 500 }
    );
  }
}
