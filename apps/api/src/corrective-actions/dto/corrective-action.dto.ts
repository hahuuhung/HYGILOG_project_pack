import { IsString, IsOptional, IsEnum, IsMongoId, IsDateString, IsNumber } from 'class-validator';

export class CreateCorrectiveActionDto {
  @IsString() title: string;
  @IsString() description: string;
  @IsString() category: string;
  @IsEnum(['low', 'medium', 'high', 'critical']) severity: string;
  @IsMongoId() siteId: string;
  @IsOptional() @IsMongoId() assignedTo?: string;
  @IsOptional() @IsDateString() dueDate?: string;
}

export class UpdateCorrectiveActionDto {
  @IsOptional() @IsEnum(['open', 'in_progress', 'resolved', 'closed']) status?: string;
  @IsOptional() @IsString() resolution?: string;
  @IsOptional() @IsMongoId() assignedTo?: string;
}

export class ApproveCorrectiveActionDto {
  @IsString() resolutionNotes?: string;
}

export class FilterCorrectiveActionDto {
  @IsOptional() @IsMongoId() siteId?: string;
  @IsOptional() @IsEnum(['open', 'in_progress', 'resolved', 'closed']) status?: string;
  @IsOptional() @IsEnum(['low', 'medium', 'high', 'critical']) severity?: string;
  @IsOptional() @IsMongoId() assignedTo?: string;
  @IsOptional() @IsNumber() page?: number;
  @IsOptional() @IsNumber() limit?: number;
}
