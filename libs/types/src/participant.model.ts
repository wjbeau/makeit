
export interface HasParticipants {
    participants: Participant[];
}

export interface Participant {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    reference: any;
    referenceType: ReferenceType;
    role: ParticipantType;
}

export enum ReferenceType {
    UserAccount  = "UserAccount",
    Name = "Name",
    Contact = "Contact"
}

export enum ParticipantType {
    Auditioning  = "auditioning",
    Cast  = "cast",
    Reader = "reader",
    AgentManager = "agent_manager",
    CastingDirector = "casting_director",
    CastingAssociate = "casting_associate",
    Producer = "producer",
    Director = "director",
    Writer = "writer"
}