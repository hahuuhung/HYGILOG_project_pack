import { IsNumber, IsString, IsOptional, IsEnum, IsMongoId, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTemperatureDto {
  @IsNumber()
  value: number;

  @IsEnum(['C', 'F'])
  unit: string;

  @IsString()
  equipmentName: string;

  @IsOptional()
  @IsString()
  equipmentType?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsMongoId()
  siteId: string;

  @IsOptional()
  @IsNumber()
  minThreshold?: number;

  @IsOptional()
  @IsNumber()
  maxThreshold?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class BatchCreateTemperatureDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTemperatureDto)
  records: CreateTemperatureDto[];
}

export class TemperatureFilterDto {
  @IsOptional()
  @IsMongoId()
  siteId?: string;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;

  @IsOptional()
  @IsEnum(['ok', 'warning', 'critical'])
  status?: string;
}
