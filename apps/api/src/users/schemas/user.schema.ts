import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ 
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (_doc, ret: Record<string, any>) => {
      delete ret.password;
      delete ret.refreshToken;
      return ret;
    },
  },
})
export class User {
  @Prop({ required: true, unique: true, lowercase: true, trim: true, index: true })
  email: string;

  @Prop({ required: true })
  password?: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ type: Types.ObjectId, required: true, index: true })
  organizationId: Types.ObjectId;

  @Prop({ required: true, index: true })
  roleId: string;

  @Prop({ type: [Types.ObjectId], default: [] })
  siteIds: Types.ObjectId[];

  @Prop({ required: true, enum: ['active', 'disabled'], default: 'active' })
  status: string;

  @Prop()
  refreshToken?: string;

  @Prop()
  lastLogin?: Date;

  // Virtual for fullName
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`.trim();
  }

  get isActive(): boolean {
    return this.status === 'active';
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('fullName').get(function (this: User) {
  return `${this.firstName || ''} ${this.lastName || ''}`.trim();
});

UserSchema.virtual('isActive').get(function (this: User) {
  return this.status === 'active';
});
