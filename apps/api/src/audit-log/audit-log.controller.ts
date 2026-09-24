import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { AuditLogService } from './audit-log.service';
import { FilterAuditLogDto } from './dto/audit-log.dto';
const AuthGuard = class {}; const TenantGuard = class {}; const PermissionGuard = class {};
const Permissions = (...args: string[]) => ((target: any, key: string, descriptor: any) => descriptor);

@Controller('audit-logs')
@UseGuards(AuthGuard, TenantGuard, PermissionGuard)
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @Get()
  @Permissions('audit.view')
  async findAll(@Query() query: FilterAuditLogDto, @Request() req: any) {
    const data = await this.auditLogService.findAll(query, req.user.organizationId);
    return { success: true, data };
  }
}
