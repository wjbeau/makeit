import { BaseEntity } from './base.model';


export enum ProfileType {
    Performer  = "performer",
    AgentManager = "agent_manager",
    CastingDirector = "casting_director",
    Producer = "producer",
    Director = "director",
    Writer = "writer"
}

export interface Profile extends BaseEntity {
    type: ProfileType;
}

export interface PerformerProfile extends Profile {
    type: ProfileType.Performer;
    //TODO add all the data credits, imdb, headshots, etc...

}

export interface AgentManagerProfile extends Profile {
    type: ProfileType.AgentManager;
    //TODO add all the data credits, imdb, headshots, etc...
}
