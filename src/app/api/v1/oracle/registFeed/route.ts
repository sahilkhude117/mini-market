import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/db";
import { proposeValidator } from "@/lib/middleware/validators";

export async function POST(req: NextRequest) {
  try {
    await connectMongoDB();

    const body = await req.json();

    // Validate the request
    const validation = proposeValidator(body);
    if (!validation.valid) {
      return NextResponse.json(validation.error, { status: validation.status });
    }

    const { feedName, dataLink, task } = body.data;

    // TODO: Implement customizeFeed functionality when needed
    // const cluster = process.env.CLUSTER === "Mainnet" ? "Mainnet" : "Devnet";
    // await customizeFeed({ url: dataLink, task, name: feedName, cluster });

    return NextResponse.json(
      { message: "Feed registration successful!" },
      { status: 200 }
    );
  } catch (error) {
    console.log("error:", error);
    return NextResponse.json(
      { error: "Something went wrong fee registration!" },
      { status: 500 }
    );
  }
}
