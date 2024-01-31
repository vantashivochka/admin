import prisma from "@/lib/prisma";

interface Body {
  title: string;
  price: number;
  category?: "cargo" | "garbage";
  description: string;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");

  if (category === "cargo") {
    const priceCargo = await prisma.priceCargo.findMany({
      orderBy: {
        price: "asc",
      },
    });

    return new Response(JSON.stringify(priceCargo), {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  } else {
    const priceGarbage = await prisma.priceGarbage.findMany({
      orderBy: {
        price: "asc",
      },
    });

    return new Response(JSON.stringify(priceGarbage), {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }
}

export async function POST(req: Request) {
  const { description, price, title, category }: Body = await req.json();

  if (category === "cargo") {
    const priceCargo = await prisma.priceCargo.create({
      data: {
        description,
        price,
        title,
      },
    });

    return new Response(JSON.stringify(priceCargo));
  } else {
    const priceGarbage = await prisma.priceGarbage.create({
      data: {
        description,
        price,
        title,
      },
    });

    return new Response(JSON.stringify(priceGarbage));
  }
}

export async function PATCH(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const category = searchParams.get("category");

  const { description, price, title }: Body = await req.json();

  if (!category || !id)
    return new Response("ID or Category not found", { status: 400 });

  if (category === "cargo") {
    const isExist = await prisma.priceCargo.findUnique({
      where: {
        id: id,
      },
    });

    if (!isExist) return new Response("Price not found", { status: 404 });

    const priceCargo = await prisma.priceCargo.update({
      where: {
        id,
      },
      data: {
        description,
        price,
        title,
      },
    });

    return new Response(JSON.stringify(priceCargo), {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  } else {
    const isExist = await prisma.priceGarbage.findUnique({
      where: {
        id,
      },
    });

    if (!isExist) return new Response("Price not found", { status: 404 });

    const priceGarbage = await prisma.priceGarbage.update({
      where: {
        id,
      },
      data: {
        description,
        price,
        title,
      },
    });

    return new Response(JSON.stringify(priceGarbage), {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }
}
