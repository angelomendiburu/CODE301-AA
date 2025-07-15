import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
}

export async function POST(request: Request) {
  return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
}
