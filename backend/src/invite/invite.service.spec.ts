import { Test, TestingModule } from '@nestjs/testing';
import { InviteService } from './invite.service';
import { PrismaService } from '../prisma/prisma.service';
import { MailerService } from '@nestjs-modules/mailer';

describe('InviteService', () => {
  let service: InviteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InviteService,
        {
          provide: PrismaService,
          useValue: {
            membership: { findUnique: jest.fn(), create: jest.fn() },
            invite: { 
              upsert: jest.fn(), 
              deleteMany: jest.fn(), 
              create: jest.fn(), 
              findUnique: jest.fn(), 
              delete: jest.fn() 
            },
            user: { findUnique: jest.fn(), create: jest.fn() },
          },
        },
        {
          provide: MailerService,
          useValue: {
            sendMail: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<InviteService>(InviteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});