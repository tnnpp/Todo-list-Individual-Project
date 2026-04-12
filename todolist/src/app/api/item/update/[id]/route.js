"use server"
import { NextResponse } from "next/server";
import { ensureDatabase, sql } from "@/lib/neon";

export async function PUT(req, context) {
  const { id } = await context.params;
  const status = req.nextUrl.searchParams.get("status");
  const validStatuses = new Set(["todo", "inProgress", "done"]);
  if ( !status ) {
    return NextResponse.json({ message: "Missing status" }, { status: 400 });
  }
  if (!validStatuses.has(status)) {
    return NextResponse.json({ message: "Invalid status" }, { status: 400 });
  }

  try {
    await ensureDatabase();
    const [item] = await sql`
      UPDATE items
      SET status = ${status}
      WHERE id = ${id}
      RETURNING id
    `;

    if (!item) {
      return NextResponse.json({ message: "Invalid item" }, { status: 400 });
    }

    return NextResponse.json({ message: "Item update status successfully" }, { status: 200 });
  } catch (err) {
    console.log(err)
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

