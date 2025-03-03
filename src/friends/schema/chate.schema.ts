import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema()
class Message {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  sender: Types.ObjectId;
  
  @Prop({ type: String, required: true })
  message: string;

  @Prop({ type: Date, default: Date.now })
  timestamp: Date;
}

const MessageSchema = SchemaFactory.createForClass(Message);

@Schema()
export class Chat extends Document {
  @Prop({ type: [Types.ObjectId], ref: 'User', required: true }) 
  participants: Types.ObjectId[];

  @Prop({ type: [MessageSchema], default: [] }) 
  messages: Message[];

  @Prop({ type: Date, default: Date.now }) 
  createdAt: Date;
}
export const ChatSchema = SchemaFactory.createForClass(Chat);