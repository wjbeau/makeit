import { Profile } from './profile.model';
import { BaseEntity } from './base.model';

export interface AuthRequest {
    username: string;
    password: string;
}

export interface AuthResponse {
    access_token: string,
    user: UserAccount
}

export interface UserAccount extends BaseEntity {
    email: string;
    password?: string; //note this will not be populated by the server when returning account objects
    firstName: string;
    lastName: string;
    
    profiles: Profile[];
}

export interface RoleAssignment {
    reference: string;
    referenceType: ReferenceType;
    role: ParticipantType;
}

export enum ReferenceType {
    UserAccount  = "UserAccount",
    Name = "Name"
}

export enum ParticipantType {
    Performer  = "performer",
    Reader = "reader",
    AgentManager = "agent_manager",
    CastingDirector = "casting_director",
    CastingAssociate = "casting_associate",
    Producer = "producer",
    Director = "director",
    Writer = "writer"
}