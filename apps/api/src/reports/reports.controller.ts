import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { TenantGuard } from '../auth/guards/tenant.guard';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { ReportsService } from './reports.service';

@Controller('reports')
@UseGuards(AuthGuard, TenantGuard, PermissionGuard)
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get('dashboard-stats')
  @Permissions('reports.view')
  async getDashboardStats(@Request() req: any) {
    const orgId = req.user.organizationId;
    return this.reportsService.getDashboardStats(orgId);
  }

  @Get('temperature-summary')
  @Permissions('reports.view')
  async getTemperatureSummary(@Request() req: any, @Query('siteId') siteId?: string) {
    const orgId = req.user.organizationId;
    return this.reportsService.getTemperatureSummary(orgId, siteId);
  }

  @Get('checklist-compliance')
  @Permissions('reports.view')
  async getChecklistCompliance(@Request() req: any) {
    const orgId = req.user.organizationId;
    return this.reportsService.getChecklistCompliance(orgId);
  }
}
