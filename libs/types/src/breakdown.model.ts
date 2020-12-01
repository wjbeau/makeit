import { Attachment } from './attachment.model';
import { Link } from './link.model';


export interface ProjectBreakdowns {
    id: string;

    name: string;
    projectType: string; 
    description: string;
    union: string;
    unionStatusPending?: boolean;
    unionContract?: string;
    startDate: string;

    attachments: Attachment[]; //eg sides.
    links: Link[]; //eg project website
}

export interface Breakdown {
    id: string;
    roleName: string;
    roleDescription: string;
    roleType: string;
    rate: string; //how much does it pay

    gender?: string;
    ageMin?: number;
    ageMax?: number;
    ethnicities?: string[];
    attachments: Attachment[]; //eg sides.

    project: ProjectBreakdowns;
}