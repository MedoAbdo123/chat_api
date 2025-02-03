import { IsNotEmpty, IsOptional, IsString, IsUrl } from "class-validator";

export class updateUserDto {
    @IsString()
    @IsOptional()
    username: string

    @IsUrl()
    @IsString()
    @IsOptional()
    profile: string
}