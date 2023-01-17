import { PrismaModule } from "./../prisma/prisma.module";
import { Module } from '@nestjs/common';
import { UtilsService } from './utils.service';
import { UtilsController } from './utils.controller';

@Module({
  imports: [PrismaModule],
  controllers: [UtilsController],
  providers: [UtilsService]
})
export class UtilsModule {}
