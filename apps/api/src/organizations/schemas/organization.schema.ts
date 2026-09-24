import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrganizationDocument = Organization & Document;

@Schema({ timestamps: true })
export class Organization {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop()
  address?: string;

  @Prop()
  phone?: string;

  @Prop()
  email?: string;

  @Prop({ default: 'basic' })
  plan: string;

  @Prop({ required: true, enum: ['active', 'suspended'], default: 'active' })
  status: string;

  @Prop({ type: Object, default: {} })
  settings: Record<string, any>;
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);
