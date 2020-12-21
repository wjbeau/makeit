import { Address } from './address.model';
import { HasPermissions } from './permission.model';
import { HasParticipants } from './participant.model';
import { BaseEntity } from './base.model';

export interface Event extends BaseEntity, HasPermissions, HasParticipants {
    startTime: Date;
    endTime: Date;
    location?: Address;
    description: string;
    title: string;
    eventType: EventType;
}

export enum EventType {
    ProjectMeeting = "Project Meeting",
    Audition = "Audition",
    Calendar = "Calendar",
    Reminder = "Reminder",
}