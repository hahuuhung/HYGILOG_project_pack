import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { NfcService } from './nfc.service';
import { CreateNfcTagDto, UpdateNfcTagDto, ValidateNfcDto, ScanHistoryFilterDto } from './dto/nfc.dto';
const AuthGuard = class {}; const TenantGuard = class {}; const PermissionGuard = class {};
const Permissions = (...args: string[]) => ((target: any, key: string, descriptor: any) => descriptor);

@Controller('nfc')
@UseGuards(AuthGuard, TenantGuard, PermissionGuard)
export class NfcController {
  constructor(private readonly nfcService: NfcService) {}

  @Post('validate')
  @Permissions('nfc.validate')
  async validate(@Body() dto: ValidateNfcDto, @Request() req: any) {
    const data = await this.nfcService.validateAndScan(dto, req.user.id, req.user.organizationId);
    return { success: true, data };
  }

  @Post('tags')
  @Permissions('nfc.manage')
  async createTag(@Body() dto: CreateNfcTagDto, @Request() req: any) {
    const data = await this.nfcService.createTag(dto, req.user.id, req.user.organizationId);
    return { success: true, data };
  }

  @Patch('tags/:id')
  @Permissions('nfc.manage')
  async updateTag(@Param('id') id: string, @Body() dto: UpdateNfcTagDto, @Request() req: any) {
    const data = await this.nfcService.updateTag(id, dto, req.user.organizationId);
    return { success: true, data };
  }

  @Get('scans')
  @Permissions('nfc.manage')
  async getScans(@Query() query: ScanHistoryFilterDto, @Request() req: any) {
    const data = await this.nfcService.getScanHistory(query, req.user.organizationId);
    return { success: true, data };
  }
}
