"use client";

import React from "react";
import axios, { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";

import MaxWidthWrapper from "@/components/ui/max-width-wrapper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PriceCard from "@/components/price-card";
import { Skeleton } from "@/components/ui/skeleton";

interface PageProps {}

export interface PriceItem {
  id: string;
  title: string;
  description?: string;
  price: number;
}

const Page: React.FC<PageProps> = () => {
  const [category, setCategory] = React.useState<"cargo" | "garbage">("cargo");

  const { data: prices, isLoading: isPricesLoading } = useQuery({
    queryKey: ["prices", category],
    queryFn: async () => {
      try {
        const { data } = await axios.get(`/api/prices?category=${category}`);

        if (data instanceof AxiosError) {
          throw new Error();
        }

        console.log(data);

        return data as PriceItem[];
      } catch (error) {
        console.log(error);
      }
    },
  });

  return (
    <div className="my-8">
      <MaxWidthWrapper>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Ціни на послуги</h2>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {isPricesLoading &&
            Array(4)
              .fill(null)
              .map((_, index) => (
                <Skeleton key={index} className="h-80 w-full" />
              ))}
        </div>

        {prices && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 animate-in fade-in-25">
            {prices &&
              prices.map((price) => (
                <PriceCard
                  category={category}
                  id={price.id}
                  price={price.price}
                  title={price.title}
                  description={price.description}
                  key={price.id}
                />
              ))}
          </div>
        )}
      </MaxWidthWrapper>
    </div>
  );
};

export default Page;
