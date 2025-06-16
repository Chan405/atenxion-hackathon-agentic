"use server";
import { NextRequest } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.status.toString().startsWith("2")) {
    console.log(response);
  }
}
