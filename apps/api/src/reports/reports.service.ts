import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { TemperatureRecord, TemperatureRecordDocument } from '../temperature/schemas/temperature.schema';
import { Checklist, ChecklistDocument } from '../checklists/schemas/checklist.schema';
import { Batch, BatchDocument } from '../traceability/schemas/batch.schema';
import { CorrectiveAction, CorrectiveActionDocument } from '../corrective-actions/schemas/corrective-action.schema';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(TemperatureRecord.name) private tempModel: Model<TemperatureRecordDocument>,
    @InjectModel(Checklist.name) private checklistModel: Model<ChecklistDocument>,
    @InjectModel(Batch.name) private batchModel: Model<BatchDocument>,
    @InjectModel(CorrectiveAction.name) private capaModel: Model<CorrectiveActionDocument>,
  ) {}

  async getDashboardStats(organizationId: string) {
    const orgObjectId = new Types.ObjectId(organizationId);

    const [tempStats, checklistStats, batchesCount, expiringBatches, openCapas] = await Promise.all([
      this.tempModel.aggregate([
        { $match: { organizationId: orgObjectId } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      this.checklistModel.aggregate([
        { $match: { organizationId: orgObjectId } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      this.batchModel.countDocuments({ organizationId: orgObjectId }),
      this.batchModel.countDocuments({
        organizationId: orgObjectId,
        expiryDate: { $lte: new Date(Date.now() + 3 * 86400000) },
        status: { $ne: 'depleted' },
      }),
      this.capaModel.countDocuments({
        organizationId: orgObjectId,
        status: { $in: ['open', 'in_progress'] },
      }),
    ]);

    const tempMap = tempStats.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {} as Record<string, number>);

    const totalTemp = (tempMap['ok'] || 0) + (tempMap['warning'] || 0) + (tempMap['critical'] || 0);
    const okTemp = tempMap['ok'] || 0;
    const tempComplianceRate = totalTemp > 0 ? Math.round((okTemp / totalTemp) * 1000) / 10 : 100;

    return {
      temperature: {
        total: totalTemp,
        ok: tempMap['ok'] || 0,
        warning: tempMap['warning'] || 0,
        critical: tempMap['critical'] || 0,
        complianceRate: tempComplianceRate,
      },
      checklists: checklistStats.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {} as Record<string, number>),
      inventory: {
        totalBatches: batchesCount,
        expiringWithin72Hours: expiringBatches,
      },
      capa: {
        openIncidents: openCapas,
      },
      overallHaccpComplianceScore: tempComplianceRate,
    };
  }

  async getTemperatureSummary(organizationId: string, siteId?: string) {
    const match: Record<string, any> = { organizationId: new Types.ObjectId(organizationId) };
    if (siteId) match.siteId = new Types.ObjectId(siteId);

    return this.tempModel.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$equipmentName',
          avgTemp: { $avg: '$value' },
          minTemp: { $min: '$value' },
          maxTemp: { $max: '$value' },
          totalReadings: { $sum: 1 },
          lastReading: { $max: '$createdAt' },
        },
      },
      { $sort: { totalReadings: -1 } },
    ]);
  }

  async getChecklistCompliance(organizationId: string) {
    return this.checklistModel.aggregate([
      { $match: { organizationId: new Types.ObjectId(organizationId) } },
      {
        $group: {
          _id: '$siteId',
          total: { $sum: 1 },
          approved: {
            $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] },
          },
        },
      },
    ]);
  }
}
