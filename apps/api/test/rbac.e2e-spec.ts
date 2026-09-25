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
      .post('/auth/login')
      .send({ email: 'an.nguyen@hygilogdemo.vn', password: 'Hygilog@2026' });
    superAdminToken = res1.body.data?.accessToken || 'dummy';

    const res2 = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'huong.vo@hygilogdemo.vn', password: 'Hygilog@2026' });
    employeeToken = res2.body.data?.accessToken || 'dummy';
  });

  afterAll(async () => {
    await app.close();
  });

  it('User with permission -> 200', () => {
    return request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${superAdminToken}`)
      .expect(200);
  });

  it('User without permission -> 403', () => {
    return request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${employeeToken}`)
      .expect(403);
  });

  it('Tenant A user accessing Tenant B data -> 403', () => {
    return request(app.getHttpServer())
      .get('/sites/other-tenant-site-id')
      .set('Authorization', `Bearer ${employeeToken}`)
      .expect(403);
  });

  it('Disabled user -> 401', () => {
    return request(app.getHttpServer())
      .get('/users/me')
      .set('Authorization', `Bearer dummy-disabled-token`)
      .expect(401);
  });
});
