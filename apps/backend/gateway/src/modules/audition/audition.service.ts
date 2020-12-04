import { Audition, ParticipantType, ReferenceType } from '@makeit/types';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuditionDocument, AuditionModel } from '../../schema/Audition.schema';

@Injectable()
export class AuditionService {
  constructor(
    @InjectModel(AuditionModel.name)
    private auditionModel: Model<AuditionDocument>
  ) {}

  async save(id: string, audition: Audition): Promise<Audition | undefined> {
    //the path variable must match the data posted
    if((id || audition._id) && id !== audition._id) {
      throw new BadRequestException();
    }
    
    const options = { upsert: true, new: true, setDefaultsOnInsert: true };
    // Find the document and update it if required or save a new one if not
    return await this.auditionModel.findByIdAndUpdate(audition._id, audition, options).lean().exec();
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
        'participants.referenceType': ReferenceType.UserAccount,
        'participants.reference': id,
        'participants.roleType': {
          $in: [
            ParticipantType.Performer,
            ParticipantType.AgentManager,
            ParticipantType.CastingAssociate,
            ParticipantType.CastingDirector,
            ParticipantType.Producer,
            ParticipantType.Director,
          ],
        },
      })
      .populate('breakdown')
      .populate('project')
      .lean()
      .exec();
    return result;
  }
}
