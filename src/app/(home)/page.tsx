"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LoginSchema, LoginValidator } from "@/lib/validators/login";
import { toast } from "sonner";
import MaxWidthWrapper from "@/components/ui/max-width-wrapper";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/clients";

  const form = useForm<LoginSchema>({
    resolver: zodResolver(LoginValidator),
  });

  const {
    mutate: login,
    isPending: isLoginLoading,
    isError: isLoginError,
  } = useMutation({
    mutationFn: async ({ username, password }: LoginSchema) => {
      const res = await signIn("credentials", {
        redirect: false,
        username,
        password,
        callbackUrl,
      });

      if (res?.status === 401) {
        form.setError("password", {
          type: "custom",
          message: "Неправильний пароль або логін",
        });
        form.setError("username", {
          type: "custom",
          message: "Неправильний пароль або логін",
        });

        return;
      }

      // in case if database down
      if (res?.error === "fetch failed") {
        throw new Error();
      }

      if (!res?.ok) {
        throw new Error();
      }

      return res;
    },
    onSuccess: (data) => {
      if (data?.error !== "401") {
        router.push(callbackUrl);
        router.refresh();
      }
    },
    onError: (error) => {
      toast.error("Щось пішло не так. Зверніться до адміністратора");
      console.log("%c[DEV]:", "background-color: yellow; color: black", error);
    },
  });

  function onSubmit(values: LoginSchema) {
    login(values);
  }

  return (
    <div className="max-w-xl mx-auto w-full my-10">
      <MaxWidthWrapper>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Вхід</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Логін</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Пароль</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-center">
                  <Button
                    isLoading={isLoginLoading}
                    className="w-full"
                    type="submit"
                  >
                    Увійти
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </MaxWidthWrapper>
    </div>
  );
}
