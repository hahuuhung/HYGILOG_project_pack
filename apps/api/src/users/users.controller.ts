import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
// Mock imports for guards and decorators
const AuthGuard = class {};
const TenantGuard = class {};
const PermissionGuard = class {};
const Permissions = (...args: string[]) => ((target: any, key: string, descriptor: any) => descriptor);

@Controller('users')
@UseGuards(AuthGuard, TenantGuard, PermissionGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Permissions('users.create')
  async create(@Body() createUserDto: CreateUserDto, @Request() req: any) {
    const user = await this.usersService.create(createUserDto, req.user.organizationId);
    const { password, ...result } = user.toObject();
    return { success: true, data: result };
  }

  @Get()
  @Permissions('users.view')
  async findAll(@Request() req: any) {
    const users = await this.usersService.findAll(req.user.organizationId);
    const data = users.map(u => {
      const { password, ...result } = u.toObject();
      return result;
    });
    return { success: true, data };
  }

  @Get(':id')
  @Permissions('users.view')
  async findOne(@Param('id') id: string, @Request() req: any) {
    const user = await this.usersService.findOne(id, req.user.organizationId);
    const { password, ...result } = user.toObject();
    return { success: true, data: result };
  }

  @Patch(':id')
  @Permissions('users.update')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Request() req: any) {
    const user = await this.usersService.update(id, updateUserDto, req.user.organizationId);
    const { password, ...result } = user.toObject();
    return { success: true, data: result };
  }

  @Delete(':id')
  @Permissions('users.delete')
  async remove(@Param('id') id: string, @Request() req: any) {
    await this.usersService.remove(id, req.user.organizationId);
    return { success: true, data: null };
  }
}
