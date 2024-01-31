import prisma from "@/lib/prisma";
import * as bcrypt from "bcrypt";

interface Body {
  name: string;
  username: string;
  password: string;
}

export async function POST(req: Request) {
  const body: Body = await req.json();

  const user = await prisma.user.create({
    data: {
      name: body.name,
      username: body.username,
      password: await bcrypt.hash(body.password, 10),
    },
  });

  const { password, ...result } = user;

  return new Response(JSON.stringify(result));
}
