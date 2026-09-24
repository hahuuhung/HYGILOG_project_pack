import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChecklistsService } from './checklists.service';
import { ChecklistsController } from './checklists.controller';
import { Checklist, ChecklistSchema } from './schemas/checklist.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Checklist.name, schema: ChecklistSchema }])],
  controllers: [ChecklistsController],
  providers: [ChecklistsService],
  exports: [ChecklistsService],
})
export class ChecklistsModule {}
