import { PersonInfo } from './user.model';

export const toParticipantReference = (info: PersonInfo): ParticipantReference => {
    let type = ParticipantReferenceType.Name;
    if('email' in info) {
        type = ParticipantReferenceType.UserAccount;
    }
    else if('contactType' in info) {
        type = ParticipantReferenceType.Contact;
    }

    return {
        ref: info._id,
        firstName: info.firstName,
        lastName: info.lastName,
        avatar: info.avatar ?? null,
        type: type
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const hasParticipants = (c: any) => {
    return c && 'participants' in c;
}

export interface HasParticipants {
  participants: Participant[];
}

export interface Participant {
  role: ParticipantType;
  info: ParticipantReference;
}

export interface ParticipantReference extends PersonInfo {
  ref: string;
  type: ParticipantReferenceType;

}

export enum ParticipantReferenceType {
    UserAccount  = "UserAccount",
    Name = "Name",
    Contact = "Contact"
}

export enum ParticipantType {
  Auditioning = 'auditioning',
  Cast = 'cast',
  Reader = 'reader',
  AgentManager = 'agent_manager',
  CastingDirector = 'casting_director',
  CastingAssociate = 'casting_associate',
  Producer = 'producer',
  Director = 'director',
  Writer = 'writer',
}
