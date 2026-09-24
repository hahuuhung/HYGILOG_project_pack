import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NfcService } from './nfc.service';
import { NfcController } from './nfc.controller';
import { NfcTag, NfcTagSchema, NfcScan, NfcScanSchema } from './schemas/nfc.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: NfcTag.name, schema: NfcTagSchema },
    { name: NfcScan.name, schema: NfcScanSchema }
  ])],
  controllers: [NfcController],
  providers: [NfcService],
  exports: [NfcService],
})
export class NfcModule {}
