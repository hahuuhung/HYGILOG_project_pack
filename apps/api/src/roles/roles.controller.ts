import { Controller, Get, Put, Param, Body, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { TenantGuard } from '../auth/guards/tenant.guard';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { UpdatePermissionsDto } from './dto/update-permissions.dto';

@UseGuards(JwtAuthGuard, TenantGuard, PermissionGuard)
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Permissions('roles.read')
  @Get()
  async findAll(@CurrentUser() user: AuthenticatedUser) {
    const data = await this.rolesService.findAll(user.organizationId);
    return { success: true, data };
  }

  @Permissions('roles.read')
  @Get(':id')
  async findById(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    const data = await this.rolesService.findById(user.organizationId, id);
    return { success: true, data };
  }

  @Permissions('roles.update')
  @Put(':id/permissions')
  async updatePermissions(
    @Param('id') id: string,
    @Body() updatePermissionsDto: UpdatePermissionsDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const data = await this.rolesService.updatePermissions(
      user.organizationId,
      id,
      updatePermissionsDto.permissions,
    );
    return { success: true, data };
  }
}
