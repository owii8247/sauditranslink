import { NextRequest, NextResponse, RouteParams } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';


export async function GET(
  _req: NextRequest,
  { params }: { params: RouteParams<{ orderId: string }> } // Explicitly type params
) {
  await connectDB();

  const { orderId } = params;

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.error("Error fetching order:", error); // It's good practice to log errors
    return NextResponse.json({ error: 'Failed to fetch order details' }, { status: 500 });
  }
}