import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Referral from '@/lib/models/Referral';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    const { wallet, referralCode, referredLevel, wallet_refered } = body;

    console.log('🔗 Creating referral:', { wallet, referralCode });

    const referral = new Referral({
      wallet,
      referralCode,
      referredLevel: referredLevel || 1,
      wallet_refered: wallet_refered || '',
      status: 'PENDING',
      fee: 0,
    });

    const result = await referral.save();

    return NextResponse.json(
      { success: true, data: result },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Error creating referral:', error);
    return NextResponse.json(
      { error: 'Failed to create referral', details: (error as Error).message },
      { status: 500 }
    );
  }
}

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

    const referral = await Referral.findOne({ wallet });

    if (!referral) {
      return NextResponse.json(
        { success: true, data: null },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { success: true, data: referral },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Error fetching referral:', error);
    return NextResponse.json(
      { error: 'Failed to fetch referral', details: (error as Error).message },
      { status: 500 }
    );
  }
}
