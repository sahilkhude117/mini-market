import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Market from '@/lib/models/Market';
import { marketConfig } from '@/lib/config';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    const {
      marketField,
      apiType,
      question,
      task,
      date,
      value,
      range,
      imageUrl,
      creator,
      feedName,
      description,
    } = body.data;

    console.log('🎯 Creating market:', { question, creator, task });

    // Ensure task is provided
    if (!task || task.trim() === '') {
      return NextResponse.json(
        { error: 'Task field is required for market creation' },
        { status: 400 }
      );
    }

    const marketData = new Market({
      marketField,
      apiType,
      task: task || 'default',
      creator,
      question,
      value,
      range,
      date,
      marketStatus: 'INIT',
      imageUrl,
      feedName,
      description,
      tokenAPrice: marketConfig.tokenPrice,
      tokenBPrice: marketConfig.tokenPrice,
      initAmount: marketConfig.tokenAmount,
    });

    const db_result = await marketData.save();
    console.log('✅ Created init market data on db:', db_result.id);

    return NextResponse.json(
      {
        success: true,
        message: 'Feed registration successful!',
        result: db_result.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Error creating market:', error);
    return NextResponse.json(
      { error: 'Failed to create market! Please try again later.', details: (error as Error).message },
      { status: 500 }
    );
  }
}
