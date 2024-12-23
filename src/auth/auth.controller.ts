import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto, RefreshTokenDto } from "./dto";
import { AuthGuard } from "@nestjs/passport";
import RequestWithUser from "src/common/interface";

@Controller('auth')
export class AuthController{
    constructor(private authService: AuthService){}

    @Post('signup')
    signup(@Body() dto: AuthDto){
        console.log({dto,});
        return this.authService.signup(dto);
    }

    @Post('signin')
    signin(@Body() dto: AuthDto){
        return this.authService.signin(dto);
    }
    @Post('refresh')
    refreshToken(@Req() request: RequestWithUser, @Body() refreshTokendto: RefreshTokenDto){
        console.log('Request User:', request.user); // Debug log
        return this.authService.refreshToken(request, refreshTokendto);
    }

}