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
      .post('/api/auth/login')
      .send({ email: 'admin@hygilog.vn', password: 'Hygilog@2026' })
      .expect(200)
      .expect((res) => {
        expect(res.body.success).toBe(true);
        expect(res.body.data.accessToken).toBeDefined();
      });
  });

  it('/auth/login (POST) - wrong password', () => {
    return request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'admin@hygilog.vn', password: 'wrongpassword' })
      .expect(401)
      .expect((res) => {
        expect(res.body.success).toBe(false);
      });
  });

  it('/protected-route (GET) - without token', () => {
    return request(app.getHttpServer())
      .get('/api/users')
      .expect(401);
  });

  it('/protected-route (GET) - with expired token', () => {
    return request(app.getHttpServer())
      .get('/api/users')
      .set('Authorization', 'Bearer expired.token.here')
      .expect(401);
  });
});
