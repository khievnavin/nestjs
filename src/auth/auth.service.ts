import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import * as argon from "argon2"
import { AuthDto, RefreshTokenDto } from "./dto";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import RequestWithUser from "src/common/interface";
import { User } from "@prisma/client";
import { Hash } from "crypto";

@Injectable({})
export class AuthService{
    constructor(
        private prisma: PrismaService, 
        private jwt: JwtService,
        private config: ConfigService
    ){}
    async signup(dto: AuthDto){
        try{
        //generte the pwd hash
        const hash = await argon.hash(dto.password);

        //save the new user in db
        const user = await this.prisma.user.create({
            data:{
                email: dto.email,
                hash,
            },
        });

         // Generate tokens
         const tokens = await this.getToken(user.id, user.email);

         // Update the refresh token in the database
         await this.updateRefreshToken(user, tokens.refresh_token);
 
         return tokens;
        }
        catch(error){
            if(error instanceof PrismaClientKnownRequestError){
                if(error.code === 'P2002'){
                    throw new ForbiddenException('This Email is already exist')
                }
            }
            throw error;
        }
    }
    
    async signin(dto: AuthDto){
        //find the user by email
        console.log('infor login: ',dto);
        
        const user = await this.prisma.user.findUnique({
            where:{
                email: dto.email,
            },
        });
        //if user doesn't exist throm exception
        if(!user)
            throw new ForbiddenException('Credentail Incorrect');

        //compare password
        const pwMatch = await argon.verify(
                user.hash,
                dto.password,
                );

        //if password incorrect throm exception
        if(!pwMatch)
            throw new ForbiddenException('Credentail Incorrect');

    // Generate tokens
    const tokens = await this.getToken(user.id, user.email);

    // Update the refresh token in the database
    await this.updateRefreshToken(user, tokens.refresh_token);

    return tokens;
    }

    async getToken(userId: number, email: string): Promise<{ access_token: string; refresh_token: string }> {
       
        const payload = { sub: userId, email }
        
        const accessToken = await this.jwt.signAsync(payload, {
            expiresIn: '15m',
            secret: this.config.get('JWT_SECRET'),
        });

        const refreshToken = await this.jwt.signAsync(payload, {
            expiresIn: '7d',
            secret: this.config.get('JWT_REFRESH_SECRET'),
        });

        return {
            access_token: accessToken,
            refresh_token: refreshToken,
        };
    }

    async refreshToken(request: RequestWithUser, refreshTokenDto: RefreshTokenDto): Promise<{ access_token: string; refresh_token: string }> {
        
        const {refreshToken} = refreshTokenDto

        const user = await this.prisma.user.findUnique({
            where: { id: request.user.id },
        });

        if (!user) throw new ForbiddenException('Access Denied');

        // Verify the refresh token
        const payload = await this.jwt.verifyAsync(refreshToken, {
            secret: this.config.get('JWT_REFRESH_SECRET'),
        });

        if (payload.sub !== user.id) throw new ForbiddenException('Access Denied');

        // Generate new tokens
        const tokens = await this.getToken(user.id, user.email);

        // Update the refresh token in the database
        await this.updateRefreshToken(user, tokens.refresh_token);

        return tokens;
    }

    async updateRefreshToken(userId: User, refreshToken: string): Promise<void> {
        // Hash the refresh token
        const hashedRefreshToken = await argon.hash(refreshToken);
    
        // Update the user's record with the hashed token
        await this.prisma.user.update({
            where: { 
                id: userId.id
            },
            data: { 
                refreshToken: hashedRefreshToken
            },
        });
    }
    
}