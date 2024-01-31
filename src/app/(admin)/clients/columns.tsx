"use client";

import dayjs from "dayjs";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axios, { Axios, AxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";

export type Contact = {
  id: number;
  phone: string;
  name: string;
  city: string | null;
  gclid: string | null;
  message: string | null;
  type: string | null;
  isCalled: boolean;
};

export const columns: ColumnDef<Contact>[] = [
  {
    accessorKey: "name",
    header: "Ім'я",
  },
  {
    accessorKey: "phone",
    header: "Телефон",
  },
  {
    accessorKey: "createdAt",
    header: "Час",
    cell: ({ row }) => {
      return row.getValue("createdAt") ? (
        dayjs(row.getValue("createdAt")).format("DD.MM.YYYY HH:mm")
      ) : (
        <span className="text-muted-foreground">Не вказано</span>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Тип вантажу",
    cell: ({ row }) => {
      return row.getValue("type") ? (
        row.getValue("type")
      ) : (
        <span className="text-muted-foreground">Не вказано</span>
      );
    },
  },
  {
    accessorKey: "city",
    header: "Місто",
    cell: ({ row }) => {
      return row.getValue("city") ? (
        row.getValue("city")
      ) : (
        <span className="text-muted-foreground">Не вказано</span>
      );
    },
  },
  {
    accessorKey: "message",
    header: "Додатково",
    cell: ({ row }) => {
      return row.getValue("message") ? (
        row.getValue("message")
      ) : (
        <span className="text-muted-foreground">Не вказано</span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const contact = row.original;
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const queryClient = useQueryClient();

      const handleCalled = async () => {
        try {
          const { data } = await axios.patch(`/api/contact`, {
            id: contact.id,
            isCalled: !contact.isCalled,
          });

          if (data instanceof AxiosError) {
            throw new Error();
          }

          queryClient.refetchQueries();

          toast.success(
            `Контакт було успішно помічено як ${
              contact.isCalled ? "не оброблений" : "оброблений"
            }`
          );
          return data;
        } catch (error) {
          console.log(error);
        }
      };

      const handleDelete = async () => {
        try {
          const { data } = await axios.delete(`/api/contact?id=${contact.id}`);

          if (data instanceof AxiosError) {
            throw new Error();
          }

          queryClient.refetchQueries();

          toast.success("Контакт було успішно видалено");
          return data;
        } catch (error) {
          console.log(error);
          toast.error("Щось пішло не так. Зверніться до адміністратора");
        }
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Відкрити меню</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(contact.phone)}
            >
              Копіювати номер телефону
            </DropdownMenuItem>
            {contact.gclid && (
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(contact.gclid!)}
              >
                Копіювати GCLID
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={handleCalled}>
              Відмітити як {contact.isCalled ? "не оброблений" : "оброблений"}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDelete}
              className="text-destructive"
            >
              Видалити
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
