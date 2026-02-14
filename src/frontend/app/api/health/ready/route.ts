import { NextResponse } from "next/server";

const API_URL = process.env.API_URL;

export async function GET() {
  if (!API_URL) {
    return new NextResponse("", { status: 503 });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(`${API_URL}/health/ready`, {
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (response.ok) {
      return new NextResponse("", { status: 200 });
    } else {
      return new NextResponse("", { status: 503 });
    }
  } catch {
    return new NextResponse("", { status: 503 });
  }
}
