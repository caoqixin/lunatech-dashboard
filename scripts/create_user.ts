import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

const createUser = async () => {
  const email = "caoqixin7@gmail.com";
  const password = "Caoqixin7";
  const name = "xin";

  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    return "用户已存在";
  }

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  return `${name} 用户添加成功`;
};

createUser().then((msg) => {
  console.log(msg);
});
