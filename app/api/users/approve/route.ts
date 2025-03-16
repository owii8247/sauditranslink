import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { sendApprovalMail } from '@/lib/mailer';

export async function POST(req: NextRequest) {
    await connectDB();
    const { id } = await req.json();

    const user = await User.findByIdAndUpdate(id, { isApproved: true }, { new: true });
    if (user) await sendApprovalMail(user.email);

    return NextResponse.json({ success: true });
}
