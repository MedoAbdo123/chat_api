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