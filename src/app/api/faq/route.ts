import prisma from "@/lib/prisma";

interface Body {
  question: string;
  answer: string;
}

export async function POST(req: Request) {
  const { answer, question }: Body = await req.json();

  if (!answer || !question)
    return new Response("Answer or Question not found", { status: 400 });

  const faq = await prisma.faq.create({
    data: {
      answer,
      question,
    },
  });

  return new Response(JSON.stringify(faq));
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) return new Response("ID not found", { status: 400 });

  const isExist = await prisma.faq.findUnique({
    where: {
      id,
    },
  });

  if (!isExist) return new Response("FAQ not found", { status: 404 });

  const faq = await prisma.faq.delete({
    where: {
      id,
    },
  });

  return new Response("Deleted");
}

export async function PATCH(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const { answer, question }: Body = await req.json();

  if (!id) return new Response("ID not found", { status: 400 });
  if (!answer || !question)
    return new Response("Answer or Question not found", { status: 400 });

  const isExist = await prisma.faq.findUnique({
    where: {
      id,
    },
  });

  if (!isExist) return new Response("FAQ not found", { status: 404 });

  const faq = await prisma.faq.update({
    where: {
      id,
    },
    data: {
      answer,
      question,
    },
  });

  return new Response(JSON.stringify(faq));
}

export async function GET(req: Request) {
  const faq = await prisma.faq.findMany();
  const origin = req.headers.get("origin");

  return new Response(JSON.stringify(faq), {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": origin || "*",
      "Access-Control-Allow-Methods": "GET,OPTIONS,PATCH,DELETE,POST,PUT",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
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
