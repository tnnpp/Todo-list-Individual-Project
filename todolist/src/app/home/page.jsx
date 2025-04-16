import Image from "next/image";
import dbConnect from '@/lib/mongodb';
import Item from '@/models/Item';
import User from '@/models/User';

export default async function Home() {
  await dbConnect();

  const item = await Item.findOne({ name: "hello" });
  const user = await User.findOne({ username: "hello" });

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {item ? item.description : "item not found"}
      {user ? user.email : "user not found"}
    </div>
  );
}
