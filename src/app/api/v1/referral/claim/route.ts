import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/db";
import ReferModel from "@/lib/models/referral";

// TODO: Import claimFee from prediction_market_sdk when available
// import { claimFee } from "@/lib/prediction-sdk";

export async function POST(req: NextRequest) {
  try {
    await connectMongoDB();

    const { wallet, amount } = await req.json();

    // TODO: Implement claimFee when SDK is integrated
    // await claimFee(wallet, amount);

    const info = await ReferModel.findOneAndUpdate(
      { wallet },
      { fee: 0 }
    );

    return NextResponse.json({ message: "success" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "failed claim" },
      { status: 500 }
    );
  }
}
