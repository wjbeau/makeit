import {
  Audition,
  ParticipantType,
  ParticipantReferenceType,
  UserAccount,
  toParticipantReference
} from '@makeit/types';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuditionDocument, AuditionModel } from '../../schema/Audition.schema';
import { BreakdownService } from '../breakdown/breakdown.service';

@Injectable()
export class AuditionService {
  constructor(
    private breakdownService: BreakdownService,
    @InjectModel(AuditionModel.name)
    private auditionModel: Model<AuditionDocument>
  ) {}

  async save(id: string, audition: Audition, userid: any): Promise<Audition | undefined> {
    //the path variable must match the data posted
    if ((id || audition._id) && id !== audition._id) {
      throw new BadRequestException();
    }

    //if necessary save the project first
    if (audition.breakdown) {
      const breakdownResult = await this.breakdownService.save(
        audition.breakdown._id,
        audition.breakdown
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

    result.populate({
      path: 'breakdown',
      populate: { path: 'project' },
    });

    return result.toObject();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async findById(id: any): Promise<Audition | undefined> {
    return await this.auditionModel.findOne({ _id: id }).lean().exec();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async findAllForUser(id: any): Promise<Audition[] | undefined> {
    //find all auditions where the given user is a relevant participant
    const result: Audition[] = await this.auditionModel
      .find({
        // 'participants.info.type': ParticipantReferenceType.UserAccount,
        // 'participants.info.ref': id,
        // 'participants.role': {
        //   $in: [
        //     ParticipantType.Auditioning,
        //     ParticipantType.Cast,
        //     ParticipantType.AgentManager,
        //     ParticipantType.CastingAssociate,
        //     ParticipantType.CastingDirector,
        //     ParticipantType.Producer,
        //     ParticipantType.Director,
        //   ],
        // }, TODO replace with a permissions model
      })
      .populate({
        path: 'breakdown',
        populate: { path: 'project' },
      })
      .sort({
        deadline: -1,
        auditionTime: -1,
      })
      .lean()
      .exec();
    return result;
  }
}
