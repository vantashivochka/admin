"use client";

import React from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

import MaxWidthWrapper from "@/components/ui/max-width-wrapper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { DataTable } from "./data-table";
import { columns } from "./columns";
import { Skeleton } from "@/components/ui/skeleton";

interface PageProps {}

const Page: React.FC<PageProps> = ({}) => {
  const [category, setCategory] = React.useState<"cargo" | "garbage">("cargo");

  const { data: clients, isLoading: isClientsLoading } = useQuery({
    queryKey: ["clients", category],
    queryFn: async () => {
      const { data } = await axios.get(`/api/contact?category=${category}`);

      return data;
    },
  });

  return (
    <div className="my-8">
      <MaxWidthWrapper>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">База клієнтів</h2>
          <div>
            <Select
              onValueChange={(value: "cargo" | "garbage") => setCategory(value)}
              value={category}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cargo">Грузоперевезення</SelectItem>
                <SelectItem value="garbage">Сміття</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-4">
          {isClientsLoading && (
            <div className="flex flex-col gap-4">
              {Array(8)
                .fill(null)
                .map((_, index) => (
                  <Skeleton key={index} className="h-16 w-full" />
                ))}
            </div>
          )}
          {clients && (
            <div className="animate-in fade-in-25">
              <DataTable columns={columns} data={clients} />
            </div>
          )}
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

export default Page;
