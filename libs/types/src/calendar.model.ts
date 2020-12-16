import { Address } from './address.model';
import { BaseEntity } from './base.model';

export interface CalendarEvent extends BaseEntity {
    date: Date;
    location: Address;
    note: string;
    type: CalendarEventType;
}

export enum CalendarEventType {
    Audition = 'Audition',
    Project = 'Project',
    General = 'General',
    Reminder = 'Reminder'
}