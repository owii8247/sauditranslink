import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';

export async function GET(req: NextRequest) {
    await connectDB();

    try {
        const orders = await Order.find();
        return NextResponse.json(orders, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}
