import { BaseEntity } from './base.model';
import { Attachment } from './attachment.model';
import { Telecom, ContactLink } from './contact.model';
import { Address } from './address.model';
import { UnionType } from './project.model';
import { Gender, Ethnicity } from './base-enums.model';


export enum ProfileType {
    Performer  = "performer",
    AgentManager = "agent_manager",
    CastingDirector = "casting_director",
    Producer = "producer",
    Director = "director",
    Writer = "writer"
}

export enum RepresentationType {
    TheatricalAgent = "agent_theatrical",
    CommercialAgent = "agent_commercial",
    LiteraryAgent = "agent_lit",
    Manager = "manager",
    Publicist = "publicist",
    Legal = "legal",
}

export enum EyeColor {
    Amber = "Amber",
    Brown = "Brown",
    Blue = "Blue",
    Green = "Green",
    Gray= "Gray",
    Hazel = "Hazel",
    Other = "Other",
}

export enum HairColor {
    Blond = "Blond",
    Brown = "Brown",
    Black = "Black",
    Auburn = "Auburn",
    Red = "Red",
    Gray = "Gray",
    White = "White",
    Purple = "Purple",
    Pink = "Pink",
    Green = "Green",
    Other = "Other",
    NotApplicable = "NA",
}
export enum HairLength {
    Bald = "Bald",
    Receding = "Receding",
    BuzzCut = "Buzz Cut",
    Short = "Short",
    ChinLength = "ChinLength",
    ShoulderLength = "ShoulderLength",
    Long = "Long",
}

export enum Physique {
    Slim = "Slim",
    Average = "Average",
    Athletic = "Athletic",
    Heavyset = "Heavyset"
}

export enum VoiceType {
    Alto = "Alto",
    Baritone = "Baritone",
    Bass = "Bass",
    Soprano = "Soprano",
    Tenor = "Tenor",
}

export interface Profile extends BaseEntity {
    type: ProfileType;
}

export interface PerformerProfile extends Profile {
    type: ProfileType.Performer;

    permalink: string;

    demographics: Demographics;
    unionAffiliations: UnionType[];
    tagline: string;
    biography: string;

    representation: Representation[];
    training: PerformanceTraining[];

    contacts: Telecom[];
    links: ContactLink[];
    addresses: Address[];

    headshots: Attachment[];
    otherImages: Attachment[];
    reelMedia: Attachment[];
    otherMedia: Attachment[];
    
    creditSections: PerformanceCreditSection[];
    
    //TODO add all the data credits, imdb, headshots, etc...

}
export interface Demographics extends BaseEntity {
    stageName: string;
    playingAge: string;
    eyeColor: EyeColor;
    gender: Gender;
    ethnicAppearance: Ethnicity;
    citizenship: string;
    hairColor: HairColor;
    hairLength: HairLength;
    height: string;
    weight: string;
    neck: string;
    arm: string;
    inseam: string;
    waist: string;
    chest: string;
    shoe: string;
    hands: string;
    head: string;
    physique: Physique;
    voiceTypes: string[];
    languages: string[]
    accents: string[]
    instruments: string[]
    sports: string[]
    otherSkills: string[]
}

export interface Representation extends BaseEntity {
    type: RepresentationType;
    company: string;
    description: string;
    contacts: Telecom[];
    links: ContactLink[];
    addresses: Address[];
    agents: RepresentationAgent[];
}

export interface RepresentationAgent extends BaseEntity {
    name: string;
    contacts: Telecom[];
    links: ContactLink[];
    addresses: Address[];
}

export interface PerformanceTraining extends BaseEntity {
    when: string;
    where: string;
    name: string;
    detail: string;
}

export interface PerformanceCreditSection extends BaseEntity {
    credits: PerformanceCredit[]
}

export interface PerformanceCredit extends BaseEntity {
    when: string;
    projectType: string;
    projectName: string;
    roleName: string;
    roleType: string;
    director: string;
}

export interface AgentManagerProfile extends Profile {
    type: ProfileType.AgentManager;
    //TODO add all the data credits, imdb, headshots, etc...
}
