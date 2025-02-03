import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { Observable } from "rxjs";

@Injectable()
export class CommentGuard implements CanActivate {
    constructor(private jwtService: JwtService){}
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest<Request>()
        const token = request.headers.authorization.split(' ')[1]

        if(!token) throw new UnauthorizedException("Invalid token!")  

        try {
            request.user = this.jwtService.verify(token)  
        } catch(error) {
            console.log(token);
        }
        return true
    }
}