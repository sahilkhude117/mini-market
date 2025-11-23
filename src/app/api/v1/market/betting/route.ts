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

    const {
      player,
      market_id,
      amount,
      isYes,
      token_a_amount,
      token_b_amount,
      token_a_price,
      token_b_price,
    } = await req.json();

    console.log(player, market_id, amount, isYes);

    const sol_amount = isYes ? token_a_price * amount : token_b_price * amount;

    const result = await MarketModel.findByIdAndUpdate(
      market_id,
      {
        $set: {
          tradingAmountA: token_a_amount,
          tradingAmountB: token_b_amount,
          tokenAPrice: token_a_price,
          tokenBPrice: token_b_price,
        },
        $push: isYes
          ? { playerA: { player, amount: sol_amount } }
          : { playerB: { player, amount: sol_amount } },
      },
      { new: true }
    );

    console.log("sol_amount:", sol_amount);
    await setReferralFee(player, sol_amount);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.log("betting error:", error);
    return NextResponse.json(
      { error: "Failed betting!" },
      { status: 500 }
    );
  }
}
