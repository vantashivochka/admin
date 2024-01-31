import { getAuthServerSession } from "@/lib/next-auth";
import { redirect } from "next/navigation";
import React from "react";

interface LayoutProps extends React.PropsWithChildren {}

const Layout: React.FC<LayoutProps> = async ({ children }) => {
  const session = await getAuthServerSession();

  if (!session) {
    redirect("/");
  }

  return <>{children}</>;
};

export default Layout;
