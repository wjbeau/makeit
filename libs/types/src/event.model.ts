import { Address } from './address.model';
import { HasPermissions } from './permission.model';
import { HasParticipants } from './participant.model';
import { BaseEntity } from './base.model';
import { HasAttachments } from './attachment.model';

export interface Event extends BaseEntity, HasPermissions, HasAttachments, HasParticipants {
    start: Date;
    end: Date;
    location?: Address;
    description: string;
    title: string;
    eventType: EventType;
    sourceId?;
}

export enum EventType {
    ProjectMeeting = "Project Meeting",
    Audition = "Audition",
    Calendar = "Calendar",
    Reminder = "Reminder",
}