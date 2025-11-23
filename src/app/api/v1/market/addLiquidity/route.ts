import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/db";
import MarketModel from "@/lib/models/market";

export async function POST(req: NextRequest) {
  try {
    await connectMongoDB();

    const { investor, amount, market_id } = await req.json();

    const result = await MarketModel.findByIdAndUpdate(
      market_id,
      { $push: { investors: { investor, amount } } },
      { new: true }
    );

    console.log("new update add liquidity:", result);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.log("add liquidity error:", error);
    return NextResponse.json(
      { error: "Something went wrong add liquidity." },
      { status: 500 }
    );
  }
}
