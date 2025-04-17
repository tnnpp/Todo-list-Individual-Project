"use server"
import Item from "@/models/Item";
import dbConnect from "@/lib/mongodb";
import { NextResponse } from "next/server";
export async function GET(request, context) {
    const { id } = await context.params;
    try{
        await dbConnect();
        const data = await Item.find({ 'userId': id });
        if (data) {
            const formattedData = data.map(item => ({
                ...item.toObject(),
                createdAt:  new Date(item.createdAt).toLocaleDateString('en-GB')
            }));
            return NextResponse.json({ data: formattedData });
        }
        return NextResponse.json({ message: `Item not found` });
    } catch (error){
        return NextResponse.json({ message: error });  
    }  
}
