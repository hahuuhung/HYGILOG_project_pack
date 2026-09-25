import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/auth/login (POST) - valid credentials', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'an.nguyen@hygilogdemo.vn', password: 'Hygilog@2026' })
      .expect(200)
      .expect((res) => {
        expect(res.body.success).toBe(true);
        expect(res.body.data.accessToken).toBeDefined();
      });
  });

  it('/auth/login (POST) - wrong password', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'an.nguyen@hygilogdemo.vn', password: 'wrongpassword' })
      .expect(401)
      .expect((res) => {
        expect(res.body.success).toBe(false);
      });
  });

  it('/auth/login (POST) - disabled user', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'disabled@hygilogdemo.vn', password: 'Hygilog@2026' })
      .expect(401);
  });

  it('/protected-route (GET) - without token', () => {
    return request(app.getHttpServer())
      .get('/users/me')
      .expect(401);
  });

  it('/protected-route (GET) - with expired token', () => {
    return request(app.getHttpServer())
      .get('/users/me')
      .set('Authorization', 'Bearer expired.token.here')
      .expect(401);
  });
});
