"use server"
import { NextResponse } from "next/server";
import { ensureDatabase, sql } from "@/lib/neon";
export async function GET(request, context) {
    const { id } = await context.params;
    try{
        await ensureDatabase();
        const data = await sql`
            SELECT
                id AS "_id",
                user_id AS "userId",
                name,
                description,
                status,
                created_at AS "createdAt"
            FROM items
            WHERE user_id = ${id}
            ORDER BY created_at DESC
        `;
        if (data) {
            const formattedData = data.map(item => ({
                ...item,
                createdAt:  new Date(item.createdAt).toLocaleDateString('en-GB')
            }));
            return NextResponse.json({ data: formattedData });
        }
        return NextResponse.json({ message: `Item not found` });
    } catch (error){
        return NextResponse.json({ message: error });  
    }  
}
