import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { RolesModule } from '../roles/roles.module';
import { UsersModule } from '../users/users.module';

const redisProvider = {
  provide: 'REDIS_CLIENT',
  useValue: {
    get: async (key: string) => null,
    set: async (key: string, value: string, mode: string, duration: number) => 'OK',
  },
};

@Module({
  imports: [
    forwardRef(() => UsersModule),
    forwardRef(() => RolesModule),
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'super-secret',
        signOptions: { 
          expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '15m' 
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, redisProvider],
  exports: [AuthService],
})
export class AuthModule {}
