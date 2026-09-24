import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ChecklistsService } from './checklists.service';
import { CreateChecklistDto } from './dto/checklist.dto';
const AuthGuard = class {}; const TenantGuard = class {}; const PermissionGuard = class {};
const Permissions = (...args: string[]) => ((target: any, key: string, descriptor: any) => descriptor);

@Controller('checklists')
@UseGuards(AuthGuard, TenantGuard, PermissionGuard)
export class ChecklistsController {
  constructor(private readonly clService: ChecklistsService) {}

  @Post()
  @Permissions('checklists.create')
  async create(@Body() dto: CreateChecklistDto, @Request() req: any) {
    const res = await this.clService.create(dto, req.user.organizationId);
    return { success: true, data: res };
  }

  @Get()
  @Permissions('checklists.view')
  async findAll(@Request() req: any) {
    const res = await this.clService.findAll(req.user.organizationId);
    return { success: true, data: res };
  }
}
