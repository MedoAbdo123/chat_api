import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { Observable } from "rxjs";

@Injectable()
export class PostGuard implements CanActivate {
    constructor(private jwtService: JwtService){}
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const requst = context.switchToHttp().getRequest<Request>()
        const token = requst.headers.authorization.split(' ')[1]

        if(!token) throw new UnauthorizedException("Invalid token")
        try {
            requst.user = this.jwtService.verify(token)
        }catch(error){
            return error
        }
        return true
    }
}