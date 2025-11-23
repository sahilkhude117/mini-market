import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/db";
import MarketModel from "@/lib/models/market";

export async function GET(req: NextRequest) {
  try {
    await connectMongoDB();

    const { searchParams } = new URL(req.url);
    const marketStatus = searchParams.get("marketStatus");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const skip = (page - 1) * limit;

    const match: any = {};
    if (marketStatus) {
      match.marketStatus = marketStatus;
    }

    const results = await MarketModel.aggregate([
      { $match: match },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $addFields: {
          playerACount: { $sum: "$playerA.amount" },
          playerBCount: { $sum: "$playerB.amount" },
          totalInvestment: { $sum: "$investors.amount" },
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

    const total = await MarketModel.countDocuments(match);

    return NextResponse.json(
      {
        data: results,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
      { status: 200 }
    );
  } catch (err) {
    console.log("get market data error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
