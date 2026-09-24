import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TemperatureRecordDocument = TemperatureRecord & Document;

@Schema({ timestamps: true })
export class TemperatureRecord {
  @Prop({ required: true })
  value: number;

  @Prop({ required: true, enum: ['C', 'F'] })
  unit: string;

  @Prop({ required: true })
  equipmentName: string;

  @Prop()
  equipmentType?: string;

  @Prop()
  location?: string;

  @Prop({ type: Types.ObjectId, required: true, index: true })
  siteId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, index: true })
  organizationId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  recordedBy: Types.ObjectId;

  @Prop({ required: true, enum: ['ok', 'warning', 'critical'] })
  status: string;

  @Prop()
  minThreshold?: number;

  @Prop()
  maxThreshold?: number;

  @Prop()
  notes?: string;

  @Prop({ default: 'synced' })
  syncStatus: string;
}

export const TemperatureRecordSchema = SchemaFactory.createForClass(TemperatureRecord);
