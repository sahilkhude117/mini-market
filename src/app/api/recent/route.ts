import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Recent from '@/lib/models/Recent';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '20');
    const marketId = searchParams.get('marketId');

    // Build query filter
    const match: any = {};
    if (marketId) {
      match.marketId = marketId;
    }

    // Get recent activities sorted by creation date
    const activities = await Recent.find(match)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json(
      { success: true, data: activities },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Error fetching recent activities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recent activities', details: (error as Error).message },
      { status: 500 }
    );
  }
}
