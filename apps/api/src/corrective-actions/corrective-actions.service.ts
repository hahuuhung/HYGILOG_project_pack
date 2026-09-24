import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CorrectiveAction, CorrectiveActionDocument } from './schemas/corrective-action.schema';
import { CreateCorrectiveActionDto, UpdateCorrectiveActionDto, FilterCorrectiveActionDto } from './dto/corrective-action.dto';

@Injectable()
export class CorrectiveActionsService {
  constructor(@InjectModel(CorrectiveAction.name) private caModel: Model<CorrectiveActionDocument>) {}

  async create(dto: CreateCorrectiveActionDto, userId: string, organizationId: string): Promise<CorrectiveAction> {
    const doc = new this.caModel({
      ...dto,
      organizationId: new Types.ObjectId(organizationId),
      siteId: new Types.ObjectId(dto.siteId),
      reportedBy: new Types.ObjectId(userId),
      assignedTo: dto.assignedTo ? new Types.ObjectId(dto.assignedTo) : undefined,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
    });
    return doc.save();
  }

  async findAll(filters: FilterCorrectiveActionDto, organizationId: string) {
    const query: any = { organizationId: new Types.ObjectId(organizationId) };
    if (filters.siteId) query.siteId = new Types.ObjectId(filters.siteId);
    if (filters.status) query.status = filters.status;
    if (filters.severity) query.severity = filters.severity;
    if (filters.assignedTo) query.assignedTo = new Types.ObjectId(filters.assignedTo);

    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.caModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.caModel.countDocuments(query).exec(),
    ]);
    return { data, total, page, limit };
  }

  async update(id: string, dto: UpdateCorrectiveActionDto, userId: string, organizationId: string): Promise<CorrectiveAction> {
    const ca = await this.caModel.findOne({ _id: new Types.ObjectId(id), organizationId: new Types.ObjectId(organizationId) });
    if (!ca) throw new NotFoundException('Corrective Action not found');

    if (dto.status === 'resolved' && ca.status !== 'resolved') {
      if (!dto.resolution && !ca.resolution) throw new BadRequestException('Resolution required to resolve');
      ca.resolvedBy = new Types.ObjectId(userId);
      ca.resolvedAt = new Date();
    }

    if (dto.status) ca.status = dto.status;
    if (dto.resolution) ca.resolution = dto.resolution;
    if (dto.assignedTo) ca.assignedTo = new Types.ObjectId(dto.assignedTo);

    return ca.save();
  }

  async approve(id: string, userId: string, organizationId: string): Promise<CorrectiveAction> {
    const ca = await this.caModel.findOne({ _id: new Types.ObjectId(id), organizationId: new Types.ObjectId(organizationId) });
    if (!ca) throw new NotFoundException('Corrective Action not found');
    if (ca.status !== 'resolved') throw new BadRequestException('Can only approve resolved actions');

    ca.status = 'closed';
    ca.approvedBy = new Types.ObjectId(userId);
    ca.approvedAt = new Date();
    return ca.save();
  }
}
