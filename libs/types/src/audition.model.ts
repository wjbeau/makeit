import { Breakdown } from './breakdown.model';
import { Address } from './address.model';
import { Link } from './link.model';
import { RoleAssignment } from './user.model';
import { Attachment } from './attachment.model';
import { BaseEntity } from './base.model';


export interface Audition extends BaseEntity {
    breakdown: Breakdown;
    
    instructions?: string;
    type: AuditionType;
    auditionTime?: string;
    deadline?: string;
    callbackDate?: string;
    address?: Address;
    status: AuditionStatus;
    statusReason?: string;  //reason for status
    links?: Link[];
    participants?: RoleAssignment[];
    notes?: AuditionNotes[];

    followUpTo?: string;
}

export interface AuditionNotes {
    noteType: string;
    description: string;
    attachments: Attachment[];
    
    author: string;
    createdOn: string;
    lastUpdatedOn: string;
    visibility: NoteVisibility;
}

export enum AuditionType {
    InPersonAudition = "in_person_audition",
    OnlineAudition = "online_audition",
    SelfTape = "selfTape",
    Callback = "callback",
    ProducerSession = "producer_session",
    DirectorMeeting = "director_meeting",
    Chemistry = "chemistry",
    Other = "other"
}

export enum NoteVisibility {
    Public = "public",
    Participants = "participants",
    Representation = "representation",
    Private = "private"
}

export enum AuditionStatus {
    Invited = "invited", //performer has been invited to audition
    Accepted = "accepted", //performer has accepted
    Rejected = "rejected", //performer has rejected
    Performed = "performed", //audition has taken place (or the self tape been submitted) but no further status has been notified
    Successful = "success", //audition has been successful (i.e. led to project or callback)
}
