import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class AuditLog extends Document {
  @Prop({ required: true }) action: string;
  @Prop({ required: true }) module: string;
  @Prop() resourceId?: string;
  @Prop() resourceType?: string;
  @Prop({ type: Types.ObjectId, required: true, index: true }) userId: Types.ObjectId;
  @Prop({ type: Types.ObjectId, required: true, index: true }) organizationId: Types.ObjectId;
  @Prop({ type: Object, default: {} }) details: Record<string, any>;
  @Prop() ipAddress?: string;
  @Prop() userAgent?: string;
  createdAt: Date;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);
