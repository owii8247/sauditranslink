import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';

export async function POST(req: NextRequest) {
    await connectDB();
    const order = await req.json();
    const newOrder = await Order.create(order);

    return NextResponse.json(newOrder);
}
