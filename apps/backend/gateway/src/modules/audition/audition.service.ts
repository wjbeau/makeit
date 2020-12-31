import {
  Audition, PermissionRole
} from '@makeit/types';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuditionDocument, AuditionModel } from '../../schema/Audition.schema';
import { BreakdownService } from '../breakdown/breakdown.service';
import { permissionsSpec, ensureAdminPermission } from '../../schema/permission.schema';

@Injectable()
export class AuditionService {
  constructor(
    private breakdownService: BreakdownService,
    @InjectModel(AuditionModel.name)
    private auditionModel: Model<AuditionDocument>
  ) {}

  async save(id: string, audition: Audition, userid): Promise<Audition | undefined> {
    //the path variable must match the data posted
    if ((id || audition._id) && id !== audition._id) {
      throw new BadRequestException();
    }

    if(!id) {
      ensureAdminPermission(audition, userid);
      audition.notes?.forEach(n => ensureAdminPermission(n, userid))
    }

    //if necessary save the project first
    if (audition.breakdown) {
      const breakdownResult = await this.breakdownService.save(
        audition.breakdown._id,
        audition.breakdown,
        userid
      );
      audition.breakdown = breakdownResult;
    }

    // Find the document and update it if required or save a new one if not.
    const result = await this.auditionModel
      .findOne({ _id: audition._id })
      .then((dbRes) => {
        if (dbRes) {
          dbRes.set(audition);
          return dbRes.save();
        } else {
          return this.auditionModel.create(audition);
        }
      })
      .catch((error) => {
        throw new BadRequestException(error, 'Database update failed.');
      });

    await result.populate([
      {path: 'breakdown', populate: { path: 'project' }},
      {path: 'notes.createdBy', select: 'firstName lastName _id avatar' }
    ]).execPopulate();

    return result.toObject();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async findById(id: any): Promise<Audition | undefined> {
    return await this.auditionModel.findOne({ _id: id }).lean().exec();
  }
            
  async findAllForUser(id, from?: Date, to?: Date): Promise<Audition[] | undefined> {
    let datefilter = {}
    if(from && to) {

      datefilter = {
          $and: [
            { 'auditionTime': { $gte: from }},
            { 'auditionTime': { $lte: to }}
          ]
        }
    }
    //find all auditions where the given user is a relevant participant
    const result: Audition[] = await this.auditionModel
      .find({
        $and: [
          datefilter,
          permissionsSpec(id, null, [PermissionRole.Admin, PermissionRole.Editor, PermissionRole.Viewer])
        ]
      })
      .populate([
        {path: 'breakdown', populate: { path: 'project' }},
        {path: 'notes.createdBy',  select: 'firstName lastName _id avatar' }
      ])
      .sort({
        deadline: -1,
        auditionTime: -1,
      })
      .lean()
      .exec();
    return result;
  }
}
