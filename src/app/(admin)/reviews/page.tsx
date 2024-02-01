"use client";

import React from "react";
import MaxWidthWrapper from "@/components/ui/max-width-wrapper";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import ReviewCard from "@/components/review-card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReviewSchema, ReviewValidator } from "@/lib/validators/review";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

export interface ReviewItem {
  id: string;
  createdAt: Date;
  updatedAtd: Date;
  name: string;
  text: string;
  rating: number;
}

const Page: React.FC = () => {
  const [isCreating, setIsCreating] = React.useState<boolean>(false);
  const queryClient = useQueryClient();

  const form = useForm<ReviewSchema>({
    resolver: zodResolver(ReviewValidator),
    defaultValues: {
      rating: 5,
    },
  });

  const { data: reviews, isLoading: isReviewsLoading } = useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      const { data } = await axios.get("/api/review");

      if (data instanceof AxiosError) {
        throw new Error();
      }

      return data as ReviewItem[];
    },
  });

  const { mutate: createReview, isPending: isReviewPending } = useMutation({
    mutationFn: async (values: ReviewSchema) => {
      const { data } = await axios.post("/api/review", values);

      if (data instanceof AxiosError) {
        throw new Error();
      }

      return data;
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["reviews"] });
      form.reset();
      setIsCreating(false);
    },
  });

  function onSubmit(values: ReviewSchema) {
    createReview(values);
  }

  return (
    <div className="my-10">
      <MaxWidthWrapper className="flex flex-col gap-6">
        <h2 className="text-2xl font-semibold">Відгуки клієнтів</h2>
        <div className="flex flex-col gap-2">
          {reviews &&
            !!reviews.length &&
            reviews.map((review) => <ReviewCard key={review.id} {...review} />)}
          {isReviewsLoading &&
            Array(6)
              .fill(null)
              .map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}
        </div>
        <div className="flex flex-col gap-4">
          <Button
            isLoading={isReviewsLoading}
            disabled={isReviewsLoading || isReviewPending}
            onClick={() => setIsCreating(!isCreating)}
          >
            Додати відгук
          </Button>
          {isCreating && (
            <Card>
              <CardHeader>
                <CardTitle>Створити відгук</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ім&apos;я</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="text"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Відгук</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="rating"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Рейтинг (від 1 до 5)</FormLabel>
                          <FormDescription>
                            Допускаються тільки цілі числа, тобто 4, 5 і т.д.
                          </FormDescription>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              max="5"
                              step={1}
                              value={field.value}
                              onChange={(e) => field.onChange(+e.target.value)}
                              ref={field.ref}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      isLoading={isReviewPending}
                      disabled={isReviewPending || isReviewsLoading}
                      type="submit"
                    >
                      Створити
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

export default Page;
