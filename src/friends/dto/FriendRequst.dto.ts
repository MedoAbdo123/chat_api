import { IsEmail, IsNotEmpty, IsString, IsUrl } from "class-validator";

export class FriendRequestDto {
    @IsString()
    @IsNotEmpty()
    senderId: string

    @IsString()
    @IsNotEmpty()
    receiverId: string

    @IsString()
    status: string

    @IsString()
    username: string

    @IsString()
    @IsEmail()
    email: string

    @IsString()
    @IsUrl()
    profile: string
}