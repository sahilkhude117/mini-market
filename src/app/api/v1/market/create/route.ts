import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/db";
import MarketModel from "@/lib/models/market";
import ReferModel from "@/lib/models/referral";
import { proposeValidator } from "@/lib/middleware/validators";
import { marketConfig } from "@/lib/config";

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

    const body = await req.json();

    // Validate the request
    const validation = proposeValidator(body);
    if (!validation.valid) {
      return NextResponse.json(validation.error, { status: validation.status });
    }

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

    const marketData = new MarketModel({
      marketField,
      apiType,
      task,
      creator,
      question,
      value,
      range,
      date,
      marketStatus: "INIT",
      imageUrl,
      feedName,
      description,
      tokenAPrice: marketConfig.tokenPrice,
      tokenBPrice: marketConfig.tokenPrice,
      initAmount: marketConfig.tokenAmount,
    });

    const db_result = await marketData.save();
    console.log("Created init market data on db:", db_result.id.toString());

    return NextResponse.json(
      { message: "Feed registration successful!", result: db_result.id },
      { status: 200 }
    );
  } catch (error) {
    console.log("create market error:", error);
    return NextResponse.json(
      { error: "Failed to create market! Please try again later." },
      { status: 500 }
    );
  }
}
