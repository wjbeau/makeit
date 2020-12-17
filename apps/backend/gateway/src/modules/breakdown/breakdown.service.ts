import { Breakdown } from '@makeit/types';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  BreakdownDocument,
  BreakdownModel
} from '../../schema/breakdown.schema';
import { ProjectService } from '../project/project.service';
import { ensureAdminPermission } from '../../schema/permission.schema';

@Injectable()
export class BreakdownService {
  constructor(
    private projectService: ProjectService,
    @InjectModel(BreakdownModel.name)
    private breakdownModel: Model<BreakdownDocument>
  ) {}

  async save(id: string, breakdown: Breakdown, userid): Promise<Breakdown | undefined> {
    //the path variable must match the data posted
    if ((id || breakdown._id) && id !== breakdown._id) {
      throw new BadRequestException();
    }

    if(!id) {
      ensureAdminPermission(breakdown, userid);
    }

    //if necessary save the project first
    if (breakdown.project) {
      const projectResult = await this.projectService.save(
        breakdown.project._id,
        breakdown.project,
        userid
      );
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
