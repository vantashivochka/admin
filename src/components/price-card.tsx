"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PriceSchema, PriceValidator } from "@/lib/validators/price";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PriceItem } from "@/app/(admin)/prices/page";

interface PriceCardProps {
  id: string;
  title: string;
  description?: string;
  price: number;
  category: "cargo" | "garbage";
}

const PriceCard: React.FC<PriceCardProps> = ({
  category,
  id,
  price,
  title,
  description,
}) => {
  const queryClient = useQueryClient();
  const form = useForm<PriceSchema>({
    resolver: zodResolver(PriceValidator),
    defaultValues: {
      title,
      description: description || "",
      price,
    },
  });

  const { mutate: saveChanges, isPending: isSaveLoading } = useMutation({
    mutationFn: async (values: PriceSchema) => {
      try {
        const { data } = await axios.patch(
          `/api/prices?id=${id}&category=${category}`,
          values
        );

        if (data instanceof AxiosError) {
          throw new Error();
        }

        queryClient.refetchQueries({
          queryKey: ["prices"],
        });

        toast.success("Зміни були збережені");
        return data as PriceItem;
      } catch (error) {
        console.log(error);
      }
    },
  });

  function onSubmit(values: PriceSchema) {
    saveChanges(values);
  }

  return (
    <Card key={id} className="shadow-md">
      <CardContent className="mt-4 mb-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Назва</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Опис (не обов&apos;язково, для себе)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ціна</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-1 relative">
                      <div className="absolute top-0 left-0 w-8 h-10 grid place-items-center">
                        <span className="text-sm text-zinc-400">₴</span>
                      </div>
                      <div className="hidden absolute top-0 right-3 h-10 md:grid place-items-center">
                        <span className="text-sm text-zinc-400">
                          + {category === "cargo" ? "200" : "100"}₴ грн
                          вантажівник
                        </span>
                      </div>
                      <Input
                        type="number"
                        value={field.value}
                        ref={field.ref}
                        onChange={(e) => field.onChange(+e.target.value)}
                        className="pl-6"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button isLoading={isSaveLoading} type="submit">
              Зберігти
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PriceCard;
