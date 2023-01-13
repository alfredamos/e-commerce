import { OnModuleInit } from '@nestjs/common';
import { OnModuleDestroy } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist';
import {PrismaClient} from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor(config: ConfigService){
        super({
            datasources: {
                db:{
                    url: config.get('DATABASE_URL'),
                }
            }
        })
    }
    onModuleInit() {
        this.$connect();
    }
    onModuleDestroy() {
        this.$disconnect();
    }
}
