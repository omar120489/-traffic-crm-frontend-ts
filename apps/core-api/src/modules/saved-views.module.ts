import { Module } from '@nestjs/common';
import { SavedViewsController } from './saved-views.controller';
import { SavedViewsService } from './saved-views.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SavedViewsController],
  providers: [SavedViewsService],
  exports: [SavedViewsService],
})
export class SavedViewsModule {}

