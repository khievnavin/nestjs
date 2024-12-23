import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PrismaModule } from "../prisma/prisma.module";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy, RefreshTokenStrategy } from "./strategy";
import { PassportModule } from "@nestjs/passport";

@Module({
    imports: [PrismaModule, JwtModule.register({})],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, RefreshTokenStrategy , PassportModule]
})
export class AuthModule {}