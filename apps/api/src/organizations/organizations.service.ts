import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Organization, OrganizationDocument } from './schemas/organization.schema';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@Injectable()
export class OrganizationsService {
  constructor(@InjectModel(Organization.name) private orgModel: Model<OrganizationDocument>) {}

  async findById(id: string): Promise<Organization> {
    const org = await this.orgModel.findById(new Types.ObjectId(id)).exec();
    if (!org) throw new NotFoundException('Organization not found');
    return org;
  }

  async update(id: string, updateOrgDto: UpdateOrganizationDto): Promise<Organization> {
    const updatedOrg = await this.orgModel.findByIdAndUpdate(
      new Types.ObjectId(id),
      { $set: updateOrgDto },
      { new: true }
    ).exec();
    if (!updatedOrg) throw new NotFoundException('Organization not found');
    return updatedOrg;
  }
}
