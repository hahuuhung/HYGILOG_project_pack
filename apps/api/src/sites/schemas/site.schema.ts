import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SiteDocument = Site & Document;

@Schema({ timestamps: true })
export class Site {
  @Prop({ required: true })
  name: string;

  @Prop()
  address?: string;

  @Prop()
  type?: string;

  @Prop({ type: Types.ObjectId, required: true, index: true })
  organizationId: Types.ObjectId;

  @Prop({ type: Types.ObjectId })
  managerId?: Types.ObjectId;

  @Prop({ required: true, enum: ['active', 'inactive'], default: 'active' })
  status: string;

  @Prop({ default: 'UTC' })
  timezone: string;
}

export const SiteSchema = SchemaFactory.createForClass(Site);
