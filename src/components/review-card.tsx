"use client";

import { ReviewItem } from "@/app/(admin)/reviews/page";
import React from "react";
import { Card, CardContent } from "./ui/card";
import { useForm } from "react-hook-form";
import { ReviewSchema, ReviewValidator } from "@/lib/validators/review";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

interface ReviewCardProps extends ReviewItem {}

const ReviewCard: React.FC<ReviewCardProps> = ({
  id,
  name,
  rating,
  text,
  createdAt,
}) => {
  const queryClient = useQueryClient();

  const form = useForm<ReviewSchema>({
    resolver: zodResolver(ReviewValidator),
    defaultValues: {
      name,
      text,
      rating,
    },
  });

  const { mutate: saveChanges, isPending: isChangesPending } = useMutation({
    mutationFn: async (values: ReviewSchema) => {
      const { data } = await axios.patch(`/api/review?id=${id}`, values);

      if (data instanceof AxiosError) {
        throw new Error();
      }

      return data as ReviewItem;
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["reviews"] });
      toast.success("Зміни були успішно збережені");
    },
    onError: () => {
      toast.error("Щось пішло не так. Зверніться до адміністратора");
    },
  });

  const { mutate: deleteReview, isPending: isDeletingLoading } = useMutation({
    mutationFn: async () => {
      const { data } = await axios.delete(`/api/review?id=${id}`);

      if (data instanceof AxiosError) {
        throw new Error();
      }

      return data as string;
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["reviews"] });
      toast.success("Відгук був успішно видалений");
    },
    onError: () => {
      toast.error("Щось пішло не так. Зверніться до адміністратора");
    },
  });

  function onSubmit(values: ReviewSchema) {
    saveChanges(values);
  }

  return (
    <Card className="shadow-md animate-in fade-in-25">
      <CardContent className="flex flex-col gap-2 p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex justify-between sm:items-center sm:flex-row flex-col">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="inline-flex">
                    <FormControl>
                      <Input className="flex" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <p className="font-semibold flex items-center justify-between sm:justify-center sm:mt-0 mt-4 gap-2 text-sm">
                Оцінка:
                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem className="inline-flex">
                      <FormControl>
                        <Input
                          className="flex text-orange-500 max-w-14"
                          type="number"
                          min={1}
                          max={5}
                          step={1}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </p>
            </div>
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      rows={2}
                      className="flex text-muted-foreground"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-2">
              <Button
                type="submit"
                isLoading={isChangesPending || isDeletingLoading}
                disabled={isChangesPending || isDeletingLoading}
              >
                Зберігти
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={() => deleteReview()}
                isLoading={isChangesPending || isDeletingLoading}
                disabled={isChangesPending || isDeletingLoading}
              >
                Видалити
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;
