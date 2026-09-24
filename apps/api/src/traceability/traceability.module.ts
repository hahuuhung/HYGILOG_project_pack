import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TraceabilityService } from './traceability.service';
import { TraceabilityController } from './traceability.controller';
import { Batch, BatchSchema } from './schemas/batch.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Batch.name, schema: BatchSchema }])],
  controllers: [TraceabilityController],
  providers: [TraceabilityService],
  exports: [TraceabilityService],
})
export class TraceabilityModule {}
