import { getAuthServerSession } from "@/lib/next-auth";

import Navbar from "@/components/navbar";
import Providers from "@/components/providers/Providers";
import { Toaster } from "@/components/ui/sonner";

import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";

import "./globals.css";
import NavbarMobile from "@/components/navbar-mobile";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Вантажівочка Адмін",
  description: "Адмін панель для сайту Вантажівочка",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getAuthServerSession();

  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.className
        )}
      >
        <Providers>
          <div
            className={cn("md:grid grid-cols-6 h-full min-h-screen", {
              block: !session,
            })}
          >
            {session && (
              <>
                <div className="hidden md:block col-span-1">
                  <Navbar />
                </div>
                <div className="block md:hidden z-[8888]">
                  <NavbarMobile />
                </div>
              </>
            )}
            <div
              className={cn("mt-28 md:mt-0", {
                "md:col-span-6": !session,
                "md:col-span-5": session,
              })}
            >
              {children}
            </div>
          </div>
          <Toaster richColors />
        </Providers>
      </body>
    </html>
  );
}
