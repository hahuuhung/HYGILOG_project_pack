import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Checklist, ChecklistDocument } from './schemas/checklist.schema';
import { CreateChecklistDto } from './dto/checklist.dto';

@Injectable()
export class ChecklistsService {
  constructor(@InjectModel(Checklist.name) private checklistModel: Model<ChecklistDocument>) {}

  async create(dto: CreateChecklistDto, organizationId: string): Promise<Checklist> {
    const checklist = new this.checklistModel({
      ...dto,
      organizationId: new Types.ObjectId(organizationId),
      siteId: new Types.ObjectId(dto.siteId),
      assignedTo: dto.assignedTo ? new Types.ObjectId(dto.assignedTo) : undefined,
      templateId: dto.templateId ? new Types.ObjectId(dto.templateId) : undefined,
    });
    return checklist.save();
  }

  async findAll(organizationId: string): Promise<Checklist[]> {
    return this.checklistModel.find({ organizationId: new Types.ObjectId(organizationId) }).exec();
  }
}
