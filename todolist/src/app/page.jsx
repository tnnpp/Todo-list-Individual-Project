"use client"
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  
  const handleStart = () => {
    router.push("/login");
  };
  return (
    <div className="w-screen h-screen flex flex-col gap-5 !bg-purple-300  bg-gradient-to-r from-blue-500 items-center justify-center">
       <h1 className="!font-bold text-w">Todo List Web Application</h1>
       <Button className="text-xl hover:bg-indigo-600 cursor-pointer" onClick={handleStart}>
          <h2 className="">Get Start!</h2>
        </Button>
    </div>
  );
}
