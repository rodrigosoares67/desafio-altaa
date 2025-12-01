import { Test, TestingModule } from '@nestjs/testing';
import { CompanyService } from './company.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';

const fakePrismaService = {
  company: {
    create: jest.fn(),
  },
};

describe('CompanyService', () => {
  let service: CompanyService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyService,
        {
          provide: PrismaService,
          useValue: fakePrismaService,
        },
      ],
    }).compile();

    service = module.get<CompanyService>(CompanyService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('deve criar uma empresa e retornar os dados', async () => {
      const userId = 'user-id-123';
      const dto: CreateCompanyDto = { name: 'R7 Tech', logoUrl: 'https://r7tech.com.br/wp-content/uploads/2023/12/logo_transparente.png' };

      const expectedResult = {
        id: 'company-id-123',
        name: 'R7 Tech',
        logoUrl: 'https://r7tech.com.br/wp-content/uploads/2023/12/logo_transparente.png',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(fakePrismaService.company, 'create').mockResolvedValue(expectedResult as any);

      const result = await service.create(userId, dto);

      expect(result).toEqual(expectedResult);
      expect(prisma.company.create).toHaveBeenCalledTimes(1);
      expect(prisma.company.create).toHaveBeenCalledWith({
        data: {
          name: dto.name,
          logoUrl: dto.logoUrl,
          memberships: {
            create: {
              userId: userId,
              role: 'OWNER',
            },
          },
        },
      });
    });
  });
});