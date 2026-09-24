import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class ChecklistItem {
  @Prop({ required: true }) label: string;
  @Prop({ required: true, default: false }) checked: boolean;
  @Prop() notes?: string;
  @Prop({ type: Types.ObjectId }) checkedBy?: Types.ObjectId;
  @Prop() checkedAt?: Date;
}

export type ChecklistDocument = Checklist & Document;

@Schema({ timestamps: true })
export class Checklist {
  @Prop({ required: true }) title: string;
  @Prop({ type: Types.ObjectId }) templateId?: Types.ObjectId;
  @Prop({ type: Types.ObjectId, required: true, index: true }) siteId: Types.ObjectId;
  @Prop({ type: Types.ObjectId, required: true, index: true }) organizationId: Types.ObjectId;
  @Prop({ type: Types.ObjectId }) assignedTo?: Types.ObjectId;
  @Prop({ type: [ChecklistItem], default: [] }) items: ChecklistItem[];
  @Prop({ required: true, enum: ['pending', 'in_progress', 'completed', 'approved'], default: 'pending' }) status: string;
  @Prop({ default: 0 }) progress: number;
  @Prop() completedAt?: Date;
  @Prop({ type: Types.ObjectId }) approvedBy?: Types.ObjectId;
  @Prop() approvedAt?: Date;
}
export const ChecklistSchema = SchemaFactory.createForClass(Checklist);
