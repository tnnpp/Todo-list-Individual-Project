"use server"
import { NextResponse } from "next/server";
import dbConnect from '@/lib/mongodb';
import Item from "@/models/Item";

export async function DELETE(req, context) {
  const { id } = await context.params;
  
  try {
    await dbConnect();
    const item = await Item.findById(id);

    if (!item) {
      return NextResponse.json({ message: "Invalid item" }, { status: 400 });
    }
    
    await item.deleteOne();

    return NextResponse.json({ message: "Item deleted successfully" }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
