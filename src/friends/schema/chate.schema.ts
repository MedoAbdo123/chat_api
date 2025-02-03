import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema()
export class Chat extends Document {
    @Prop({ type: [Types.ObjectId], ref: 'User' }) 
    participants: Types.ObjectId[];

    @Prop({ type: Date, default: Date.now }) 
    createdAt: Date;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);