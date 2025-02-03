import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema({timestamps: true})
export class Post {

    @Prop({required: false})
    title: string

    @Prop({required: false})
    body: string

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Comment' }] })
    comments: Types.ObjectId[];

    @Prop({required: false})
    image: string

    @Prop({type: Types.ObjectId})
    userId: Types.ObjectId

    @Prop()
    email: string

    @Prop()
    username: string

    @Prop()
    profile: string

    @Prop({type: Date, default: Date.now})
    createdAt: Date
}

export const PostSchema = SchemaFactory.createForClass(Post)