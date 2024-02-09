import prisma from "@/lib/prisma";
import axios from "axios";
import dayjs from "dayjs";

interface Body {
  id: string;
  name: string;
  phone: string;
  type: string | null;
  city: string | null;
  message: string | null;
  isCalled: boolean;
  category: "cargo" | "garbage";
  gclid: string;
}

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { city, message, name, phone, type, gclid, category }: Body =
    await req.json();

  const contact = await prisma.contactUser.create({
    data: {
      name,
      phone,
      gclid,
      city,
      message,
      category,
      type,
    },
  });

  const { data: notificationTelegram } = await axios.get(
    `https://api.telegram.org/bot${
      process.env.NEXT_TELEGRAM_TOKEN
    }/sendMessage?chat_id=${
      process.env.NEXT_TELEGRAM_CHANNEL
    }&parse_mode=markdown&text=
    🟢 Новий клієнт!%0A*Час*: ${dayjs(contact.createdAt).format(
      "DD.MM.YYYY HH:mm"
    )}%0A*Ім'я*: ${contact.name}%0A*Телефон*:\`${contact.phone}\`%0A*Тип*: ${
      contact.category === "garbage" ? "Сміття" : "Речі"
    }%0A%0A_Додаткова інформація_%0A*Тип вантажу*: ${
      contact.type ? contact.type : "не вказано"
    }%0A*Місто*: ${
      contact.city ? contact.city : "не вказано"
    }%0A*Додатково*: ${contact.message ? contact.message : "не вказано"}%0A`
  );

  console.log(notificationTelegram);

  return new Response(JSON.stringify(contact), {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export async function PATCH(req: Request) {
  const { id, isCalled }: Body = await req.json();

  const isExist = await prisma.contactUser.findUnique({
    where: {
      id,
    },
  });

  if (!isExist) return new Response("Contact not found", { status: 404 });

  const contact = await prisma.contactUser.update({
    where: {
      id,
    },
    data: {
      isCalled,
    },
  });

  return new Response(JSON.stringify(contact), {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) return new Response("ID not found", { status: 400 });

  const isExist = await prisma.contactUser.findUnique({
    where: {
      id,
    },
  });

  if (!isExist) return new Response("Contact not found", { status: 404 });

  const contact = await prisma.contactUser.delete({
    where: {
      id,
    },
  });

  return new Response("Deleted");
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");

  if (category) {
    const contact = await prisma.contactUser.findMany({
      where: {
        category,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return new Response(JSON.stringify(contact));
  } else {
    const contact = await prisma.contactUser.findMany();

    return new Response(JSON.stringify(contact));
  }
}

export async function OPTIONS(request: Request) {
  const origin = request.headers.get("origin");

  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": origin || "*",
      "Access-Control-Allow-Methods": "GET,OPTIONS,PATCH,DELETE,POST,PUT",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
