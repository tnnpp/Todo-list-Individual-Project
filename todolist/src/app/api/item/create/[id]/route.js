"use server"
import { NextResponse } from "next/server";
import { ensureDatabase, sql } from "@/lib/neon";

export async function POST(req, context) {
  const { id } = await context.params;
  const { name, description, priority } = await req.json();
  const validPriorities = new Set(["low", "medium", "high"]);
  const normalizedPriority = priority || "medium";

  if ( !name ) {
    return NextResponse.json({ message: "Missing name" }, { status: 400 });
  }
  if (!validPriorities.has(normalizedPriority)) {
    return NextResponse.json({ message: "Invalid priority" }, { status: 400 });
  }

  try {
    await ensureDatabase();
    const [existingUser] = await sql`
      SELECT id
      FROM users
      WHERE id = ${id}
      LIMIT 1
    `;

    if (!existingUser) {
      return NextResponse.json({ message: "Invalid user" }, { status: 400 });
    }
    await sql`
      INSERT INTO items (user_id, name, description, status, priority)
      VALUES (${id}, ${name}, ${description || null}, 'todo', ${normalizedPriority})
    `;

    return NextResponse.json({ message: "Item created successfully" }, { status: 201 });
  } catch (err) {
    console.log(err)
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

