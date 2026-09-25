import { Injectable, UnauthorizedException, Inject, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RolesService } from '../roles/roles.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private rolesService: RolesService,
    private jwtService: JwtService,
    private configService: ConfigService,
    @Inject('REDIS_CLIENT') private redisClient: any,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && user.isActive) {
      const isMatch = await bcrypt.compare(pass, user.password);
      if (isMatch) {
        const { password, ...result } = (user as any).toObject ? (user as any).toObject() : user;
        return result;
      }
    }
    return null;
  }

  async login(user: any) {
    const permissions = await this.rolesService.getPermissionsForRole(user.roleId);
    
    const payload: JwtPayload = {
      sub: user._id.toString(),
      email: user.email,
      organizationId: user.organizationId.toString(),
      roleId: user.roleId.toString(),
      permissions: permissions,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN') || '15m',
    });
    
    const refreshToken = this.jwtService.sign({ sub: user._id.toString() }, {
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '7d',
    });

    await this.usersService.updateRefreshToken(user._id.toString(), refreshToken);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        organizationId: user.organizationId,
        roleId: user.roleId,
        permissions,
      },
    };
  }

  async refreshToken(token: string) {
    try {
      const decoded = this.jwtService.verify(token);
      const user = await this.usersService.findById(decoded.sub);
      
      if (!user || !user.isActive || user.refreshToken !== token) {
        throw new UnauthorizedException('Refresh token không hợp lệ hoặc đã hết hạn');
      }

      return this.login(user);
    } catch (e) {
      throw new UnauthorizedException('Refresh token không hợp lệ hoặc đã hết hạn');
    }
  }

  async logout(userId: string, token: string) {
    try {
      const decoded = this.jwtService.decode(token) as any;
      if (decoded && decoded.exp) {
        const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);
        if (expiresIn > 0 && this.redisClient && typeof this.redisClient.set === 'function') {
          await this.redisClient.set(`bl_${token}`, userId, 'EX', expiresIn);
        }
      }
      
      await this.usersService.updateRefreshToken(userId, null);
      
      return { success: true };
    } catch (error) {
      throw new InternalServerErrorException('Lỗi khi đăng xuất');
    }
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    if (!this.redisClient || typeof this.redisClient.get !== 'function') return false;
    const result = await this.redisClient.get(`bl_${token}`);
    return !!result;
  }
}
