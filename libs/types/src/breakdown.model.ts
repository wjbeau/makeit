import { Attachment } from './attachment.model';
import { Link } from './link.model';
import { BaseEntity } from './base.model';

export interface ProjectBreakdowns extends BaseEntity {
    name?: string;
    projectType?: ProjectType; 
    description?: string;
    union?: UnionType;
    startDate?: string;

    attachments?: Attachment[]; //eg sides.
    links?: Link[]; //eg project website
}

export interface Breakdown extends BaseEntity {
    roleName?: string;
    roleDescription?: string;
    roleType?: string;

    rate?: string; //how much does it pay
    gender?: string;
    ageMin?: number;
    ageMax?: number;
    ethnicities?: string[];
    attachments?: Attachment[]; //eg sides.

    project?: ProjectBreakdowns;
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
    DirectorsReel = 'Director\'s or Sizzle Reel',
    Print = 'Print',
    NewMedia = 'New Media',
    WebSeries = 'Web Series',
    Podcast = 'Podcast',
    VoiceOver = 'Voice Over',
    MusicVideo = 'Music Video',
    LiveEvent = 'Live Event',
    Other = 'Other'
}