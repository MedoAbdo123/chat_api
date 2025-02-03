import { IsOptional, IsString } from "class-validator";

export class UpadtePostDto {
    @IsString()
    @IsOptional()
    title: string
    
    @IsString()
    @IsOptional()
    body: string
}