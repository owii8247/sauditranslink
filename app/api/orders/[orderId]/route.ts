import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';

export async function GET(req: NextRequest, { params }: { params: { orderId: string } }) {
    await connectDB();

    const { orderId } = params;

    try {
        const order = await Order.findById(orderId);
        //const order = await Order.findOne({ orderId });  // <-- Changed from `.findById()` to `.findOne()`

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        return NextResponse.json(order, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch order details' }, { status: 500 });
    }
}
