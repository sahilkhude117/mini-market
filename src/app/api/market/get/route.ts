import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Market from '@/lib/models/Market';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const marketStatus = searchParams.get('marketStatus');
    const marketField = searchParams.get('marketField');

    const skip = (page - 1) * limit;

    // Build query filter
    const match: any = {};
    if (marketStatus) {
      match.marketStatus = marketStatus;
    }
    if (marketField) {
      match.marketField = parseInt(marketField);
    }

    // Aggregate query with calculated fields
    const results = await Market.aggregate([
      { $match: match },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $addFields: {
          playerACount: { $sum: '$playerA.amount' },
          playerBCount: { $sum: '$playerB.amount' },
          totalInvestment: { $sum: '$investors.amount' },
        },
      },
      {
        $project: {
          playerA: 0,
          playerB: 0,
          investors: 0,
        },
      },
    ]);

    const total = await Market.countDocuments(match);

    return NextResponse.json(
      {
        data: results,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Error fetching markets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch markets', details: (error as Error).message },
      { status: 500 }
    );
  }
}
