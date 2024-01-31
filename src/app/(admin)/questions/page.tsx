"use client";

import React from "react";
import axios, { AxiosError } from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FAQSchema, FAQValidator } from "@/lib/validators/faq";
import MaxWidthWrapper from "@/components/ui/max-width-wrapper";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import FaqItem from "@/components/faq-item";
import { Accordion } from "@/components/ui/accordion";

export interface QuestionItem {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  question: string;
  answer: string;
}

const Page: React.FC = () => {
  const [isCreating, setIsCreating] = React.useState<boolean>(false);
  const queryClient = useQueryClient();

  const form = useForm<FAQSchema>({
    resolver: zodResolver(FAQValidator),
  });

  const { data: questions, isLoading: isQuestionLoading } = useQuery({
    queryKey: ["questions"],
    queryFn: async () => {
      const { data } = await axios.get("/api/faq");

      if (data instanceof AxiosError) {
        throw new Error();
      }

      return data as QuestionItem[];
    },
  });

  const { mutate: createQuestion, isPending: isQuestionCreatePending } =
    useMutation({
      mutationFn: async (values: FAQSchema) => {
        const { data } = await axios.post("/api/faq", values);

        if (data instanceof AxiosError) {
          throw new Error();
        }

        return data;
      },
      onSuccess: () => {
        queryClient.refetchQueries({ queryKey: ["questions"] });
        form.reset();
        setIsCreating(false);
      },
    });

  function onSubmit(values: FAQSchema) {
    createQuestion(values);
  }

  return (
    <div className="my-10">
      <MaxWidthWrapper className="flex flex-col gap-6">
        <h2 className="text-2xl font-semibold">Відповіді на запитання</h2>
        {questions && !!questions.length && (
          <div className="flex flex-col gap-4">
            <Accordion type="single" collapsible>
              {questions.map((faq) => (
                <FaqItem key={faq.id} {...faq} />
              ))}
            </Accordion>
          </div>
        )}
        <div className="flex flex-col gap-4">
          <Button onClick={() => setIsCreating(!isCreating)}>
            Додати питання
          </Button>
          {isCreating && (
            <Card>
              <CardHeader>
                <CardTitle>Створити питання</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="question"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Питання</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="answer"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Відповідь</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button isLoading={isQuestionCreatePending} type="submit">
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
