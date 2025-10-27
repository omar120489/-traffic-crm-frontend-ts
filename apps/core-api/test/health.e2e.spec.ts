import { Test, TestingModule } from '@nestjs/testing';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

type NestFastifyApplication = import('@nestjs/platform-fastify').NestFastifyApplication;
type Response = import('supertest').Response;

describe('Health Check (e2e)', () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    const prismaMock = {
      onModuleInit: jest.fn(),
      enableShutdownHooks: jest.fn(),
      $connect: jest.fn(),
      $disconnect: jest.fn(),
    } satisfies Partial<PrismaService>;

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaMock)
      .compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/health (GET) should return 200', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect((res: Response) => {
        expect(res.body).toHaveProperty('status');
        expect(res.body.status).toBe('ok');
      });
  });

  it('/health (GET) should include timestamp', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect((res: Response) => {
        expect(res.body).toHaveProperty('timestamp');
        expect(typeof res.body.timestamp).toBe('string');
      });
  });
});
