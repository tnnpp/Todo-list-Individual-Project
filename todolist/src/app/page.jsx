"use client"
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  
  const handleStart = () => {
    router.push("/login");
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#c4b5fd_0%,#dbeafe_38%,#f8fafc_100%)] px-4">
      <div className="w-full max-w-3xl rounded-[2rem] border border-white/70 bg-white/80 px-8 py-14 text-center shadow-xl backdrop-blur">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-violet-600">
          Todo List Web Application
        </p>
        <h1 className="mt-4 text-4xl font-bold text-slate-900 sm:text-5xl">
          Plan tasks with clearer priorities
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-600">
          Organize your work, focus on the most important tasks first, and track progress from to do to done.
        </p>
        <Button
          className="mt-8 h-11 px-8 text-base text-white hover:bg-indigo-600 cursor-pointer"
          onClick={handleStart}
        >
          Get Started
        </Button>
      </div>
    </div>
  );
}
