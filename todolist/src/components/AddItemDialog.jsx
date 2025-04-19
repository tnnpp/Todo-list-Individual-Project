"use client";
import { useRef } from "react";
import { FaPlus } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import toast, { Toaster } from 'react-hot-toast';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function AddItemDialog({ userId, refetchItems }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
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
      <Toaster />
      <DialogTrigger asChild>
        <Button className="bg-[#9E78CF] w-20">
          <FaPlus />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Item</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new task item.
          </DialogDescription>
        </DialogHeader>

        <form id="applicationForm" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Name</label>
            <Input
              className="bg-white border-1 border-[#3E1671]"
              placeholder="Enter task name"
              {...register("name", { required: "Task name is required", maxLength: 50 })}
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <Input
              className="bg-white border-1 border-[#3E1671]"
              placeholder="Enter task description"
              {...register("description", { required: false, maxLength: 200 })}
            />
          </div>
          <Button type="submit" className="bg-[#9E78CF] w-full">Submit</Button>
        </form>

        <DialogClose asChild>
          <button ref={dialogCloseRef} className="hidden" />
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
