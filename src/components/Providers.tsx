"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";

interface ProvidersProps extends React.PropsWithChildren {}

const Providers: React.FC<ProvidersProps> = ({ children }) => {
  const [queryClient] = React.useState(new QueryClient());

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </SessionProvider>
  );
};

export default Providers;
