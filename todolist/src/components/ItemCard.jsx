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
import toast, { Toaster } from 'react-hot-toast';

export default function ItemCard({ data, refetchItems }) {
    const colorSchema = {
        todo: { cardColor: '#15101C', textColor: '#9E78CF' },
        inProgress: { cardColor: '#1A2A3E', textColor: '#7891CF' },
        done: { cardColor: '#1D3A2E', textColor: '#78CFB0' },
    };
    const [status, setStatus] = useState(data.status);

    const { cardColor, textColor } = colorSchema[data.status] || colorSchema.todo;

    const handleStatusChange = async (newStatus) => {
        setStatus(newStatus); 

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/item/update/${data._id}?status=${newStatus}`, {
                method: 'PUT',
            });

            const result = await res.json();
            console.log(result.message);

            if (res.ok) {
                toast.success("Successfully change status!")
                // Refetch items immediately after status change
                if (refetchItems) refetchItems();
            } else {
                console.error("Failed to update status:", result.message);
            }
        } catch (err) {
            console.error('Error updating status:', err);
        }
    };

    const handleDelete = async () =>{
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/item/delete/${data._id}`, {
                method: 'DELETE',
            });
            const result = await res.json();
            console.log(result.message);

            if (res.ok) {
                toast.success("Successfully delete!")
                if (refetchItems) refetchItems();
            } else {
                console.error("Failed to delete status:", result.message);
            }
        }catch (err) {
        console.error('Error delete status:', err);
     }
    }

    return (
        <div
            className="flex items-center justify-between overflow-y-auto overflow-x-clip w-full py-5 rounded-2xl"
            style={{ backgroundColor: cardColor, color: textColor }}
        >
            <Toaster/>
            <div className="mx-10">
                <h2 className="text-2xl">{data.name}</h2>
                <p>{data.description || ""}</p>
            </div>
            <div className="flex mx-10 items-center gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className='bg-transparent cursor-pointer'>
                            <FaCaretDown />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>Status</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuRadioGroup value={status} onValueChange={handleStatusChange}>
                            <DropdownMenuRadioItem value="todo">To Do</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="inProgress">In Progress</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="done">Done</DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
                <Button className="cursor-pointer bg-transparent hover:text-red-400 hover:bg-transparent" onClick={() => handleDelete()}>
                    <MdDeleteOutline size={24} />
                </Button>
            </div>
        </div>
    );
}
