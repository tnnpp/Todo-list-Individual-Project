'use client'
import Image from "next/image";
import Navbar from "@/components/NavBar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa";
import ItemCard from "@/components/ItemCard";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import AddItemDialog from "@/components/AddItemDialog";
import toast, { Toaster } from 'react-hot-toast';
import Fuse from 'fuse.js'

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [id, setId] = useState("");
  const [data, setData] = useState([]);
  const [todoItems, setTodoItems] = useState([]);
  const [inProgressItems, setinProgressItems] = useState([]);
  const [doneItems, setDoneItems] = useState([]);
  const [query, setQuery] = useState('');
  const { data: session } = useSession();

  useEffect(() => {
    setIsLoading(true);
    if (session) {
      setId(session.user.id)
      fetchData()
    }
  }, [session])

  async function fetchData() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/item/get/${session.user.id}`);
    const res = await response.json();
    const items = res.data || [];
    setData(items);
    updateCategories(items);
    setIsLoading(false);
  }

  function updateCategories(items) {
    const todoData = items.filter((i) => i.status == "todo")
    setTodoItems(todoData || [])
    const inProgressData = items.filter((i) => i.status == "inProgress")
    setinProgressItems(inProgressData || [])
    const doneData = items.filter((i) => i.status == "done")
    setDoneItems(doneData || [])
  }

  const handleSearch = (value) => {
    setQuery(value);
    if (value.trim() === '') {
      setFilteredData(data); 
      updateCategories(data);
    } else {
      const fuse = new Fuse(data, {
        keys: ['name']
      });
      const searchResults = fuse.search(value);
      const results = searchResults.map((result) => result.item);
      updateCategories(results);
    }
  }

  return (
    <div className="flex h-screen">
      <Toaster />
      <Navbar />
      <div className="flex items-center justify-center w-[85%] h-[100%]">
        <div className="w-[95%] h-[90%] overflow-clip">
          <div className="flex gap-4">
            <Input
              placeholder="Search Task"
              className="bg-white border-1 border-[#3E1671]"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
            />
            <AddItemDialog userId={id} refetchItems={fetchData} />
          </div>

          {!isLoading ? (
            <div className="flex gap-5 w-full h-[100%]">
              <div className="flex flex-col gap-4 mt-7 w-[33%] h-[100%]">
                <p className="text-[#15101C] text-2xl">To Do Items</p>
                {todoItems.map((i, index) => (
                  <ItemCard key={index} data={i} refetchItems={fetchData} />
                ))}
              </div>
              <div className="flex flex-col gap-4 mt-7 w-[33%] h-[100%]">
                <p className="text-[#1A2A3E] text-2xl">In Progress Items</p>
                {inProgressItems.map((i, index) => (
                  <ItemCard key={index}  data={i} refetchItems={fetchData} />
                ))}
              </div>
              <div className="flex flex-col gap-4 mt-7 w-[33%] h-[100%]">
                <p className="text-[#1D3A2E] text-2xl">Done Items</p>
                {doneItems.map((i, index) => (
                  <ItemCard key={index}  data={i} refetchItems={fetchData} />
                ))}
              </div>
            </div>
          ) : <div>loading</div>}
        </div>
      </div>
    </div>
  );
}
