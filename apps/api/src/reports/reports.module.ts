import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { TemperatureRecord, TemperatureRecordSchema } from '../temperature/schemas/temperature.schema';
import { Checklist, ChecklistSchema } from '../checklists/schemas/checklist.schema';
import { Batch, BatchSchema } from '../traceability/schemas/batch.schema';
import { CorrectiveAction, CorrectiveActionSchema } from '../corrective-actions/schemas/corrective-action.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TemperatureRecord.name, schema: TemperatureRecordSchema },
      { name: Checklist.name, schema: ChecklistSchema },
      { name: Batch.name, schema: BatchSchema },
      { name: CorrectiveAction.name, schema: CorrectiveActionSchema },
    ]),
    AuthModule,
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
