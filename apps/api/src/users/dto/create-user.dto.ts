import { IsString, IsEmail, IsOptional, IsEnum, IsArray, IsMongoId } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password?: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsMongoId()
  organizationId: string;

  @IsString()
  roleId: string;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  siteIds?: string[];

  @IsOptional()
  @IsEnum(['active', 'disabled'])
  status?: string;
}
