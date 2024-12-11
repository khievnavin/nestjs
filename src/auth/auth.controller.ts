import { Body, Controller, Post, Req } from "@nestjs/common";
import { Request } from "express";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";

@Controller('auth')
export class AuthController{
    constructor(private authService: AuthService){}

    @Post('signup')
    signup(@Body() dto: AuthDto){
        console.log({dto,});
        return this.authService.signup(dto);
    }

    @Post('signin')
    signin(dto: AuthDto){
        return this.authService.signin(dto);
    }
}