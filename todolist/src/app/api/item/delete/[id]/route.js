"use server"
import { NextResponse } from "next/server";
import { ensureDatabase, sql } from "@/lib/neon";

export async function DELETE(req, context) {
  const { id } = await context.params;
  
  try {
    await ensureDatabase();
    const [item] = await sql`
      DELETE FROM items
      WHERE id = ${id}
      RETURNING id
    `;

    if (!item) {
      return NextResponse.json({ message: "Invalid item" }, { status: 400 });
    }

    return NextResponse.json({ message: "Item deleted successfully" }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
