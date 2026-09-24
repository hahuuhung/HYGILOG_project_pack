import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { TemperatureRecord, TemperatureRecordDocument } from './schemas/temperature.schema';
import { CreateTemperatureDto, BatchCreateTemperatureDto, TemperatureFilterDto } from './dto/temperature.dto';

@Injectable()
export class TemperatureService {
  constructor(@InjectModel(TemperatureRecord.name) private tempModel: Model<TemperatureRecordDocument>) {}

  private determineStatus(value: number, min?: number, max?: number): string {
    if (min !== undefined && value < min) return 'critical';
    if (max !== undefined && value > max) return 'critical';
    return 'ok'; // Simplified logic
  }

  async create(dto: CreateTemperatureDto, userId: string, organizationId: string): Promise<TemperatureRecord> {
    const status = this.determineStatus(dto.value, dto.minThreshold, dto.maxThreshold);
    const record = new this.tempModel({
      ...dto,
      status,
      organizationId: new Types.ObjectId(organizationId),
      siteId: new Types.ObjectId(dto.siteId),
      recordedBy: new Types.ObjectId(userId),
    });
    return record.save();
  }

  async batchCreate(dto: BatchCreateTemperatureDto, userId: string, organizationId: string): Promise<TemperatureRecord[]> {
    const records = dto.records.map(r => ({
      ...r,
      status: this.determineStatus(r.value, r.minThreshold, r.maxThreshold),
      organizationId: new Types.ObjectId(organizationId),
      siteId: new Types.ObjectId(r.siteId),
      recordedBy: new Types.ObjectId(userId),
    }));
    return this.tempModel.insertMany(records);
  }

  async findAll(filters: TemperatureFilterDto, organizationId: string): Promise<TemperatureRecord[]> {
    const query: any = { organizationId: new Types.ObjectId(organizationId) };
    if (filters.siteId) query.siteId = new Types.ObjectId(filters.siteId);
    if (filters.status) query.status = filters.status;
    if (filters.startDate || filters.endDate) {
      query.createdAt = {};
      if (filters.startDate) query.createdAt.$gte = new Date(filters.startDate);
      if (filters.endDate) query.createdAt.$lte = new Date(filters.endDate);
    }
    return this.tempModel.find(query).sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string, organizationId: string): Promise<TemperatureRecord> {
    const rec = await this.tempModel.findOne({ _id: new Types.ObjectId(id), organizationId: new Types.ObjectId(organizationId) }).exec();
    if (!rec) throw new NotFoundException('Record not found');
    return rec;
  }

  async remove(id: string, organizationId: string): Promise<void> {
    const result = await this.tempModel.deleteOne({ _id: new Types.ObjectId(id), organizationId: new Types.ObjectId(organizationId) }).exec();
    if (result.deletedCount === 0) throw new NotFoundException('Record not found');
  }
}
