import { Breakdown } from '@makeit/types';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';
import { BreakdownDocument, BreakdownModel, ProjectBreakdownsModelDocument, ProjectBreakdownsModel } from '../../schema/breakdown.schema';

@Injectable()
export class BreakdownService {
  constructor(
    @InjectModel(BreakdownModel.name)
    private breakdownModel: Model<BreakdownDocument>,
    @InjectModel(ProjectBreakdownsModel.name)
    private projectModel: Model<ProjectBreakdownsModelDocument>
  ) {}

  async save(id: string, breakdown: Breakdown): Promise<Breakdown | undefined> {
    //the path variable must match the data posted
    if((id || breakdown._id) && id !== breakdown._id) {
      throw new BadRequestException();
    }

    //if necessary save the project first
    if(breakdown.project) {
      const options = { upsert: true, new: true, setDefaultsOnInsert: true };
      const projectResult = await this.projectModel.findByIdAndUpdate(
        { _id: breakdown.project._id || mongoose.Types.ObjectId() }, breakdown.project, options).exec();
      breakdown.project = projectResult;
    }
    
    const options = { upsert: true, new: true, setDefaultsOnInsert: true };
    // Find the document and update it if required or save a new one if not.  
    const result = await this.breakdownModel.findByIdAndUpdate(
      { _id: breakdown._id || mongoose.Types.ObjectId() }, breakdown, options).exec();

    return result;
  }
}
