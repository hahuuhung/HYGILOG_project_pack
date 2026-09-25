import { Controller, Get, UseGuards, Request } from '@nestjs/common';
const AuthGuard = class {}; const TenantGuard = class {}; const PermissionGuard = class {};
const Permissions = (...args: string[]) => ((target: any, key: string, descriptor: any) => descriptor);

@Controller('reports')
@UseGuards(AuthGuard, TenantGuard, PermissionGuard)
export class ReportsController {
  @Get('dashboard-stats')
  @Permissions('reports.view')
  getStats() {
    return { success: true, data: { ok: 10, warning: 2, critical: 0 } };
  }
}
