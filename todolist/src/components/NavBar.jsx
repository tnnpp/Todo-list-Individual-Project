'use client'
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { Button } from "./ui/button";
export default function Navbar({className}){
    const { data: session } = useSession();

    if (!session) {
        return <p>Loading session</p>;
      }
    
    return(
        <div className="flex flex-col justify-between h-screen w-[15vw] bg-white">
            <div>
            <h1 className="ml-10 mt-10">Welcome</h1>
            <h2 className="ml-10 mt-5 text-2xl">{session.user.username} !</h2>
            </div>
            <Button 
                onClick={() => signOut()} 
                className="px-4 py-5 w-[30%] my-5 ml-10 hover:bg-indigo-600 cursor-pointer"
            >
                Sign Out
            </Button>
        </div>
    )
}