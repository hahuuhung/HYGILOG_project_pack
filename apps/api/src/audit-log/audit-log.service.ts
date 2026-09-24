import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AuditLog } from './schemas/audit-log.schema';
import { FilterAuditLogDto } from './dto/audit-log.dto';

@Injectable()
export class AuditLogService {
  constructor(@InjectModel(AuditLog.name) private logModel: Model<AuditLog>) {}

  async log(data: {
    action: string;
    module: string;
    resourceId?: string;
    resourceType?: string;
    userId: string;
    organizationId: string;
    details?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<AuditLog> {
    const logEntry = new this.logModel({
      ...data,
      userId: new Types.ObjectId(data.userId),
      organizationId: new Types.ObjectId(data.organizationId),
    });
    return logEntry.save();
  }

  async findAll(filters: FilterAuditLogDto, organizationId: string) {
    const query: any = { organizationId: new Types.ObjectId(organizationId) };
    if (filters.action) query.action = filters.action;
    if (filters.module) query.module = filters.module;
    if (filters.userId) query.userId = new Types.ObjectId(filters.userId);

    if (filters.startDate || filters.endDate) {
      query.createdAt = {};
      if (filters.startDate) query.createdAt.$gte = new Date(filters.startDate);
      if (filters.endDate) query.createdAt.$lte = new Date(filters.endDate);
    }

    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.logModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.logModel.countDocuments(query).exec(),
    ]);

    return { data, total, page, limit };
  }
}
