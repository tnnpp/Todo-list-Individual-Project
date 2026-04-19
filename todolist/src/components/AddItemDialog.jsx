"use client";
import { useRef } from "react";
import { FaPlus } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const priorityOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

export default function AddItemDialog({ userId, refetchItems }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      priority: "medium",
    },
  });
  const dialogCloseRef = useRef(null);

  const onSubmit = async (data) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/item/create/${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      toast.error(result.message || "Something went wrong!");
      return;
    }

    toast.success("Successfully added task item!");
    reset();
    if (refetchItems) refetchItems();
    dialogCloseRef.current?.click(); 
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="h-11 min-w-32 bg-[#7C3AED] text-white hover:bg-[#6D28D9]">
          <FaPlus />
          Add Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Task</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new task.
          </DialogDescription>
        </DialogHeader>

        <form id="applicationForm" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Name</label>
            <Input
              className="h-11 border-slate-200 bg-white"
              placeholder="Enter task name"
              {...register("name", { required: "Task name is required", maxLength: 50 })}
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Description</label>
            <textarea
              className="min-h-28 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              placeholder="Add more details about this task"
              {...register("description", { required: false, maxLength: 200 })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Priority</label>
            <select
              className="h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              {...register("priority")}
            >
              {priorityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-11 w-full bg-[#7C3AED] text-white hover:bg-[#6D28D9]"
          >
            {isSubmitting ? "Saving..." : "Create Task"}
          </Button>
        </form>

        <DialogClose asChild>
          <button ref={dialogCloseRef} className="hidden" />
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
