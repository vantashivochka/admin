import prisma from "@/lib/prisma";

interface Body {
  id: number;
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

  const isExist = await prisma.contactUser.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!isExist) return new Response("Contact not found", { status: 404 });

  const contact = await prisma.contactUser.delete({
    where: {
      id: Number(id),
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
