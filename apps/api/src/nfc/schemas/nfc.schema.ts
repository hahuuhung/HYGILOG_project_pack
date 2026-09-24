import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class NfcTag extends Document {
  @Prop({ required: true, unique: true, index: true }) tagId: string;
  @Prop({ required: true }) label: string;
  @Prop() location?: string;
  @Prop({ type: Types.ObjectId, required: true }) siteId: Types.ObjectId;
  @Prop({ type: Types.ObjectId, required: true }) organizationId: Types.ObjectId;
  @Prop({ required: true, enum: ['active', 'disabled'], default: 'active' }) status: string;
  @Prop({ type: Types.ObjectId }) assignedTo?: Types.ObjectId;
  @Prop({ type: Types.ObjectId }) registeredBy?: Types.ObjectId;
}

@Schema({ timestamps: { createdAt: 'scannedAt', updatedAt: false } })
export class NfcScan extends Document {
  @Prop({ required: true, index: true }) tagId: string;
  @Prop({ type: Types.ObjectId, required: true }) userId: Types.ObjectId;
  @Prop({ type: Types.ObjectId, required: true }) siteId: Types.ObjectId;
  @Prop({ type: Types.ObjectId, required: true }) organizationId: Types.ObjectId;
  @Prop() location?: string;
  @Prop() action?: string;
  @Prop({ type: Object }) payload?: any;
  scannedAt: Date;
}

export const NfcTagSchema = SchemaFactory.createForClass(NfcTag);
export const NfcScanSchema = SchemaFactory.createForClass(NfcScan);
