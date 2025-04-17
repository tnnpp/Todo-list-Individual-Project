"use client"
import Image from "next/image";
import Navbar from "@/components/NavBar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa";
import ItemCard from "@/components/ItemCard";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function Dashboard() {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();

  useEffect(()=>{
    setIsLoading(true);
    if(session){
      fetchData()
    }
  }, [session])

  async function fetchData() {
    console.log(session.user.id)
    const response = await fetch(`http://localhost:3000/api/item/${session.user.id}/get`);
    const res = await response.json();
    setData(res.data || []);
    console.log(data)
    setIsLoading(false)
  }

  return (
    <div className="flex h-screen">
      <Navbar />
      <div className="flex items-center justify-center w-[85%] h-[100%]">
        <div className="w-[95%] h-[90%] overflow-clip">
          <div className="flex gap-4">
            <Input placeholder="Search Task"  className="bg-white border-1 border-[#3E1671]"/>
            <Button className="bg-[#9E78CF] w-20">
              <FaPlus />
            </Button>
            
          </div>
          {!isLoading ? (<div className="flex gap-5 w-full h-[100%]  overflow-clip">
            <div className="flex flex-col gap-4 mt-7 w-[33%] h-[100%]">
              <p className="text-[#15101C] text-2xl">To Do Items -</p>
              {data.map((i, index)=>(
                <ItemCard key={index} status={'todo'} data={i}/>
              ))}
            </div>
            <div className="flex flex-col gap-4 mt-7 w-[33%] h-[100%]">
              <p className="text-[#1A2A3E] text-2xl m">In Progress Items -</p>
              {data.map((i, index)=>(
                <ItemCard key={index} status={'inProgress'} data={i}/>
              ))}
            </div>
            <div className="flex flex-col gap-4 mt-7 w-[33%] h-[100%]">
              <p className="text-[#1D3A2E] text-2xl">Done Items -</p>
              {data.map((i, index)=>(
                <ItemCard key={index} status={'done'} data={i}/>
              ))}
            </div>

          </div>) : <div>loading</div>  }
          
        </div>
      </div>
    </div>
  );
}
