const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const run = async () => {
  const accounts = await prisma.tai_khoan.findMany();

  for (let acc of accounts) {
    if (acc.password.startsWith("$2")) continue;

    const hashed = await bcrypt.hash(acc.password, 10);

    await prisma.tai_khoan.update({
      where: { id_tai_khoan: acc.id_tai_khoan },
      data: { password: hashed },
    });

    console.log(`✅ ${acc.username}`);
  }

  console.log("🎉 Done");
  process.exit();
};

run();