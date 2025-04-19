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
      <div className="hidden lg:block ">
        <Navbar />
      </div>
      <div className="flex items-center  justify-center w-[100%] h-[100%]">
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
            <div className="flex flex-col lg:flex-row gap-5 w-full h-[100%]">
              <div className="flex flex-col  gap-4 mt-7 lg:w-[33%] h-[100%]">
                <p className="text-[#15101C] text-2xl">To Do Items</p>
                {todoItems.map((i, index) => (
                  <ItemCard key={index} data={i} refetchItems={fetchData} />
                ))}
              </div>
              <div className="flex flex-col gap-4 mt-7  lg:w-[33%] h-[100%]">
                <p className="text-[#1A2A3E] text-2xl">In Progress Items</p>
                {inProgressItems.map((i, index) => (
                  <ItemCard key={index}  data={i} refetchItems={fetchData} />
                ))}
              </div>
              <div className="flex flex-col gap-4 mt-7 lg:w-[33%] h-[100%]">
                <p className="text-[#1D3A2E] text-2xl">Done Items</p>
                {doneItems.map((i, index) => (
                  <ItemCard key={index}  data={i} refetchItems={fetchData} />
                ))}
              </div>
            </div>
          ) : <div className="text-center mt-32 px-5 py-2 w-full md:w-[80vw]">
          <div role="status">
            <svg
              aria-hidden="true"
              className="inline w-32 h-32 text-gray-200 animate-spin dark:text-gray-600 fill-green-500"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        </div>}
        </div>
      </div>
    </div>
  );
}
