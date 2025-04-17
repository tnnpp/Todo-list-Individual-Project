'use client'
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { Button } from "./ui/button";
export default function ItemCard({textColor, cardColor, data}){
    return(
        <div className={`flex w-full h-[10vh] bg-${cardColor}`}>
            sd
        </div>
    )
}