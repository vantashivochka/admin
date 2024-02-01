import prisma from "@/lib/prisma";

interface Body {
  name: string;
  text: string;
  rating: number;
}

export async function POST(req: Request) {
  const { name, rating, text }: Body = await req.json();

  if (!name || !text || !rating)
    return new Response("Name, text or rating not found", { status: 400 });

  const review = await prisma.review.create({
    data: {
      name,
      text,
      rating,
    },
  });

  return new Response(JSON.stringify(review));
}

export async function PATCH(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const { name, rating, text }: Body = await req.json();

  if (!id) return new Response("ID not found", { status: 400 });

  const isExist = await prisma.review.findUnique({
    where: {
      id,
    },
  });

  if (!isExist) return new Response("Review not found", { status: 404 });

  const review = await prisma.review.update({
    where: {
      id,
    },
    data: {
      name,
      text,
      rating,
    },
  });

  return new Response(JSON.stringify(review));
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) return new Response("ID not found", { status: 400 });

  const isExist = await prisma.review.findUnique({
    where: {
      id,
    },
  });

  if (!isExist) return new Response("Review not found", { status: 404 });

  const review = await prisma.review.delete({
    where: {
      id,
    },
  });

  return new Response("Deleted");
}

export async function GET(req: Request) {
  const review = await prisma.review.findMany();

  return new Response(JSON.stringify(review));
}
