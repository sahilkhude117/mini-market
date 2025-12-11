import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Market from '@/lib/models/Market';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    const { id, market, tokenA, tokenB, feedAddress } = body.data;

    console.log('📝 Adding market info:', { id, market });

    const result = await Market.updateOne(
      { _id: id },
      {
        $set: {
          market: market,
          tokenA: tokenA,
          tokenB: tokenB,
          marketStatus: 'PENDING',
          feedkey: feedAddress,
        },
      }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: 'Market not found or no changes made' },
        { status: 404 }
      );
    }

    console.log('✅ Market info updated successfully');

    return NextResponse.json(
      { success: true, result: 'success' },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Error adding market info:', error);
    return NextResponse.json(
      { error: 'Failed to update info! Please try again later.', details: (error as Error).message },
      { status: 500 }
    );
  }
}
