import { Audition, ParticipantType, ParticipantReferenceType } from '@makeit/types';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';
import { AuditionDocument, AuditionModel } from '../../schema/Audition.schema';
import { BreakdownService } from '../breakdown/breakdown.service';

@Injectable()
export class AuditionService {
  constructor(
    private breakdownService: BreakdownService, 
    @InjectModel(AuditionModel.name)
    private auditionModel: Model<AuditionDocument>
  ) {}

  async save(id: string, audition: Audition): Promise<Audition | undefined> {
    
    console.log("Saving Participants:");
    audition.participants.forEach(p => console.log(p))
    //the path variable must match the data posted
    if((id || audition._id) && id !== audition._id) {
      throw new BadRequestException();
    }
    
    //if necessary save the project first
    if(audition.breakdown) {
      const breakdownResult = await this.breakdownService.save(audition.breakdown._id, audition.breakdown)
      audition.breakdown = breakdownResult;
    }
    const options = { upsert: true, new: true, setDefaultsOnInsert: true };
    // Find the document and update it if required or save a new one if not.  
    const result = await this.auditionModel.findByIdAndUpdate(
            { _id: audition._id || mongoose.Types.ObjectId() }, 
            audition, 
            options
        )
        .populate({
          path: 'breakdown',
          populate: { path: 'project' }
        })
        .exec();

    return result;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async findById(id: any): Promise<Audition | undefined> {
    return await this.auditionModel.findOne({_id: id}).lean().exec();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async findAllForUser(id: any): Promise<Audition[] | undefined> {
    //find all auditions where the given user is a relevant participant
    const result: Audition[] = await this.auditionModel
      .find({
        'participants.info.type': ParticipantReferenceType.UserAccount,
        'participants.info.ref': id,
        'participants.role': {
          $in: [
            ParticipantType.Auditioning,
            ParticipantType.Cast,
            ParticipantType.AgentManager,
            ParticipantType.CastingAssociate,
            ParticipantType.CastingDirector,
            ParticipantType.Producer,
            ParticipantType.Director,
          ],
        },
      })
      .populate({
        path: 'breakdown',
        populate: { path: 'project' }
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
