import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from '@/lib/mongodb';
import User from "@/models/User"; 
import toast from "react-hot-toast";

export async function POST(req: Request) {
  const { username, email, password } = await req.json();

  if ( !username ||!email || !password ) {
    return NextResponse.json({ message: "Missing fields" }, { status: 400 });
  }

  try {
    await dbConnect();
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      toast.error('User already exists')
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({ username, email, password: hashedPassword });

    return NextResponse.json({ message: "User created successfully" }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

