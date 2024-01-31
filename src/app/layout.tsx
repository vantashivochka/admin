import { getAuthServerSession } from "@/lib/next-auth";

import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";
import { Toaster } from "@/components/ui/sonner";

import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";

import "./globals.css";

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
            className={cn("grid grid-cols-6 h-full min-h-screen", {
              "block": !session,
            })}
          >
            {session && (
              <div className="col-span-1">
                <Navbar />
              </div>
            )}
            <div className="col-span-5">{children}</div>
          </div>
          <Toaster richColors />
        </Providers>
      </body>
    </html>
  );
}
