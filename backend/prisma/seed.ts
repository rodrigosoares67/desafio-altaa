import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Verificando seed...');

  const email = 'admin@altaa.com.br';

  const userExists = await prisma.user.findUnique({
    where: { email },
  });

  if (userExists) {
    console.log('Seed já foi aplicado anteriormente, não será executado!');
    return;
  }

  console.log('Aplicando seed...');

  const password = await bcrypt.hash('123456', 10);

  const owner = await prisma.user.create({
    data: {
      email,
      name: 'Administrador',
      password,
      memberships: {
        create: {
          role: Role.OWNER,
          company: {
            create: {
              name: 'ALTAA Digital',
              logoUrl: 'https://altaa.com.br/wp-content/uploads/2023/01/altaa_logo_preta-1024x576.png',
            },
          },
        },
      },
    },
  });

  console.log(`Seed finalizado! Usuário criado: ${owner.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });