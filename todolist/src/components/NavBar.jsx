'use client'
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { Button } from "./ui/button";
export default function Navbar() {
    const { data: session } = useSession();

    if (!session) {
        return null;
    }
    
    return (
        <aside className="sticky top-0 flex h-screen w-72 flex-col justify-between border-r border-white/70 bg-white/85 px-8 py-10 shadow-sm backdrop-blur">
            <div className="space-y-4">
                <div>
                    <p className="text-sm font-medium uppercase tracking-[0.2em] text-violet-600">Workspace</p>
                    <h1 className="mt-3 text-3xl font-semibold text-slate-900">Welcome back</h1>
                    <h2 className="mt-2 text-lg text-slate-500">{session.user.username}</h2>
                </div>

                <div className="rounded-2xl bg-violet-50 p-4 text-sm text-slate-600">
                    Manage tasks, set priority levels, and keep work moving across each stage.
                </div>
            </div>

            <Button
                onClick={() => signOut()}
                className="h-11 w-full cursor-pointer bg-slate-900 text-white hover:bg-slate-800"
            >
                Sign Out
            </Button>
        </aside>
    );
}