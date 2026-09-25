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

  async create(createUserDto: CreateUserDto, organizationId: string): Promise<User> {
    const hashedPassword = createUserDto.password ? await bcrypt.hash(createUserDto.password, 10) : undefined;
    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
      organizationId: new Types.ObjectId(organizationId),
    });
    return createdUser.save();
  }

  async findAll(organizationId: string): Promise<User[]> {
    return this.userModel.find({ organizationId: new Types.ObjectId(organizationId) }).exec();
  }

  async findOne(id: string, organizationId: string): Promise<User> {
    const user = await this.userModel.findOne({ _id: new Types.ObjectId(id), organizationId: new Types.ObjectId(organizationId) }).exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto, organizationId: string): Promise<User> {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    const updatedUser = await this.userModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id), organizationId: new Types.ObjectId(organizationId) },
      { $set: updateUserDto },
      { new: true }
    ).exec();
    if (!updatedUser) throw new NotFoundException('User not found');
    return updatedUser;
  }

  async remove(id: string, organizationId: string): Promise<void> {
    const result = await this.userModel.deleteOne({ _id: new Types.ObjectId(id), organizationId: new Types.ObjectId(organizationId) }).exec();
    if (result.deletedCount === 0) throw new NotFoundException('User not found');
  }
}
