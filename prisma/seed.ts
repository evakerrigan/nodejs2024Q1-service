import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Создание первого пользователя
  const user1 = await prisma.user.create({
    data: {
      login: 'user1',
      password: 'password1',
      version: 1,
    },
  });
  console.log(`Created user: ${user1.login}`);

  // Создание второго пользователя
  const user2 = await prisma.user.create({
    data: {
      login: 'user2',
      password: 'password2',
      version: 1,
    },
  });
  console.log(`Created user: ${user2.login}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
