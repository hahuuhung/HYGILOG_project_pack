import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TemperatureService } from './temperature.service';
import { TemperatureController } from './temperature.controller';
import { TemperatureRecord, TemperatureRecordSchema } from './schemas/temperature.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: TemperatureRecord.name, schema: TemperatureRecordSchema }])],
  controllers: [TemperatureController],
  providers: [TemperatureService],
  exports: [TemperatureService],
})
export class TemperatureModule {}
