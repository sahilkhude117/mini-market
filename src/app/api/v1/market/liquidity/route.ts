import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/db";
import MarketModel from "@/lib/models/market";
import ReferModel from "@/lib/models/referral";

// Helper function to set referral fee
async function setReferralFee(wallet: string, amount: number) {
  try {
    const refer = await ReferModel.findOne({ wallet });

    if (refer) {
      let fee = 0;
      if (refer.wallet_refered !== "") {
        switch (refer.referredLevel) {
          case 0:
            fee = refer.fee + amount * 0.005 * 0.7;
            break;
          case 1:
            fee = refer.fee + amount * 0.005 * 0.2;
            break;
          case 2:
            fee = refer.fee + amount * 0.005 * 0.1;
            break;
          default:
            fee = 0;
            break;
        }
      }

      refer.fee = fee;
      await refer.save();
    }
  } catch (error) {
    console.log("set referral fee error:", error);
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectMongoDB();

    const { market_id, amount, investor, active } = await req.json();
    console.log("status:", active);

    const liquidity_result = await MarketModel.findOneAndUpdate(
      { _id: market_id },
      {
        $set: {
          marketStatus: active ? "ACTIVE" : "PENDING",
        },
        $push: {
          investors: {
            investor,
            amount,
          },
        },
      }
    );

    await setReferralFee(investor, amount);

    return NextResponse.json({ result: "success" }, { status: 200 });
  } catch (error) {
    console.log("error:", error);
    return NextResponse.json(
      { error: "Failed to add liquidity! Please try again later." },
      { status: 500 }
    );
  }
}
