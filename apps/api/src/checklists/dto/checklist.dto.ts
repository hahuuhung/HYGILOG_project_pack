import { IsString, IsMongoId, IsOptional, IsArray, ValidateNested, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

class ChecklistItemDto {
  @IsString() label: string;
  @IsOptional() @IsBoolean() checked?: boolean;
  @IsOptional() @IsString() notes?: string;
}

export class CreateChecklistDto {
  @IsString() title: string;
  @IsOptional() @IsMongoId() templateId?: string;
  @IsMongoId() siteId: string;
  @IsOptional() @IsMongoId() assignedTo?: string;
  @IsArray() @ValidateNested({ each: true }) @Type(() => ChecklistItemDto) items: ChecklistItemDto[];
}
