import { IsString, IsOptional, IsMongoId, IsDateString, IsNumber } from 'class-validator';

export class FilterAuditLogDto {
  @IsOptional() @IsString() action?: string;
  @IsOptional() @IsString() module?: string;
  @IsOptional() @IsMongoId() userId?: string;
  @IsOptional() @IsDateString() startDate?: string;
  @IsOptional() @IsDateString() endDate?: string;
  @IsOptional() @IsNumber() page?: number;
  @IsOptional() @IsNumber() limit?: number;
}
