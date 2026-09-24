import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BatchDocument = Batch & Document;

@Schema({ timestamps: true })
export class Batch {
  @Prop({ required: true, index: true })
  batchCode: string;

  @Prop({ required: true })
  productName: string;

  @Prop({ required: true })
  supplier: string;

  @Prop({ required: true })
  receivedDate: Date;

  @Prop({ required: true, index: true })
  expiryDate: Date;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  unit: string;

  @Prop({ type: Types.ObjectId, required: true, index: true })
  siteId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, index: true })
  organizationId: Types.ObjectId;

  @Prop({ required: true, enum: ['active', 'expired', 'recalled'], default: 'active' })
  status: string;

  @Prop()
  storageLocation?: string;

  @Prop()
  temperatureRequirement?: string;

  @Prop()
  notes?: string;

  @Prop({ type: Types.ObjectId, required: true })
  recordedBy: Types.ObjectId;
}

export const BatchSchema = SchemaFactory.createForClass(Batch);
