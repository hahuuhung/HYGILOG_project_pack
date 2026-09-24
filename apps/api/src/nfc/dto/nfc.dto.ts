import { IsString, IsOptional, IsEnum, IsMongoId, IsObject, IsNumber } from 'class-validator';

export class CreateNfcTagDto {
  @IsString() tagId: string;
  @IsString() label: string;
  @IsOptional() @IsString() location?: string;
  @IsMongoId() siteId: string;
  @IsOptional() @IsMongoId() assignedTo?: string;
}

export class UpdateNfcTagDto {
  @IsOptional() @IsString() label?: string;
  @IsOptional() @IsString() location?: string;
  @IsOptional() @IsEnum(['active', 'disabled']) status?: string;
  @IsOptional() @IsMongoId() assignedTo?: string;
}

export class ValidateNfcDto {
  @IsString() tagId: string;
  @IsOptional() @IsString() action?: string;
  @IsOptional() @IsObject() payload?: any;
}

export class ScanHistoryFilterDto {
  @IsOptional() @IsMongoId() siteId?: string;
  @IsOptional() @IsString() tagId?: string;
  @IsOptional() @IsMongoId() userId?: string;
  @IsOptional() @IsNumber() page?: number;
  @IsOptional() @IsNumber() limit?: number;
}
