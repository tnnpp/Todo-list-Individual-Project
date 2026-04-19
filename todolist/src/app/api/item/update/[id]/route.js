"use server"
import { NextResponse } from "next/server";
import { ensureDatabase, sql } from "@/lib/neon";

export async function PUT(req, context) {
  const { id } = await context.params;
  const status = req.nextUrl.searchParams.get("status");
  const validStatuses = new Set(["todo", "inProgress", "done"]);
  const validPriorities = new Set(["low", "medium", "high"]);

  try {
    await ensureDatabase();

    let item;

    if (status) {
      if (!validStatuses.has(status)) {
        return NextResponse.json({ message: "Invalid status" }, { status: 400 });
      }

      [item] = await sql`
        UPDATE items
        SET status = ${status}
        WHERE id = ${id}
        RETURNING id
      `;
    } else {
      const { name, description, priority } = await req.json();

      if (!name?.trim()) {
        return NextResponse.json({ message: "Missing name" }, { status: 400 });
      }

      if (!validPriorities.has(priority)) {
        return NextResponse.json({ message: "Invalid priority" }, { status: 400 });
      }

      [item] = await sql`
        UPDATE items
        SET
          name = ${name.trim()},
          description = ${description?.trim() || null},
          priority = ${priority}
        WHERE id = ${id}
        RETURNING id
      `;
    }

    if (!item) {
      return NextResponse.json({ message: "Invalid item" }, { status: 400 });
    }

    return NextResponse.json(
      { message: status ? "Item status updated successfully" : "Item updated successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.log(err)
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

