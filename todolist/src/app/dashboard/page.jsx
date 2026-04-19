'use client'
import Navbar from "@/components/NavBar";
import { Input } from "@/components/ui/input";
import ItemCard from "@/components/ItemCard";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import AddItemDialog from "@/components/AddItemDialog";
import toast, { Toaster } from 'react-hot-toast';
import Fuse from 'fuse.js';

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
    if (session) {
      setId(session.user.id);
      fetchData();
    }
  }, [session]);

  async function fetchData() {
    if (!session?.user?.id) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/item/get/${session.user.id}`);
      const res = await response.json();
      const items = res.data || [];
      setData(items);
      updateCategories(items);
    } catch (error) {
      toast.error("Unable to load tasks right now.");
    } finally {
      setIsLoading(false);
    }
  }

  function updateCategories(items) {
    const todoData = items.filter((i) => i.status === "todo");
    setTodoItems(todoData || []);
    const inProgressData = items.filter((i) => i.status === "inProgress");
    setinProgressItems(inProgressData || []);
    const doneData = items.filter((i) => i.status === "done");
    setDoneItems(doneData || []);
  }

  const handleSearch = (value) => {
    setQuery(value);
    if (value.trim() === '') {
      updateCategories(data);
    } else {
      const fuse = new Fuse(data, {
        keys: ['name', 'description', 'priority'],
        threshold: 0.35,
      });
      const searchResults = fuse.search(value);
      const results = searchResults.map((result) => result.item);
      updateCategories(results);
    }
  };

  const sections = [
    {
      title: "To Do",
      description: "Tasks that are ready to start.",
      items: todoItems,
      accent: "border-slate-200 bg-white/80",
    },
    {
      title: "In Progress",
      description: "Tasks currently being worked on.",
      items: inProgressItems,
      accent: "border-blue-200 bg-blue-50/70",
    },
    {
      title: "Done",
      description: "Tasks that have been completed.",
      items: doneItems,
      accent: "border-emerald-200 bg-emerald-50/70",
    },
  ];

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f6f0ff_0%,#eef4ff_100%)] lg:flex">
      <Toaster position="top-right" />
      <div className="hidden lg:block">
        <Navbar />
      </div>
      <div className="flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
          <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-sm backdrop-blur">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-violet-600">
                  Task Dashboard
                </p>
                <h1 className="text-3xl font-semibold text-slate-900">
                  Organize work by status and priority
                </h1>
                <p className="max-w-2xl text-sm text-slate-500">
                  Search tasks, update their status, and manage the most important work first.
                </p>
              </div>

              <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
                <Input
                  placeholder="Search by task, description, or priority"
                  className="h-11 min-w-0 border-slate-200 bg-white sm:min-w-80"
                  value={query}
                  onChange={(e) => handleSearch(e.target.value)}
                />
                <AddItemDialog userId={id} refetchItems={fetchData} />
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-500">
              <span className="rounded-full bg-slate-100 px-3 py-1">Total: {data.length}</span>
              <span className="rounded-full bg-slate-100 px-3 py-1">To Do: {todoItems.length}</span>
              <span className="rounded-full bg-slate-100 px-3 py-1">In Progress: {inProgressItems.length}</span>
              <span className="rounded-full bg-slate-100 px-3 py-1">Done: {doneItems.length}</span>
            </div>
          </div>

          {!isLoading ? (
            <div className="grid gap-5 xl:grid-cols-3">
              {sections.map((section) => (
                <section
                  key={section.title}
                  className={`rounded-3xl border p-5 shadow-sm ${section.accent}`}
                >
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold text-slate-900">{section.title}</h2>
                    <p className="text-sm text-slate-500">{section.description}</p>
                  </div>

                  <div className="flex flex-col gap-4">
                    {section.items.length > 0 ? (
                      section.items.map((item) => (
                        <ItemCard key={item._id} data={item} refetchItems={fetchData} />
                      ))
                    ) : (
                      <div className="rounded-2xl border border-dashed border-slate-200 bg-white/70 px-4 py-8 text-center text-sm text-slate-400">
                        No tasks in this section.
                      </div>
                    )}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-white/70 bg-white/80 px-5 py-16 text-center shadow-sm">
              <div role="status">
                <svg
                  aria-hidden="true"
                  className="mx-auto inline h-14 w-14 animate-spin fill-violet-500 text-slate-200"
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
                <p className="mt-4 text-sm text-slate-500">Loading your tasks...</p>
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
