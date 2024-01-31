"use client";

import { QuestionItem } from "@/app/(admin)/questions/page";
import React from "react";
import { Card, CardContent } from "./ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { FAQSchema, FAQValidator } from "@/lib/validators/faq";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import dayjs from "dayjs";

interface FaqItemProps extends QuestionItem {}

const FaqItem: React.FC<FaqItemProps> = ({
  answer,
  question,
  createdAt,
  id,
  updatedAt,
}) => {
  const queryClient = useQueryClient();
  const form = useForm<FAQSchema>({
    resolver: zodResolver(FAQValidator),
    defaultValues: {
      answer,
      question,
    },
  });

  const { mutate: saveChanges, isPending: isChangesPending } = useMutation({
    mutationFn: async (values: FAQSchema) => {
      const { data } = await axios.patch(`/api/faq?id=${id}`, values);

      if (data instanceof AxiosError) {
        throw new Error();
      }

      return data;
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["questions"] });
    },
  });

  const { mutate: deleteQuestion, isPending: isDeleteQuestionPending } =
    useMutation({
      mutationFn: async () => {
        const { data } = await axios.delete(`/api/faq?id=${id}`);

        if (data instanceof AxiosError) {
          throw new Error();
        }

        return data;
      },
      onSuccess: () => {
        queryClient.refetchQueries({ queryKey: ["questions"] });
      },
    });

  function onSubmit(values: FAQSchema) {
    saveChanges(values);
  }

  return (
    <AccordionItem value={id}>
      <AccordionTrigger>{question}</AccordionTrigger>
      <AccordionContent>
        <Card>
          <CardContent className="py-6">
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
                        <Textarea {...field} rows={2} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button isLoading={isChangesPending} type="submit">
                      Зберігти
                    </Button>
                    <Button
                      variant="destructive"
                      isLoading={isDeleteQuestionPending}
                      onClick={() => deleteQuestion()}
                      type="button"
                    >
                      Видалити
                    </Button>
                  </div>
                  <span className="text-muted-foreground text-xs">
                    Створено: {dayjs(createdAt).format("DD.MM.YYYY HH:mm")}
                  </span>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </AccordionContent>
    </AccordionItem>
  );
};

export default FaqItem;
