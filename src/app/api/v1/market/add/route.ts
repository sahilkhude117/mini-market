import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/db";
import MarketModel from "@/lib/models/market";

export async function POST(req: NextRequest) {
  try {
    await connectMongoDB();

    const { id, market, tokenA, tokenB, feedAddress } = (await req.json()).data;

    const result = await MarketModel.updateOne(
      { _id: id },
      {
        $set: {
          market: market,
          tokenA: tokenA,
          tokenB: tokenB,
          marketStatus: "PENDING",
          feedkey: feedAddress,
        },
      }
    );

    return NextResponse.json({ result: "success" }, { status: 200 });
  } catch (error) {
    console.log("add info error:", error);
    return NextResponse.json(
      { error: "Failed to update info! Please try again later." },
      { status: 500 }
    );
  }
}
