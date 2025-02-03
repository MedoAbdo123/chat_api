import { IsEmail, IsNotEmpty, IsString, IsUrl } from "class-validator";

export class CommentDto {
    @IsString()
    @IsNotEmpty()
    text: string

    @IsString()
    username: string

    @IsString()
    @IsEmail()
    email: string

    @IsString()
    @IsUrl()
    profile: string
}