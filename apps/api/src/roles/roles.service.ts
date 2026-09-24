import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from './schemas/role.schema';
import { Permission } from './schemas/permission.schema';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name) private roleModel: Model<Role>,
    @InjectModel(Permission.name) private permissionModel: Model<Permission>,
  ) {}

  async findAll(organizationId: string): Promise<Role[]> {
    return this.roleModel.find({
      $or: [{ organizationId }, { isSystem: true }],
    }).exec();
  }

  async findById(organizationId: string, roleId: string): Promise<Role> {
    const role = await this.roleModel.findOne({
      _id: roleId,
      $or: [{ organizationId }, { isSystem: true }],
    }).exec();

    if (!role) {
      throw new NotFoundException('Vai trò không tồn tại');
    }
    return role;
  }

  async updatePermissions(organizationId: string, roleId: string, permissions: string[]): Promise<Role> {
    const role = await this.roleModel.findOne({
      _id: roleId,
      organizationId,
      isSystem: false,
    }).exec();

    if (!role) {
      throw new NotFoundException('Vai trò không tồn tại hoặc không thể chỉnh sửa');
    }

    role.permissions = permissions;
    return role.save();
  }

  async getPermissionsForRole(roleId: string): Promise<string[]> {
    const role = await this.roleModel.findById(roleId).exec();
    if (!role) return [];
    return role.permissions || [];
  }
}
