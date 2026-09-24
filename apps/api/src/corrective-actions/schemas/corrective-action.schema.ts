import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CorrectiveActionDocument = CorrectiveAction & Document;

@Schema({ timestamps: true })
export class CorrectiveAction {
  @Prop({ required: true }) title: string;
  @Prop({ required: true }) description: string;
  @Prop({ required: true }) category: string;
  @Prop({ required: true, enum: ['low', 'medium', 'high', 'critical'] }) severity: string;
  @Prop({ type: Types.ObjectId, required: true, index: true }) siteId: Types.ObjectId;
  @Prop({ type: Types.ObjectId, required: true, index: true }) organizationId: Types.ObjectId;
  @Prop({ type: Types.ObjectId, required: true }) reportedBy: Types.ObjectId;
  @Prop({ type: Types.ObjectId }) assignedTo?: Types.ObjectId;
  @Prop({ required: true, enum: ['open', 'in_progress', 'resolved', 'closed'], default: 'open' }) status: string;
  @Prop() resolution?: string;
  @Prop({ type: Types.ObjectId }) resolvedBy?: Types.ObjectId;
  @Prop() resolvedAt?: Date;
  @Prop({ type: Types.ObjectId }) approvedBy?: Types.ObjectId;
  @Prop() approvedAt?: Date;
  @Prop() dueDate?: Date;
}

export const CorrectiveActionSchema = SchemaFactory.createForClass(CorrectiveAction);
