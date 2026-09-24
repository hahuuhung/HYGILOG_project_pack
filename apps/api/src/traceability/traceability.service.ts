import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Batch, BatchDocument } from './schemas/batch.schema';
import { CreateBatchDto, UpdateBatchDto, BatchFilterDto } from './dto/traceability.dto';

@Injectable()
export class TraceabilityService {
  constructor(@InjectModel(Batch.name) private batchModel: Model<BatchDocument>) {}

  async create(dto: CreateBatchDto, userId: string, organizationId: string): Promise<Batch> {
    const batch = new this.batchModel({
      ...dto,
      organizationId: new Types.ObjectId(organizationId),
      siteId: new Types.ObjectId(dto.siteId),
      recordedBy: new Types.ObjectId(userId),
    });
    return batch.save();
  }

  async findAll(filters: BatchFilterDto, organizationId: string) {
    const query: any = { organizationId: new Types.ObjectId(organizationId) };
    if (filters.siteId) query.siteId = new Types.ObjectId(filters.siteId);
    if (filters.supplier) query.supplier = new RegExp(filters.supplier, 'i');
    if (filters.status) query.status = filters.status;
    if (filters.startDate || filters.endDate) {
      query.receivedDate = {};
      if (filters.startDate) query.receivedDate.$gte = new Date(filters.startDate);
      if (filters.endDate) query.receivedDate.$lte = new Date(filters.endDate);
    }

    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.batchModel.find(query).sort({ receivedDate: -1 }).skip(skip).limit(limit).exec(),
      this.batchModel.countDocuments(query).exec(),
    ]);

    return { data, total, page, limit };
  }

  async findExpiring(organizationId: string, days: number = 7) {
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() + days);
    return this.batchModel.find({
      organizationId: new Types.ObjectId(organizationId),
      status: 'active',
      expiryDate: { $lte: dateThreshold, $gte: new Date() }
    }).exec();
  }

  async update(id: string, dto: UpdateBatchDto, organizationId: string): Promise<Batch> {
    const batch = await this.batchModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id), organizationId: new Types.ObjectId(organizationId) },
      { $set: dto },
      { new: true }
    ).exec();
    if (!batch) throw new NotFoundException('Batch not found');
    return batch;
  }
}
