// Model / State objects for the auth feature

export interface AuthRequest {
    username: string;
    password: string;
}

export interface UserAccount {
    userId: string;
    password?: string; //note this will not be populated by the server when returning account objects
    firstName: string;
    lastName: string;
    
    profiles: PerformerProfile|AgentManagerProfile[];
}

export interface AuthenticationState {
    user?: UserAccount;
    loading: boolean;
}

export interface PerformerProfile {
    type: ProfileType.Performer;
    //TODO add all the data credits, imdb, headshots, etc...

}

export interface AgentManagerProfile {
    type: ProfileType.AgentManager;
    //TODO add all the data credits, imdb, headshots, etc...
}

export interface AccountReference {
    type: AccountReferenceType;
    reference: string;
    role: ParticipantType;
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

export enum AccountReferenceType {
    System  = "system",
    Name = "name"
}

export enum ProfileType {
    Performer  = "performer",
    AgentManager = "agent_manager",
    CastingDirector = "casting_director",
    Producer = "producer",
    Director = "director",
    Writer = "writer"
}