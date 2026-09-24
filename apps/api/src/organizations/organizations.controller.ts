import { Controller, Get, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
const AuthGuard = class {};
const TenantGuard = class {};
const PermissionGuard = class {};
const Permissions = (...args: string[]) => ((target: any, key: string, descriptor: any) => descriptor);

@Controller('organizations')
@UseGuards(AuthGuard, TenantGuard, PermissionGuard)
export class OrganizationsController {
  constructor(private readonly orgsService: OrganizationsService) {}

  @Get('me')
  @Permissions('organizations.view')
  async getOwnOrg(@Request() req: any) {
    const org = await this.orgsService.findById(req.user.organizationId);
    return { success: true, data: org };
  }

  @Patch('me/settings')
  @Permissions('organizations.update')
  async updateSettings(@Body() updateDto: UpdateOrganizationDto, @Request() req: any) {
    const org = await this.orgsService.update(req.user.organizationId, updateDto);
    return { success: true, data: org };
  }
}
