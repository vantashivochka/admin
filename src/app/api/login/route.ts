import prisma from "@/lib/prisma";
import * as bcrypt from "bcrypt";

interface Body {
  username: string;
  password: string;
}

export async function POST(req: Request): Promise<Response | void> {
  const body: Body = await req.json();

  const user = await prisma.user.findFirst({
    where: {
      username: body.username,
    },
  });

  if (!user) {
    return new Response("User not found", { status: 404 });
  }

  const password = await bcrypt.compare(body.password, user.password);

  if (password) {
    const { password, ...userWithourPass } = user;

    return new Response(JSON.stringify(userWithourPass));
  } else {
    return new Response(null);
  }
}
