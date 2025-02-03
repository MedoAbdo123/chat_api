import { IsEmail, IsNotEmpty, IsObject, IsOptional, IsString, IsUrl } from "class-validator";
import { Types } from "mongoose";

export class CreatePostDto {
    @IsString()
    @IsOptional()
    title: string
    
    @IsString()
    @IsOptional()
    body: string

    @IsObject()
    userId: Types.ObjectId

    @IsUrl()
    @IsString()
    @IsOptional()
    image: string

    @IsString()
    username: string

    @IsString()
    @IsEmail()
    email: string

    @IsString()
    @IsUrl()
    profile: string
}