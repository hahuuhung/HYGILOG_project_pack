import { Controller, Get, Post, Body, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { TemperatureService } from './temperature.service';
import { CreateTemperatureDto, BatchCreateTemperatureDto, TemperatureFilterDto } from './dto/temperature.dto';
const AuthGuard = class {}; const TenantGuard = class {}; const PermissionGuard = class {};
const Permissions = (...args: string[]) => ((target: any, key: string, descriptor: any) => descriptor);

@Controller('temperature')
@UseGuards(AuthGuard, TenantGuard, PermissionGuard)
export class TemperatureController {
  constructor(private readonly tempService: TemperatureService) {}

  @Post()
  @Permissions('temperature.create')
  async create(@Body() createDto: CreateTemperatureDto, @Request() req: any) {
    const res = await this.tempService.create(createDto, req.user.id, req.user.organizationId);
    return { success: true, data: res };
  }

  @Post('batch')
  @Permissions('temperature.create')
  async batchCreate(@Body() batchDto: BatchCreateTemperatureDto, @Request() req: any) {
    const res = await this.tempService.batchCreate(batchDto, req.user.id, req.user.organizationId);
    return { success: true, data: res };
  }

  @Get()
  @Permissions('temperature.view')
  async findAll(@Query() query: TemperatureFilterDto, @Request() req: any) {
    const res = await this.tempService.findAll(query, req.user.organizationId);
    return { success: true, data: res };
  }

  @Get(':id')
  @Permissions('temperature.view')
  async findOne(@Param('id') id: string, @Request() req: any) {
    const res = await this.tempService.findOne(id, req.user.organizationId);
    return { success: true, data: res };
  }

  @Delete(':id')
  @Permissions('temperature.delete')
  async remove(@Param('id') id: string, @Request() req: any) {
    await this.tempService.remove(id, req.user.organizationId);
    return { success: true, data: null };
  }
}
