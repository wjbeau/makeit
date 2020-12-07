import { Address } from './address.model';
import { HasAttachments } from './attachment.model';
import { BaseEntity } from './base.model';
import { Breakdown } from './breakdown.model';
import { HasParticipants } from './participant.model';
import { UserAccount } from './user.model';


export interface Audition extends BaseEntity, HasAttachments, HasParticipants {
    breakdown: Breakdown;
    
    instructions: string;
    type: AuditionType;
    auditionTime: Date;
    deadline: Date;
    callbackDate: Date;
    address: Address;
    status: AuditionStatus;
    statusReason: string;  //reason for status

    followUpTo?: Audition;

    reminderNote: string;
    reminderTime: Date;

    notes: AuditionNote[];
}

export interface AuditionNote extends HasAttachments {
    description: string;
    createdBy: UserAccount;
    createdOn: Date;
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
