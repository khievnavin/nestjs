import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import * as argon from "argon2"
import { AuthDto } from "./dto";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

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
        //delete user.hash;

        return this.signToken(user.id, user.email);
        //return the saved user
        }
        catch(error){
            if(error instanceof PrismaClientKnownRequestError){
                if(error.code === 'P2002'){
                    throw new ForbiddenException('Credentiald Taken')
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

        //send back to the user
        //delete user.hash;

        return this.signToken(user.id, user.email);
    }

    async signToken(userId: number , email: string): Promise<{access_token: string}>{
        const payload = {
            sub: userId, email
        }
        const secret = this.config.get("JWT_SECRET")
        const token = await this.jwt.signAsync(payload,{
            expiresIn: '15m',
            secret: secret,
        })

    return{
        access_token: token,
    }
    }
}