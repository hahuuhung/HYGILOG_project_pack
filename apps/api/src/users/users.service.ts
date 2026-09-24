import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto, organizationId: string): Promise<UserDocument> {
    const hashedPassword = createUserDto.password ? await bcrypt.hash(createUserDto.password, 10) : undefined;
    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
      organizationId: new Types.ObjectId(organizationId),
      siteIds: createUserDto.siteIds ? createUserDto.siteIds.map(s => new Types.ObjectId(s)) : [],
    });
    return createdUser.save();
  }

  async findAll(organizationId: string): Promise<UserDocument[]> {
    return this.userModel.find({ organizationId: new Types.ObjectId(organizationId) }).exec();
  }

  async findOne(id: string, organizationId: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ 
      _id: new Types.ObjectId(id), 
      organizationId: new Types.ObjectId(organizationId) 
    }).exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findById(id: string): Promise<UserDocument | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return this.userModel.findById(new Types.ObjectId(id)).exec();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email: email.toLowerCase().trim() }).exec();
  }

  async updateRefreshToken(id: string, refreshToken: string | null): Promise<void> {
    await this.userModel.updateOne(
      { _id: new Types.ObjectId(id) },
      { $set: { refreshToken: refreshToken || undefined } }
    ).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto, organizationId: string): Promise<UserDocument> {
    const updateData: Record<string, any> = { ...updateUserDto };
    if (updateUserDto.password) {
      updateData.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    if (updateUserDto.siteIds) {
      updateData.siteIds = updateUserDto.siteIds.map(s => new Types.ObjectId(s));
    }
    const updatedUser = await this.userModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id), organizationId: new Types.ObjectId(organizationId) },
      { $set: updateData },
      { new: true }
    ).exec();
    if (!updatedUser) throw new NotFoundException('User not found');
    return updatedUser;
  }

  async remove(id: string, organizationId: string): Promise<void> {
    const result = await this.userModel.deleteOne({ 
      _id: new Types.ObjectId(id), 
      organizationId: new Types.ObjectId(organizationId) 
    }).exec();
    if (result.deletedCount === 0) throw new NotFoundException('User not found');
  }
}
