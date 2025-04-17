"use server"
import { NextResponse } from "next/server";
import dbConnect from '@/lib/mongodb';
import Item from "@/models/Item";

export async function PUT(req, context) {
  const { id } = await context.params;
  const status = req.nextUrl.searchParams.get("status");
  if ( !status ) {
    return NextResponse.json({ message: "Missing status" }, { status: 400 });
  }

  try {
    await dbConnect();
    const item = await Item.findById(id);

    if (!item) {
      return NextResponse.json({ message: "Invalid item" }, { status: 400 });
    }
    
    item.status = status;
    await item.save()

    return NextResponse.json({ message: "Item update status successfully" }, { status: 200 });
  } catch (err) {
    console.log(err)
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

