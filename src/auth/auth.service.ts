import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import * as argon from "argon2"
import { AuthDto } from "./dto";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

@Injectable({})
export class AuthService{
    constructor(private prisma: PrismaService){}
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
        delete user.hash;

        //return the saved user
        return user;
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
        delete user.hash;

        return user;
    }
}