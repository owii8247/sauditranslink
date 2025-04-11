import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';


export async function GET() {
    await connectDB();
  
    try {
      const orders = await Order.find().sort({ createdAt: -1 }); // Sort by newest first
      return NextResponse.json(orders, { status: 200 });
    } catch {
      return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
  }
  