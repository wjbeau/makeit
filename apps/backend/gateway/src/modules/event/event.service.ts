import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Event,
  EventType,
  PermissionRole,
  Project,
  ProjectEventType,
  Audition,
  AuditionType,
} from '@makeit/types';
import {
  ensureAdminPermission,
  permissionsSpec,
} from '../../schema/permission.schema';
import { EventModel, EventDocument } from '../../schema/event.schema';
import { AuditionService } from '../audition/audition.service';
import { ProjectService } from '../project/project.service';
import * as moment from 'moment';
import * as _ from 'lodash';

const DATE_LIMIT = 8640000000000000;

@Injectable()
export class EventService {
  constructor(
    private auditionService: AuditionService,
    private projectService: ProjectService,
    @InjectModel(EventModel.name)
    private eventModel: Model<EventDocument>
  ) {}

  async save(id: string, event: Event, userid): Promise<Event | undefined> {
    //the path variable must match the data posted
    if ((id || event._id) && id !== event._id) {
      throw new BadRequestException();
    }

    if (!id) {
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

  async findAllForUser(
    id,
    start: Date,
    end: Date
  ): Promise<Event[] | undefined> {
    const fromDate = start ? start : new Date(-DATE_LIMIT);
    const toDate = end ? end : new Date(DATE_LIMIT);

    const projects = await this.projectService.findAllForUser(id, start, end);
    const projectEvents = projects.flatMap((p) =>
      this.projectToEvents(p, start, end)
    );

    const auditions = await this.auditionService.findAllForUser(id, start, end);
    const auditionEvents = auditions.map((a) => this.auditionToEvent(a));

    const agg = {
      $and: [
        { start: { $gte: fromDate } },
        { start: { $lte: toDate } },
        permissionsSpec(id, null, [
          PermissionRole.Admin,
          PermissionRole.Editor,
          PermissionRole.Viewer,
        ]),
      ],
    };

    const result: Event[] = await this.eventModel.find(agg).lean().exec();

    return []
      .concat(projectEvents, auditionEvents, result)
      .sort((a, b) => a.start - b.start);
  }

  public getLabelForEnum(data, value: string) {
    const label = Object.keys(data).find((k) => data[k] === value);
    return label ? _.startCase(label) : 'Unspecified';
  }

  private auditionToEvent(aud: Audition) {
    return {
      start: aud.auditionTime,
      end: moment(aud.auditionTime).add(1, 'hour').toDate(),
      description: aud.instructions,
      eventType: EventType.Audition,
      participants: aud.participants,
      permissions: aud.permissions,
      title:
        this.getLabelForEnum(AuditionType, aud.type) +
        (aud.breakdown?.project?.name
          ? ' for ' + aud.breakdown?.project?.name
          : ''),
      location: aud.address,
      sourceId: aud._id,
    };
  }

  private projectToEvents(p: Project, start: Date, end: Date) {
    if (!p.events) {
      return [];
    }

    return p.events
      .filter((e) => e.time >= start && e.time <= end)
      .map((pe) => {
        return {
          start: pe.time,
          end: moment(pe.time).add(1, 'hour').toDate(),
          description: pe.notes,
          eventType: EventType.ProjectMeeting,
          participants: pe.participants,
          permissions: pe.permissions,
          title:
            this.getLabelForEnum(ProjectEventType, pe.eventType) +
            ' for ' +
            p.name,
          location: pe.location,
          sourceId: p._id,
        };
      });
  }
}
