import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/db";
import ReferModel from "@/lib/models/referral";
import { generateReferralCodeFromWallet } from "@/lib/utils/helpers";

export async function POST(req: NextRequest) {
  try {
    await connectMongoDB();

    const { wallet, referralCode } = await req.json();

    let referredLevel = 0;
    const info = await ReferModel.findOne({ wallet });

    let code = "";

    if (!info) {
      let wallet_refered = "";
      code = generateReferralCodeFromWallet(wallet as string);

      if (referralCode !== "") {
        const result = await ReferModel.findOneAndUpdate(
          { referralCode },
          { $push: { ids: wallet } }
        );

        if (result) {
          referredLevel = result?.referredLevel + 1;
          wallet_refered = result.wallet;
        } else {
          return NextResponse.json(
            { error: "Invalid Referral code!" },
            { status: 500 }
          );
        }
      }

      const data = new ReferModel({
        wallet,
        referralCode: code,
        wallet_refered,
        referredLevel,
      });

      await data.save();
    } else {
      code = info.referralCode;
    }

    const referrals = await ReferModel.find({
      wallet_refered: wallet,
    });

    return NextResponse.json({ code, referrals }, { status: 200 });
  } catch (error) {
    console.log("error:", error);
    return NextResponse.json(
      { error: "Something went wrong referral code generation!" },
      { status: 500 }
    );
  }
}
