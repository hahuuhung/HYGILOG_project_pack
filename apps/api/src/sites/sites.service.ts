import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Site, SiteDocument } from './schemas/site.schema';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';

@Injectable()
export class SitesService {
  constructor(@InjectModel(Site.name) private siteModel: Model<SiteDocument>) {}

  async create(createDto: CreateSiteDto, organizationId: string): Promise<Site> {
    const createdSite = new this.siteModel({
      ...createDto,
      organizationId: new Types.ObjectId(organizationId),
      managerId: createDto.managerId ? new Types.ObjectId(createDto.managerId) : undefined,
    });
    return createdSite.save();
  }

  async findAll(organizationId: string): Promise<Site[]> {
    return this.siteModel.find({ organizationId: new Types.ObjectId(organizationId) }).exec();
  }

  async findOne(id: string, organizationId: string): Promise<Site> {
    const site = await this.siteModel.findOne({ _id: new Types.ObjectId(id), organizationId: new Types.ObjectId(organizationId) }).exec();
    if (!site) throw new NotFoundException('Site not found');
    return site;
  }

  async update(id: string, updateDto: UpdateSiteDto, organizationId: string): Promise<Site> {
    const updated = await this.siteModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id), organizationId: new Types.ObjectId(organizationId) },
      { $set: updateDto },
      { new: true }
    ).exec();
    if (!updated) throw new NotFoundException('Site not found');
    return updated;
  }

  async remove(id: string, organizationId: string): Promise<void> {
    const result = await this.siteModel.deleteOne({ _id: new Types.ObjectId(id), organizationId: new Types.ObjectId(organizationId) }).exec();
    if (result.deletedCount === 0) throw new NotFoundException('Site not found');
  }
}
