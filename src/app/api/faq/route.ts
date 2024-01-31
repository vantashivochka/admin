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

  return new Response(JSON.stringify(faq));
}
