"use server"
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from '@/lib/mongodb';
import User from "@/models/User"; 
import toast from "react-hot-toast";
import Item from "@/models/Item";

export async function POST(req, context) {
  const { id } = await context.params;
  const { name, description} = await req.json();

  if ( !name ) {
    return NextResponse.json({ message: "Missing name" }, { status: 400 });
  }

  try {
    await dbConnect();
    const existingUser = await User.findById(id);

    if (!existingUser) {
      return NextResponse.json({ message: "Invalid user" }, { status: 400 });
    }
    await Item.create({ userId:id, name, description, status:"todo" });

    return NextResponse.json({ message: "Item created successfully" }, { status: 201 });
  } catch (err) {
    console.log(err)
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

