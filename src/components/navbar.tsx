import React from "react";
import Link from "next/link";
import { getAuthServerSession } from "@/lib/next-auth";
import {
  Check,
  HelpCircle,
  LucideBadgeDollarSign,
  UserCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";

const Navbar: React.FC = async () => {
  const session = await getAuthServerSession();

  if (!session) return null;

  return (
    <aside className="py-4 border-r border-gray-200 h-full">
      <div className="flex flex-col justify-between h-full">
        <div className="flex flex-col flex-grow">
          <span className="text-xl font-bold border-b birder-gray-200 pb-2 text-center">
            Вантажівочка Admin
          </span>
          <nav className="px-2 mt-4">
            <ul className="flex items-start flex-col gap-2">
              <li
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "font-medium inline-flex items-center gap-2 w-full"
                )}
              >
                <UserCircle className="h-5 w-5" />
                <Link href="/clients">Клієнти</Link>
              </li>
              <li
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "font-medium inline-flex items-center gap-2 w-full"
                )}
              >
                <LucideBadgeDollarSign className="h-5 w-5" />
                <Link href="/prices">Ціни</Link>
              </li>
              <li
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "font-medium inline-flex items-center gap-2 w-full"
                )}
              >
                <HelpCircle className="h-5 w-5" />
                <Link href="/questions">Питання</Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="flex justify-center flex-col lg:flex-row items-center gap-1 flex-0">
          <Check className="h-4 w-4 text-green-500" />
          Ви увійшли як{" "}
          <span className="font-semibold">{session.user?.name}</span>
        </div>
      </div>
    </aside>
  );
};

export default Navbar;
