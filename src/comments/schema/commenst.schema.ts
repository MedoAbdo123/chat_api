import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema()
export class Comments {
    @Prop({required: true})
    text: string

    @Prop({type: Types.ObjectId, ref: 'User'})
    userId: Types.ObjectId

    @Prop()
    email: string

    @Prop()
    username: string

    @Prop()
    profile: string
}

export const CommentsSchema = SchemaFactory.createForClass(Comments)

/**
 * @Schema()
export class Comment {
    @Prop({ required: true })
    text: string;

    @Prop({ type: Types.ObjectId, ref: 'User' })
    userId: Types.ObjectId;

    @Prop()
    username: string;

    @Prop()
    email: string;

    @Prop()
    profile: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

 */