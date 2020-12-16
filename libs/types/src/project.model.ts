import { HasAttachments } from './attachment.model';
import { BaseEntity } from './base.model';
import { HasParticipants } from './participant.model';
import { Address } from './address.model';

export interface Project extends BaseEntity, HasAttachments, HasParticipants {
    name: string;
    projectType: ProjectType; 
    description: string;
    union: UnionType;
    startDate: Date;
    status: ProjectStatus;

    calls: ProjectCall[];
}

export interface ProjectCall extends BaseEntity, HasAttachments {
    callTime: Date;
    location: Address;
    notes: string;
}

export enum ProjectStatus {
    Provisional = 'Provisional',
    Active = 'Active',
    Completed = 'Completed',
    Cancelled = 'Cancelled'
}

export enum UnionType {
    NonUnion = 'Non-Union',
    SagAftra = 'SAG-AFTRA',
    SagAftraPending = 'SAG-AFTRA (Pending)',
    AEA = 'AEA'
}

export enum ProjectType {
    FeatureFilm = 'Feature Film',
    ShortFilm = 'Short Film',
    Pilot = 'Pilot',
    Episodic = 'Episodic',
    Miniseries = 'Miniseries',
    Theater = 'Theater',
    Industrial = 'Industrial',
    PSA = 'PSA',
    Promo = 'Promo',
    Commercial = 'Commercial',
    AdCampaign = 'Ad Campaign',
    PilotPresentation = 'Pilot Presentation',
    StudentFilm = 'Student Film',
    DirectorsReel = 'Director\'s Reel',
    SizzleReel = 'Sizzle Reel',
    Print = 'Print',
    NewMedia = 'New Media',
    WebSeries = 'Web Series',
    Podcast = 'Podcast',
    VoiceOver = 'Voice Over',
    MusicVideo = 'Music Video',
    LiveEvent = 'Live Event',
    MotionCapture = 'Motion Capture',
    ARPerformance = 'AR Performance',
    VirtualReality = 'Virtual Reality',
    Other = 'Other'
}