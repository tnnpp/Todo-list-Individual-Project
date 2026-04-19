'use client'
import { Button } from "./ui/button";
import { MdDeleteOutline } from "react-icons/md";
import { FaCaretDown } from "react-icons/fa";
import { PencilLine } from "lucide-react";
import { useEffect, useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

export default function ItemCard({ data, refetchItems }) {
    const colorSchema = {
        todo: { container: "border-slate-200 bg-white", accent: "bg-slate-500" },
        inProgress: { container: "border-blue-200 bg-blue-50/60", accent: "bg-blue-500" },
        done: { container: "border-emerald-200 bg-emerald-50/70", accent: "bg-emerald-500" },
    };
    const priorityStyles = {
        low: "bg-emerald-100 text-emerald-700",
        medium: "bg-amber-100 text-amber-700",
        high: "bg-rose-100 text-rose-700",
    };
    const statusLabels = {
        todo: "To Do",
        inProgress: "In Progress",
        done: "Done",
    };
    const [status, setStatus] = useState(data.status);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [formData, setFormData] = useState({
        name: data.name,
        description: data.description || "",
        priority: data.priority || "medium",
    });

    useEffect(() => {
        setStatus(data.status);
        setFormData({
            name: data.name,
            description: data.description || "",
            priority: data.priority || "medium",
        });
    }, [data]);

    const { container, accent } = colorSchema[status] || colorSchema.todo;

    const handleStatusChange = async (newStatus) => {
        const previousStatus = status;
        setStatus(newStatus);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/item/update/${data._id}?status=${newStatus}`, {
                method: 'PUT',
            });

            const result = await res.json();

            if (res.ok) {
                toast.success("Task status updated.");
                if (refetchItems) refetchItems();
            } else {
                setStatus(previousStatus);
                toast.error(result.message || "Failed to update status.");
            }
        } catch (err) {
            setStatus(previousStatus);
            toast.error("Failed to update status.");
        }
    };

    const handleDelete = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/item/delete/${data._id}`, {
                method: 'DELETE',
            });
            const result = await res.json();

            if (res.ok) {
                toast.success("Task deleted.");
                if (refetchItems) refetchItems();
            } else {
                toast.error(result.message || "Failed to delete task.");
            }
        } catch (err) {
            toast.error("Failed to delete task.");
        }
    };

    const handleEditSave = async (event) => {
        event.preventDefault();

        if (!formData.name.trim()) {
            toast.error("Task name is required.");
            return;
        }

        setIsUpdating(true);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/item/update/${data._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name.trim(),
                    description: formData.description.trim(),
                    priority: formData.priority,
                }),
            });

            const result = await res.json();

            if (!res.ok) {
                toast.error(result.message || "Failed to update task.");
                return;
            }

            toast.success("Task updated.");
            setIsEditOpen(false);
            if (refetchItems) refetchItems();
        } catch (err) {
            toast.error("Failed to update task.");
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className={`w-full rounded-2xl border p-5 shadow-sm transition hover:shadow-md ${container}`}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${accent}`} />
                        <h2 className="text-lg font-semibold text-slate-900">{data.name}</h2>
                        <span className="rounded-full bg-slate-900/5 px-2.5 py-1 text-xs font-medium text-slate-600">
                            {statusLabels[status] || "To Do"}
                        </span>
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${priorityStyles[data.priority] || priorityStyles.medium}`}>
                            {data.priority || "medium"} priority
                        </span>
                    </div>

                    {data.description ? (
                        <p className="max-w-2xl text-sm leading-6 text-slate-600">{data.description}</p>
                    ) : (
                        <p className="text-sm italic text-slate-400">No description added.</p>
                    )}

                    <p className="text-xs text-slate-400">Created {data.createdAt}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="cursor-pointer">
                                <PencilLine />
                                Edit
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-lg">
                            <DialogHeader>
                                <DialogTitle>Edit Task</DialogTitle>
                                <DialogDescription>
                                    Update the task name, description, and priority.
                                </DialogDescription>
                            </DialogHeader>

                            <form onSubmit={handleEditSave} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Name</label>
                                    <Input
                                        value={formData.name}
                                        onChange={(event) =>
                                            setFormData((current) => ({ ...current, name: event.target.value }))
                                        }
                                        className="h-11 border-slate-200 bg-white"
                                        placeholder="Enter task name"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(event) =>
                                            setFormData((current) => ({ ...current, description: event.target.value }))
                                        }
                                        className="min-h-28 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                        placeholder="Describe this task"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Priority</label>
                                    <select
                                        value={formData.priority}
                                        onChange={(event) =>
                                            setFormData((current) => ({ ...current, priority: event.target.value }))
                                        }
                                        className="h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isUpdating}
                                    className="h-11 w-full bg-[#7C3AED] text-white hover:bg-[#6D28D9]"
                                >
                                    {isUpdating ? "Saving..." : "Save Changes"}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className='cursor-pointer'>
                                Status
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

                    <Button
                        variant="ghost"
                        className="cursor-pointer text-slate-500 hover:bg-rose-50 hover:text-rose-500"
                        onClick={handleDelete}
                    >
                        <MdDeleteOutline size={22} />
                    </Button>
                </div>
            </div>
        </div>
    );
}
