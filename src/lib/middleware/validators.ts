import { NextRequest, NextResponse } from "next/server";

export function proposeValidator(body: any) {
  const { isChecked, data } = body;
  const propose = { ...data };

  let errorCount = 0;

  if (propose) {
    for (const key in propose) {
      if (propose[key] === "") {
        propose[key] = "empty";
        errorCount++;
      } else {
        propose[key] = "";
      }
    }

    if (propose.feedName && propose.feedName.length > 32) {
      propose.feedName = "too long";
      errorCount++;
    }
  }

  if (errorCount > 0) {
    return {
      valid: false,
      error: propose,
      status: 401
    };
  }

  if (!isChecked) {
    return {
      valid: false,
      error: {
        checkbox: "Please check the box to agree to the terms and conditions."
      },
      status: 401
    };
  }

  return { valid: true };
}
