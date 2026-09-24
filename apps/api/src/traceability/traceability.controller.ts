import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { TraceabilityService } from './traceability.service';
import { CreateBatchDto, UpdateBatchDto, BatchFilterDto } from './dto/traceability.dto';
const AuthGuard = class {}; const TenantGuard = class {}; const PermissionGuard = class {};
const Permissions = (...args: string[]) => ((target: any, key: string, descriptor: any) => descriptor);

@Controller('traceability')
@UseGuards(AuthGuard, TenantGuard, PermissionGuard)
export class TraceabilityController {
  constructor(private readonly traceabilityService: TraceabilityService) {}

  @Post()
  @Permissions('traceability.create')
  async create(@Body() dto: CreateBatchDto, @Request() req: any) {
    const data = await this.traceabilityService.create(dto, req.user.id, req.user.organizationId);
    return { success: true, data };
  }

  @Get()
  @Permissions('traceability.view')
  async findAll(@Query() query: BatchFilterDto, @Request() req: any) {
    const data = await this.traceabilityService.findAll(query, req.user.organizationId);
    return { success: true, data };
  }

  @Get('expiring')
  @Permissions('traceability.view')
  async findExpiring(@Request() req: any) {
    const data = await this.traceabilityService.findExpiring(req.user.organizationId);
    return { success: true, data };
  }

  @Patch(':id')
  @Permissions('traceability.update')
  async update(@Param('id') id: string, @Body() dto: UpdateBatchDto, @Request() req: any) {
    const data = await this.traceabilityService.update(id, dto, req.user.organizationId);
    return { success: true, data };
  }
}
