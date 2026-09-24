import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('RBAC (e2e)', () => {
  let app: INestApplication;
  let superAdminToken: string;
  let employeeToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const res1 = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'admin@hygilog.vn', password: 'Hygilog@2026' });
    superAdminToken = res1.body.data?.accessToken || 'mock_super_token';

    const res2 = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'huong.vo@hygilog.vn', password: 'Hygilog@2026' });
    employeeToken = res2.body.data?.accessToken || 'mock_emp_token';
  });

  afterAll(async () => {
    await app.close();
  });

  it('User with permission -> 200', () => {
    return request(app.getHttpServer())
      .get('/api/users')
      .set('Authorization', `Bearer ${superAdminToken}`)
      .expect(200);
  });

  it('User without permission -> 403', () => {
    return request(app.getHttpServer())
      .get('/api/users')
      .set('Authorization', `Bearer ${employeeToken}`)
      .expect(403);
  });

  it('Tenant isolation: missing or invalid tenant -> 403', () => {
    return request(app.getHttpServer())
      .get('/api/sites')
      .set('Authorization', `Bearer invalid-token`)
      .expect(401);
  });
});
