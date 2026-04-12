import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { ensureDatabase, sql } from "@/lib/neon";

export async function POST(req: Request) {
  const { username, email, password } = await req.json();

  if ( !username ||!email || !password ) {
    return NextResponse.json({ message: "Missing fields" }, { status: 400 });
  }

  try {
    await ensureDatabase();
    const [existingUser] = await sql`
      SELECT id
      FROM users
      WHERE email = ${email}
      LIMIT 1
    `;

    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await sql`
      INSERT INTO users (username, email, password)
      VALUES (${username}, ${email}, ${hashedPassword})
    `;

    return NextResponse.json({ message: "User created successfully" }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

