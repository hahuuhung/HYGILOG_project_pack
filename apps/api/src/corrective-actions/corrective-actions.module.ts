import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CorrectiveActionsService } from './corrective-actions.service';
import { CorrectiveActionsController } from './corrective-actions.controller';
import { CorrectiveAction, CorrectiveActionSchema } from './schemas/corrective-action.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: CorrectiveAction.name, schema: CorrectiveActionSchema }])],
  controllers: [CorrectiveActionsController],
  providers: [CorrectiveActionsService],
  exports: [CorrectiveActionsService],
})
export class CorrectiveActionsModule {}
