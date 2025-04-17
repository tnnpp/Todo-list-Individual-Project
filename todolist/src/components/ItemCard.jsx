'use client'
import { Button } from "./ui/button";
import { MdDeleteOutline } from "react-icons/md";
import { FaCaretDown } from "react-icons/fa"
import { useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  
export default function ItemCard({status, data}){
    const colorSchema = {
        todo: { cardColor: '#15101C', textColor: '#9E78CF' },
        inProgress: { cardColor: '#1A2A3E', textColor: '#7891CF' },
        done: { cardColor: '#1D3A2E', textColor: '#78CFB0' },
      };
    const [statuss, setStatuss] = useState(status)
 
    const { cardColor, textColor } = colorSchema[status] || colorSchema.todo;
    return(
        
        <div
            className="flex items-center justify-between overflow-y-auto overflow-x-clip w-full h-[10vh] rounded-2xl"
            style={{ backgroundColor: cardColor, color: textColor }}
        >
            <div className="mx-10 ">
                <h2 className="text-2xl">{data.name}</h2>
                <p>{data.description}</p>
            </div>
            <div className="flex mx-10 items-center gap-2">
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className='bg-transparent className="cursor-pointer"'><FaCaretDown /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={statuss} onValueChange={setStatuss}>
                <DropdownMenuRadioItem value="todo">To Do</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="inProgress">In Progress</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="done">Done</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
            </DropdownMenu>
                <button className="cursor-pointer">
                   <MdDeleteOutline size={24}/>
                </button>
            </div>
            
            
        </div>
    )
}