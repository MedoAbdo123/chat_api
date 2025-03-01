import { IsNotEmpty, IsString, IsUrl } from "class-validator"

export class ChatDto {
    @IsString()
    @IsNotEmpty()
    chatId: string

    @IsString()
    @IsNotEmpty()
    senderId: string

    @IsString()
    @IsNotEmpty()
    message: string

    @IsString()
    username: string

    @IsString()
    @IsUrl()
    profile: string
}