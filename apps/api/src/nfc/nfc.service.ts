import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { NfcTag, NfcScan } from './schemas/nfc.schema';
import { CreateNfcTagDto, UpdateNfcTagDto, ValidateNfcDto, ScanHistoryFilterDto } from './dto/nfc.dto';

@Injectable()
export class NfcService {
  constructor(
    @InjectModel(NfcTag.name) private tagModel: Model<NfcTag>,
    @InjectModel(NfcScan.name) private scanModel: Model<NfcScan>
  ) {}

  async createTag(dto: CreateNfcTagDto, userId: string, organizationId: string): Promise<NfcTag> {
    const exists = await this.tagModel.findOne({ tagId: dto.tagId });
    if (exists) throw new BadRequestException('Tag ID already registered');

    const tag = new this.tagModel({
      ...dto,
      organizationId: new Types.ObjectId(organizationId),
      siteId: new Types.ObjectId(dto.siteId),
      registeredBy: new Types.ObjectId(userId),
      assignedTo: dto.assignedTo ? new Types.ObjectId(dto.assignedTo) : undefined,
    });
    return tag.save();
  }

  async updateTag(id: string, dto: UpdateNfcTagDto, organizationId: string): Promise<NfcTag> {
    const tag = await this.tagModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id), organizationId: new Types.ObjectId(organizationId) },
      { $set: dto },
      { new: true }
    );
    if (!tag) throw new NotFoundException('Tag not found');
    return tag;
  }

  async validateAndScan(dto: ValidateNfcDto, userId: string, organizationId: string): Promise<NfcScan> {
    const tag = await this.tagModel.findOne({ tagId: dto.tagId, organizationId: new Types.ObjectId(organizationId) });
    if (!tag) throw new NotFoundException('Tag not found or does not belong to your organization');
    if (tag.status !== 'active') throw new BadRequestException('Tag is disabled');

    // check 5 min duplicate
    const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000);
    const recentScan = await this.scanModel.findOne({
      tagId: dto.tagId,
      userId: new Types.ObjectId(userId),
      scannedAt: { $gte: fiveMinsAgo }
    });
    if (recentScan) throw new BadRequestException('Duplicate scan within 5 minutes');

    const scan = new this.scanModel({
      tagId: dto.tagId,
      userId: new Types.ObjectId(userId),
      siteId: tag.siteId,
      organizationId: tag.organizationId,
      location: tag.location,
      action: dto.action,
      payload: dto.payload,
    });
    return scan.save();
  }

  async getScanHistory(filters: ScanHistoryFilterDto, organizationId: string) {
    const query: any = { organizationId: new Types.ObjectId(organizationId) };
    if (filters.siteId) query.siteId = new Types.ObjectId(filters.siteId);
    if (filters.tagId) query.tagId = filters.tagId;
    if (filters.userId) query.userId = new Types.ObjectId(filters.userId);

    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.scanModel.find(query).sort({ scannedAt: -1 }).skip(skip).limit(limit).exec(),
      this.scanModel.countDocuments(query).exec(),
    ]);
    return { data, total, page, limit };
  }
}
