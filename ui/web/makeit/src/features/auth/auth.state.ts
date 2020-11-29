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


export enum ProfileType {
    Performer  = "performer",
    AgentManager = "agent_manager"
}
