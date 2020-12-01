import { Breakdown } from './breakdown.model';
import { Address } from './address.model';
import { Link } from './link.model';
import { RoleAssignment } from './user.model';
import { Attachment } from './attachment.model';


export interface Audition {
    id: string;
    breakdown: Breakdown;
    
    instructions?: string;
    type?: string;
    auditionTime?: string;
    deadline?: string;
    callbackDate?: string;
    address?: Address;
    status: AuditionStatus;
    statusReason?: string;  //reason for status
    links?: Link[];
    participants?: RoleAssignment[];
}

export interface AuditionNote {
    id: string;
    auditionId: string;
    noteType: string;
    description: string;
    attachments: Attachment[];
    
    author: string;
    createdOn: string;
    lastUpdatedOn: string;
    visibility: NoteVisibility;
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
    Performed = "performed", //audition has taken place but no further status has been notified
    Successful = "success", //audition has been successful (i.e. led to project or callback)
}
