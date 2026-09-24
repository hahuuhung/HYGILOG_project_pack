import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { SitesService } from './sites.service';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
const AuthGuard = class {};
const TenantGuard = class {};
const PermissionGuard = class {};
const Permissions = (...args: string[]) => ((target: any, key: string, descriptor: any) => descriptor);

@Controller('sites')
@UseGuards(AuthGuard, TenantGuard, PermissionGuard)
export class SitesController {
  constructor(private readonly sitesService: SitesService) {}

  @Post()
  @Permissions('sites.create')
  async create(@Body() createDto: CreateSiteDto, @Request() req: any) {
    const site = await this.sitesService.create(createDto, req.user.organizationId);
    return { success: true, data: site };
  }

  @Get()
  @Permissions('sites.view')
  async findAll(@Request() req: any) {
    const sites = await this.sitesService.findAll(req.user.organizationId);
    return { success: true, data: sites };
  }

  @Get(':id')
  @Permissions('sites.view')
  async findOne(@Param('id') id: string, @Request() req: any) {
    const site = await this.sitesService.findOne(id, req.user.organizationId);
    return { success: true, data: site };
  }

  @Patch(':id')
  @Permissions('sites.update')
  async update(@Param('id') id: string, @Body() updateDto: UpdateSiteDto, @Request() req: any) {
    const site = await this.sitesService.update(id, updateDto, req.user.organizationId);
    return { success: true, data: site };
  }

  @Delete(':id')
  @Permissions('sites.delete')
  async remove(@Param('id') id: string, @Request() req: any) {
    await this.sitesService.remove(id, req.user.organizationId);
    return { success: true, data: null };
  }
}
