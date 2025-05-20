import api from "@/lib/api";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const res = await api.get('/order');
    const orders = res.data;
      
    return NextResponse.json(orders, { status: 200 })
  } catch (error) {
    console.error("Error fetching user verification status:", error);

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
