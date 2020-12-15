import { Breakdown } from '@makeit/types';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  BreakdownDocument,
  BreakdownModel,
} from '../../schema/breakdown.schema';
import {
  ProjectModel,
  ProjectModelDocument,
} from '../../schema/project.schema';

@Injectable()
export class BreakdownService {
  constructor(
    @InjectModel(BreakdownModel.name)
    private breakdownModel: Model<BreakdownDocument>,
    @InjectModel(ProjectModel.name)
    private projectModel: Model<ProjectModelDocument>
  ) {}

  async save(id: string, breakdown: Breakdown): Promise<Breakdown | undefined> {
    //the path variable must match the data posted
    if ((id || breakdown._id) && id !== breakdown._id) {
      throw new BadRequestException();
    }

    //if necessary save the project first
    if (breakdown.project) {
      const projectResult = await this.projectModel
          .findOne({ _id: breakdown.project._id })
          .then((dbRes) => {
            if (dbRes) {
              dbRes.set(breakdown.project);
              return dbRes.save();
            } else {
              return this.projectModel.create(breakdown.project);
            }
          })
          .catch((error) => {
            throw new BadRequestException(error, 'Database update failed.');
          });
      breakdown.project = projectResult;
    }

    // Find the document and update it if required or save a new one if not.
    const result = await this.breakdownModel
      .findOne({ _id: breakdown._id })
      .then((dbRes) => {
        if (dbRes) {
          dbRes.set(breakdown);
          return dbRes.save();
        } else {
          return this.breakdownModel.create(breakdown);
        }
      })
      .catch((error) => {
        throw new BadRequestException(error, 'Database update failed.');
      });

    return result.toObject();
  }
}
