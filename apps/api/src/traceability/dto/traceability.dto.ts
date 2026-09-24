import { IsString, IsNumber, IsOptional, IsEnum, IsMongoId, IsDateString } from 'class-validator';

export class CreateBatchDto {
  @IsString() batchCode: string;
  @IsString() productName: string;
  @IsString() supplier: string;
  @IsDateString() receivedDate: string;
  @IsDateString() expiryDate: string;
  @IsNumber() quantity: number;
  @IsString() unit: string;
  @IsMongoId() siteId: string;
  @IsOptional() @IsString() storageLocation?: string;
  @IsOptional() @IsString() temperatureRequirement?: string;
  @IsOptional() @IsString() notes?: string;
}

export class UpdateBatchDto {
  @IsOptional() @IsEnum(['active', 'expired', 'recalled']) status?: string;
  @IsOptional() @IsString() storageLocation?: string;
  @IsOptional() @IsString() notes?: string;
}

export class BatchFilterDto {
  @IsOptional() @IsMongoId() siteId?: string;
  @IsOptional() @IsString() supplier?: string;
  @IsOptional() @IsEnum(['active', 'expired', 'recalled']) status?: string;
  @IsOptional() @IsDateString() startDate?: string;
  @IsOptional() @IsDateString() endDate?: string;
  @IsOptional() @IsNumber() page?: number;
  @IsOptional() @IsNumber() limit?: number;
}
