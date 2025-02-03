import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUrl, MinLength } from "class-validator";

export class UserDto {
    @IsString()
    @IsNotEmpty()
    username: string

    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email: string

    @IsUrl()
    @IsString()
    @IsOptional()
    profile: string
    
    @IsString()
    @MinLength(8)
    @IsNotEmpty()
    password: string
}