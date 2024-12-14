import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { config } from 'process';

@Injectable()
export class PrismaService extends PrismaClient {
    constructor(config: ConfigService){
        super({
            datasources:{
                db:{
                    url: config.get('DATABASE_URL'),
                }
            }
        });
    }

    cleasDb(){
        return this.$transaction([
            
            // this.bookmark.deleteMany(),
            this.user.deleteMany(),
        ]);
    }
}
