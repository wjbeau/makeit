import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event, PermissionRole } from '@makeit/types';
import { ensureAdminPermission, permissionsSpec } from '../../schema/permission.schema';
import {
  EventModel,
  EventDocument
} from '../../schema/event.schema';

const DATE_LIMIT = 8640000000000000

@Injectable()
export class EventService {
  constructor(
    @InjectModel(EventModel.name)
    private eventModel: Model<EventDocument>
  ) {}

  async save(id: string, event: Event, userid): Promise<Event | undefined> {
    //the path variable must match the data posted
    if ((id || event._id) && id !== event._id) {
      throw new BadRequestException();
    }

    if(!id) {
      ensureAdminPermission(event, userid);
    }

    // Find the document and update it if required or save a new one if not.
    const result = await this.eventModel
      .findOne({ _id: event._id })
      .then((dbRes) => {
        if (dbRes) {
          dbRes.set(event);
          return dbRes.save();
        } else {
          return this.eventModel.create(event);
        }
      })
      .catch((error) => {
        throw new BadRequestException(error, 'Database update failed.');
      });

    return result.toObject();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async findById(id: any): Promise<Event | undefined> {
    return await this.eventModel.findOne({ _id: id }).lean().exec();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async findAllForUser(id: any, start: Date, end: Date): Promise<Event[] | undefined> {
    const fromDate = start ? start : new Date(-DATE_LIMIT);
    const toDate = end ? start : new Date(DATE_LIMIT)

    //TODO we need to pull in projects, auditions and other types here then merge with the 
    //results of the calendar collection query
    const projectMeetings = []
    const auditions = []    
    
    const result: Event[] = await this.eventModel
      .find({
        $and: [
          {
            $and: [
              { startTime: { $gt: fromDate }},
              { startTime: { $lt: toDate }}
            ]
          },
          permissionsSpec(id, null, [PermissionRole.Admin, PermissionRole.Editor, PermissionRole.Viewer])
        ]
      })
      .lean()
      .exec();

    return []
      .concat(projectMeetings, auditions, result)
      .sort((a,b) => a.startTime - b.startTime)
  }
}
