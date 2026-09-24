import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Role extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true, enum: ['system', 'organization'], default: 'organization' })
  scope: string;

  @Prop({ type: [{ type: String }] })
  permissions: string[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Organization' })
  organizationId: string;

  @Prop({ default: false })
  isSystem: boolean;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
