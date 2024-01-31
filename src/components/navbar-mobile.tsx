"use client";

import React from "react";
import MaxWidthWrapper from "./ui/max-width-wrapper";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button, buttonVariants } from "./ui/button";
import {
  HelpCircle,
  LucideBadgeDollarSign,
  Menu,
  UserCircle,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const NavbarMobile: React.FC = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  React.useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <header className="fixed top-0 z-[8888] left-0 w-full bg-slate-100 py-6 border-b border-gray-200">
      <MaxWidthWrapper>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Вантажівочка Admin</h2>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent className="z-[9999]">
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
            </SheetContent>
          </Sheet>
        </div>
      </MaxWidthWrapper>
    </header>
  );
};

export default NavbarMobile;
