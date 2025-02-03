import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class FriendRequest extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  senderId: Types.ObjectId;  // 🛑 تأكد أن الاسم يتطابق مع `Dto`

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  receiverId: Types.ObjectId; // 🛑 تأكد أن الاسم يتطابق مع `Dto`

  @Prop({ enum: ['pending', 'accepted', 'declined'], default: 'pending' })
  status: string;

  @Prop({ref: 'User'})
  username: string

  @Prop({ref: 'Email'})
  email: string
  
  @Prop()
  profile: string
}

export const FriendRequestSchema = SchemaFactory.createForClass(FriendRequest);