import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { CorrectiveActionsService } from './corrective-actions.service';
import { CreateCorrectiveActionDto, UpdateCorrectiveActionDto, FilterCorrectiveActionDto } from './dto/corrective-action.dto';
const AuthGuard = class {}; const TenantGuard = class {}; const PermissionGuard = class {};
const Permissions = (...args: string[]) => ((target: any, key: string, descriptor: any) => descriptor);

@Controller('corrective-actions')
@UseGuards(AuthGuard, TenantGuard, PermissionGuard)
export class CorrectiveActionsController {
  constructor(private readonly caService: CorrectiveActionsService) {}

  @Post()
  @Permissions('corrective.create')
  async create(@Body() dto: CreateCorrectiveActionDto, @Request() req: any) {
    const data = await this.caService.create(dto, req.user.id, req.user.organizationId);
    return { success: true, data };
  }

  @Get()
  @Permissions('corrective.view')
  async findAll(@Query() query: FilterCorrectiveActionDto, @Request() req: any) {
    const data = await this.caService.findAll(query, req.user.organizationId);
    return { success: true, data };
  }

  @Patch(':id')
  @Permissions('corrective.update')
  async update(@Param('id') id: string, @Body() dto: UpdateCorrectiveActionDto, @Request() req: any) {
    const data = await this.caService.update(id, dto, req.user.id, req.user.organizationId);
    return { success: true, data };
  }

  @Post(':id/approve')
  @Permissions('corrective.approve')
  async approve(@Param('id') id: string, @Request() req: any) {
    const data = await this.caService.approve(id, req.user.id, req.user.organizationId);
    return { success: true, data };
  }
}
